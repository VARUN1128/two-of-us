import type { 
  Participant, 
  BingoBoard, 
  BingoConnection, 
  EventSettings, 
  QuestionnaireAnswer,
  WinningLine 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateRandomBoardLetters } from '../constants/config';
import { evaluateBingoBoard } from './bingoLogic';
import { compressImage } from './imageCompression';
import { 
  CURATED_EVENT_ATTENDEES, 
  rankMatchedProfiles, 
  type MatchedProfile, 
  type CandidateProfile 
} from './matchingAlgorithm';

const STORAGE_KEY_PREFIX = 'two_of_us_';
const SESSION_PARTICIPANT_KEY = `${STORAGE_KEY_PREFIX}current_participant_id`;
const LOCAL_PARTICIPANTS_KEY = `${STORAGE_KEY_PREFIX}participants`;
const LOCAL_ANSWERS_KEY = `${STORAGE_KEY_PREFIX}questionnaire_answers`;
const LOCAL_BOARDS_KEY = `${STORAGE_KEY_PREFIX}bingo_boards`;
const LOCAL_CONNECTIONS_KEY = `${STORAGE_KEY_PREFIX}bingo_connections`;
const LOCAL_SETTINGS_KEY = `${STORAGE_KEY_PREFIX}event_settings`;
const LOCAL_COMPLETED_LINES_KEY = `${STORAGE_KEY_PREFIX}completed_line_ids`;

// Default event settings
const defaultSettings: EventSettings = {
  id: 'event-settings-default',
  event_name: 'Two of Us Live Event',
  event_status: 'active',
  registration_enabled: true,
  bingo_enabled: true,
};

// Helper: read/write local storage JSON
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Clean Indian mobile number (e.g. removes +91, dashes, spaces, checks 10 digits starting with 6-9)
export function sanitizeAndValidateIndianMobile(input: string): { isValid: boolean; cleanMobile: string; error?: string } {
  let cleaned = input.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.length !== 10) {
    return { isValid: false, cleanMobile: cleaned, error: 'Mobile number must be a 10-digit Indian number' };
  }

  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: false, cleanMobile: cleaned, error: 'Indian mobile number should start with 6, 7, 8, or 9' };
  }

  return { isValid: true, cleanMobile: cleaned };
}

// Clean Instagram handle (ensure normalized string with or without @)
export function sanitizeInstagramId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export interface AdminParticipantRow {
  participant: Participant;
  completedLettersCount: number;
  completedLinesCount: number;
  isBoardComplete: boolean;
  lastActive: string;
  connections: BingoConnection[];
}

export class AppDataStore {
  /**
   * Register a new participant
   */
  static async registerParticipant(
    fullName: string,
    mobileInput: string,
    instagramInput: string,
    marketingOptOut = false
  ): Promise<{ success: boolean; participant?: Participant; error?: string }> {
    const mobileCheck = sanitizeAndValidateIndianMobile(mobileInput);
    if (!mobileCheck.isValid) {
      return { success: false, error: mobileCheck.error };
    }
    const cleanMobile = mobileCheck.cleanMobile;
    const cleanName = fullName.trim();
    if (!cleanName) {
      return { success: false, error: 'Full name cannot be empty' };
    }
    const cleanInstagram = sanitizeInstagramId(instagramInput);
    if (!cleanInstagram) {
      return { success: false, error: 'Instagram ID is required' };
    }

    // Check duplicate mobile in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase
          .from('participants')
          .select('id, full_name, mobile_number')
          .eq('mobile_number', cleanMobile)
          .maybeSingle();

        if (existing) {
          return {
            success: false,
            error: `A participant with mobile number ${cleanMobile} is already registered.`,
          };
        }

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();
        const participantData: Participant = {
          id: newId,
          full_name: cleanName,
          mobile_number: cleanMobile,
          instagram_id: cleanInstagram,
          created_at: now,
          terms_accepted: true,
          terms_accepted_at: now,
          marketing_opt_out: marketingOptOut,
          questionnaire_completed: false,
        };

        const { data, error } = await supabase
          .from('participants')
          .insert([participantData])
          .select()
          .single();

        if (error) {
          console.warn('Supabase registration error (table may not be initialized yet):', error);
          if (error.message?.includes('schema cache') || error.code === 'PGRST205') {
            console.warn('Supabase tables not initialized yet in SQL Editor. Falling back to local device storage.');
          } else {
            return { success: false, error: error.message };
          }
        } else if (data) {
          localStorage.setItem(SESSION_PARTICIPANT_KEY, data.id);
          // Also keep local fallback in sync
          const localList = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
          setLocal(LOCAL_PARTICIPANTS_KEY, [...localList.filter(p => p.id !== data.id), data]);

          return { success: true, participant: data };
        }
      } catch (err: unknown) {
        console.error('Error during Supabase registration, falling back to local store:', err);
      }
    }

    // Local / Offline fallback
    const localList = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const existing = localList.find((p) => p.mobile_number === cleanMobile);
    if (existing) {
      return {
        success: false,
        error: `A participant with mobile number ${cleanMobile} is already registered.`,
      };
    }

    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      full_name: cleanName,
      mobile_number: cleanMobile,
      instagram_id: cleanInstagram,
      created_at: new Date().toISOString(),
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      marketing_opt_out: marketingOptOut,
      questionnaire_completed: false,
    };

    localList.push(newParticipant);
    setLocal(LOCAL_PARTICIPANTS_KEY, localList);
    localStorage.setItem(SESSION_PARTICIPANT_KEY, newParticipant.id);

    return { success: true, participant: newParticipant };
  }

  /**
   * Log in or recover session by mobile number
   */
  static async loginByMobile(mobileInput: string): Promise<{ success: boolean; participant?: Participant; error?: string }> {
    const mobileCheck = sanitizeAndValidateIndianMobile(mobileInput);
    if (!mobileCheck.isValid) {
      return { success: false, error: mobileCheck.error };
    }
    const cleanMobile = mobileCheck.cleanMobile;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('mobile_number', cleanMobile)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          localStorage.setItem(SESSION_PARTICIPANT_KEY, data.id);
          return { success: true, participant: data };
        }
      } catch (e) {
        console.warn('Supabase login check failed, checking local:', e);
      }
    }

    const localList = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const found = localList.find(p => p.mobile_number === cleanMobile);
    if (found) {
      localStorage.setItem(SESSION_PARTICIPANT_KEY, found.id);
      return { success: true, participant: found };
    }

    return { success: false, error: 'No participant found with this mobile number. Please register.' };
  }

  /**
   * Get currently active participant
   */
  static async getCurrentParticipant(): Promise<Participant | null> {
    const id = localStorage.getItem(SESSION_PARTICIPANT_KEY);
    if (!id) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('participants')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (data) return data;
      } catch (err) {
        console.warn('Failed to fetch participant from Supabase:', err);
      }
    }

    const localList = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    return localList.find((p) => p.id === id) || null;
  }

  /**
   * Clear session
   */
  static clearSession(): void {
    localStorage.removeItem(SESSION_PARTICIPANT_KEY);
  }

  /**
   * Save an answer to the personality questionnaire
   */
  static async saveQuestionnaireAnswer(
    participantId: string,
    questionNumber: number,
    questionText: string,
    selectedOption: string
  ): Promise<void> {
    // 1. Immediately persist locally so answers are never lost
    const answers = getLocal<QuestionnaireAnswer[]>(LOCAL_ANSWERS_KEY, []);
    const existingIdx = answers.findIndex(
      (a) => a.participant_id === participantId && a.question_number === questionNumber
    );

    const entry: QuestionnaireAnswer = {
      participant_id: participantId,
      question_number: questionNumber,
      question_text: questionText,
      selected_option: selectedOption,
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      answers[existingIdx] = entry;
    } else {
      answers.push(entry);
    }
    setLocal(LOCAL_ANSWERS_KEY, answers);

    // 2. Sync with Supabase (handle both with or without unique constraint)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('questionnaire_answers')
          .delete()
          .eq('participant_id', participantId)
          .eq('question_number', questionNumber);

        await supabase
          .from('questionnaire_answers')
          .insert({
            participant_id: participantId,
            question_number: questionNumber,
            question_text: questionText,
            selected_option: selectedOption,
            created_at: new Date().toISOString(),
          });
      } catch (e) {
        console.warn('Supabase answer save error:', e);
      }
    }
  }

  /**
   * Get all answers for a participant
   */
  static async getQuestionnaireAnswers(participantId: string): Promise<Record<number, string>> {
    const result: Record<number, string> = {};

    // 1. Load from local store first
    const answers = getLocal<QuestionnaireAnswer[]>(LOCAL_ANSWERS_KEY, []);
    answers
      .filter((a) => a.participant_id === participantId)
      .forEach((a) => {
        result[a.question_number] = a.selected_option;
      });

    // 2. Merge from Supabase if available
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('questionnaire_answers')
          .select('question_number, selected_option')
          .eq('participant_id', participantId);

        if (data && data.length > 0) {
          data.forEach((row) => {
            result[row.question_number] = row.selected_option;
          });
        }
      } catch (e) {
        console.warn('Failed to load answers from Supabase:', e);
      }
    }

    return result;
  }

  /**
   * Get top personality matched profiles for a participant
   */
  static async getTopMatchedProfiles(participantId: string): Promise<MatchedProfile[]> {
    const userAnswers = await this.getQuestionnaireAnswers(participantId);

    // Load other participants from local store, curated list, and Supabase
    const candidateMap = new Map<string, CandidateProfile>();

    // 1. Add curated attendee profiles
    for (const curated of CURATED_EVENT_ATTENDEES) {
      candidateMap.set(curated.id, curated);
    }

    // 2. Add real attendees from local store
    const localParticipants = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const localAnswers = getLocal<QuestionnaireAnswer[]>(LOCAL_ANSWERS_KEY, []);

    for (const p of localParticipants) {
      if (p.id === participantId) continue;
      const ansMap: Record<number, string> = {};
      localAnswers
        .filter((a) => a.participant_id === p.id)
        .forEach((a) => {
          ansMap[a.question_number] = a.selected_option;
        });

      if (Object.keys(ansMap).length > 0) {
        candidateMap.set(p.id, {
          id: p.id,
          fullName: p.full_name,
          instagramId: p.instagram_id,
          answers: ansMap,
          isRealAttendee: true,
        });
      }
    }

    // 3. Add real attendees from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: remoteParticipants } = await supabase
          .from('participants')
          .select('id, full_name, instagram_id')
          .neq('id', participantId)
          .eq('questionnaire_completed', true);

        if (remoteParticipants && remoteParticipants.length > 0) {
          const remoteIds = remoteParticipants.map((r) => r.id);
          const { data: remoteAnswers } = await supabase
            .from('questionnaire_answers')
            .select('participant_id, question_number, selected_option')
            .in('participant_id', remoteIds);

          if (remoteAnswers) {
            const remoteAnsByParticipant = new Map<string, Record<number, string>>();
            remoteAnswers.forEach((row) => {
              if (!remoteAnsByParticipant.has(row.participant_id)) {
                remoteAnsByParticipant.set(row.participant_id, {});
              }
              remoteAnsByParticipant.get(row.participant_id)![row.question_number] = row.selected_option;
            });

            remoteParticipants.forEach((p) => {
              const answers = remoteAnsByParticipant.get(p.id);
              if (answers && Object.keys(answers).length > 0) {
                candidateMap.set(p.id, {
                  id: p.id,
                  fullName: p.full_name,
                  instagramId: p.instagram_id,
                  answers,
                  isRealAttendee: true,
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('Supabase matches query error (falling back to local):', err);
      }
    }

    const candidates = Array.from(candidateMap.values());
    return rankMatchedProfiles(userAnswers, candidates, participantId);
  }

  /**
   * Complete questionnaire and mark participant status
   */
  static async completeQuestionnaire(participantId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('participants')
          .update({ questionnaire_completed: true })
          .eq('id', participantId);
      } catch (e) {
        console.warn('Supabase questionnaire complete error:', e);
      }
    }

    const localList = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const idx = localList.findIndex((p) => p.id === participantId);
    if (idx >= 0) {
      localList[idx].questionnaire_completed = true;
      setLocal(LOCAL_PARTICIPANTS_KEY, localList);
    }

    // Ensure board is generated right after questionnaire completion
    await this.getOrCreateBingoBoard(participantId);
  }

  /**
   * Get or generate a fixed randomized 5x5 Bingo Board for a participant
   */
  static async getOrCreateBingoBoard(participantId: string): Promise<BingoBoard> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bingo_boards')
          .select('*')
          .eq('participant_id', participantId)
          .maybeSingle();

        if (data && !error) {
          return data;
        }

        if (!data) {
          const letters = generateRandomBoardLetters();
          const newBoard: BingoBoard = {
            id: crypto.randomUUID(),
            participant_id: participantId,
            letters,
            completed_letters: [],
            created_at: new Date().toISOString(),
          };

          const { data: created } = await supabase
            .from('bingo_boards')
            .insert([newBoard])
            .select()
            .single();

          if (created) return created;
        }
      } catch (e) {
        console.warn('Supabase board get/create error:', e);
      }
    }

    const boards = getLocal<BingoBoard[]>(LOCAL_BOARDS_KEY, []);
    let board = boards.find((b) => b.participant_id === participantId);
    if (!board) {
      board = {
        id: crypto.randomUUID(),
        participant_id: participantId,
        letters: generateRandomBoardLetters(),
        completed_letters: [],
        created_at: new Date().toISOString(),
      };
      boards.push(board);
      setLocal(LOCAL_BOARDS_KEY, boards);
    }

    return board;
  }

  /**
   * Process selfie image locally on the user's device
   * Note: Photos are stored directly on the user's phone and NOT uploaded to external databases or Supabase storage!
   */
  static async uploadSelfie(
    _participantId: string,
    _letter: string,
    imageSource: File | string
  ): Promise<string> {
    const compressed = await compressImage(imageSource);
    // Return compressed high quality data URL for local storage on the user's phone
    return compressed.dataUrl;
  }

  /**
   * Submit a completed Bingo letter connection
   */
  static async submitBingoConnection(
    participantId: string,
    letter: string,
    personName: string,
    selfieImageSource: File | string,
    randomQuestion: string,
    questionAnswer: string
  ): Promise<{
    success: boolean;
    connection?: BingoConnection;
    board?: BingoBoard;
    newlyCompletedLines: WinningLine[];
    totalCompletedLinesCount: number;
    cutLetters: string[];
    newlyCutLetters: string[];
    isFullBingoWon: boolean;
    isFullBoardCompleted: boolean;
    error?: string;
  }> {
    const cleanLetter = letter.trim().toUpperCase();
    const cleanName = personName.trim();

    if (!cleanName) {
      return { 
        success: false, 
        error: "Please enter the person's first name", 
        newlyCompletedLines: [], 
        totalCompletedLinesCount: 0,
        cutLetters: [],
        newlyCutLetters: [],
        isFullBingoWon: false,
        isFullBoardCompleted: false 
      };
    }

    // Validate that the name starts with the selected letter
    if (cleanName.charAt(0).toUpperCase() !== cleanLetter) {
      return {
        success: false,
        error: `Name "${cleanName}" does not start with letter "${cleanLetter}"!`,
        newlyCompletedLines: [],
        totalCompletedLinesCount: 0,
        cutLetters: [],
        newlyCutLetters: [],
        isFullBingoWon: false,
        isFullBoardCompleted: false,
      };
    }

    if (!questionAnswer.trim()) {
      return { 
        success: false, 
        error: 'Please enter their answer to the question', 
        newlyCompletedLines: [], 
        totalCompletedLinesCount: 0,
        cutLetters: [],
        newlyCutLetters: [],
        isFullBingoWon: false,
        isFullBoardCompleted: false 
      };
    }

    const board = await this.getOrCreateBingoBoard(participantId);

    // Prevent duplicate letter completion
    if (board.completed_letters.map((l) => l.toUpperCase()).includes(cleanLetter)) {
      return {
        success: false,
        error: `Letter "${cleanLetter}" is already completed on your board.`,
        newlyCompletedLines: [],
        totalCompletedLinesCount: 0,
        cutLetters: [],
        newlyCutLetters: [],
        isFullBingoWon: false,
        isFullBoardCompleted: false,
      };
    }

    // Compress selfie for local phone viewing only (never uploaded to DB)
    let selfieUrl: string;
    try {
      selfieUrl = await this.uploadSelfie(participantId, cleanLetter, selfieImageSource);
    } catch (e: unknown) {
      console.error('Selfie processing failed:', e);
      return {
        success: false,
        error: 'Failed to process selfie image. Please try again.',
        newlyCompletedLines: [],
        totalCompletedLinesCount: 0,
        cutLetters: [],
        newlyCutLetters: [],
        isFullBingoWon: false,
        isFullBoardCompleted: false,
      };
    }

    const newConnection: BingoConnection = {
      id: crypto.randomUUID(),
      participant_id: participantId,
      bingo_letter: cleanLetter,
      person_name: cleanName,
      selfie_url: selfieUrl,
      random_question: randomQuestion,
      question_answer: questionAnswer.trim(),
      created_at: new Date().toISOString(),
    };

    // Update completed letters
    const updatedCompletedLetters = Array.from(new Set([...board.completed_letters, cleanLetter]));
    const now = new Date().toISOString();
    const isFullCompleted = updatedCompletedLetters.length >= 25;

    // Track previous winning lines for celebration trigger
    const prevLineIds = getLocal<string[]>(`${LOCAL_COMPLETED_LINES_KEY}_${participantId}`, []);
    const evalResult = evaluateBingoBoard(board.letters, updatedCompletedLetters, prevLineIds);

    // Save newly completed lines in participant's state
    const currentCompletedLineIds = evalResult.completedLines.map(l => l.id);
    setLocal(`${LOCAL_COMPLETED_LINES_KEY}_${participantId}`, currentCompletedLineIds);

    // Persist to Supabase if configured:
    // Important: The photo is stored strictly on the user's phone and NOT uploaded to the database!
    if (isSupabaseConfigured && supabase) {
      try {
        const remoteConnectionData = {
          id: newConnection.id,
          participant_id: newConnection.participant_id,
          bingo_letter: newConnection.bingo_letter,
          person_name: newConnection.person_name,
          selfie_url: 'stored_on_user_device', // Guarantee: No image payload/external link sent to DB
          random_question: newConnection.random_question,
          question_answer: newConnection.question_answer,
          created_at: newConnection.created_at,
        };

        // Non-blocking sync with timeout so gameplay stays instantaneous even before SQL migration is executed
        Promise.race([
          supabase.from('bingo_connections').insert([remoteConnectionData]),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase sync timeout')), 2500)),
        ]).catch((e) => console.warn('Supabase connection sync skipped/timeout:', e));

        Promise.race([
          supabase
            .from('bingo_boards')
            .update({
              completed_letters: updatedCompletedLetters,
              completed_at: isFullCompleted ? now : board.completed_at,
            })
            .eq('participant_id', participantId),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase sync timeout')), 2500)),
        ]).catch((e) => console.warn('Supabase board sync skipped/timeout:', e));
      } catch (e) {
        console.warn('Supabase connection save error:', e);
      }
    }

    // Persist locally
    const connections = getLocal<BingoConnection[]>(LOCAL_CONNECTIONS_KEY, []);
    connections.push(newConnection);
    setLocal(LOCAL_CONNECTIONS_KEY, connections);

    const boards = getLocal<BingoBoard[]>(LOCAL_BOARDS_KEY, []);
    const bIdx = boards.findIndex((b) => b.participant_id === participantId);
    const updatedBoard: BingoBoard = {
      ...board,
      completed_letters: updatedCompletedLetters,
      completed_at: isFullCompleted ? now : board.completed_at,
    };
    if (bIdx >= 0) {
      boards[bIdx] = updatedBoard;
    } else {
      boards.push(updatedBoard);
    }
    setLocal(LOCAL_BOARDS_KEY, boards);

    return {
      success: true,
      connection: newConnection,
      board: updatedBoard,
      newlyCompletedLines: evalResult.newlyCompletedLines,
      totalCompletedLinesCount: evalResult.completedCount,
      cutLetters: evalResult.cutLetters,
      newlyCutLetters: evalResult.newlyCutLetters,
      isFullBingoWon: evalResult.isFullBingoWon,
      isFullBoardCompleted: evalResult.isFullBoardCompleted,
    };
  }

  /**
   * Get all connections for a participant (strictly scoped to participant)
   */
  static async getParticipantConnections(participantId: string): Promise<BingoConnection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('bingo_connections')
          .select('*')
          .eq('participant_id', participantId)
          .order('created_at', { ascending: false });

        if (data) return data;
      } catch (e) {
        console.warn('Supabase connections fetch error:', e);
      }
    }

    const connections = getLocal<BingoConnection[]>(LOCAL_CONNECTIONS_KEY, []);
    return connections
      .filter((c) => c.participant_id === participantId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Get event settings
   */
  static async getEventSettings(): Promise<EventSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('event_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (data) return data;
      } catch (e) {
        console.warn('Supabase settings fetch error:', e);
      }
    }

    return getLocal<EventSettings>(LOCAL_SETTINGS_KEY, defaultSettings);
  }

  /**
   * Update event settings (admin)
   */
  static async updateEventSettings(updated: Partial<EventSettings>): Promise<EventSettings> {
    const current = await this.getEventSettings();
    const merged: EventSettings = { ...current, ...updated };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('event_settings')
          .update(merged)
          .eq('id', current.id);
      } catch (e) {
        console.warn('Supabase settings update error:', e);
      }
    }

    setLocal(LOCAL_SETTINGS_KEY, merged);
    return merged;
  }

  /**
   * Get admin dashboard analytics and participant list
   */
  static async getAdminData(): Promise<{
    stats: {
      totalRegistrations: number;
      questionnaireCompleted: number;
      activeBingoParticipants: number;
      totalConnections: number;
      completedBingoBoards: number;
      avgConnectionsPerParticipant: number;
    };
    participants: AdminParticipantRow[];
  }> {
    const localP = getLocal<Participant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const localB = getLocal<BingoBoard[]>(LOCAL_BOARDS_KEY, []);
    const localC = getLocal<BingoConnection[]>(LOCAL_CONNECTIONS_KEY, []);

    const participantsMap = new Map<string, Participant>();
    localP.forEach((p) => participantsMap.set(p.id, p));

    const boardsMap = new Map<string, BingoBoard>();
    localB.forEach((b) => boardsMap.set(b.participant_id, b));

    const connectionsMap = new Map<string, BingoConnection>();
    localC.forEach((c) => connectionsMap.set(c.id, c));

    if (isSupabaseConfigured && supabase) {
      try {
        const [pRes, bRes, cRes] = await Promise.all([
          supabase.from('participants').select('*').order('created_at', { ascending: false }),
          supabase.from('bingo_boards').select('*'),
          supabase.from('bingo_connections').select('*'),
        ]);

        if (pRes.data) pRes.data.forEach((p: Participant) => participantsMap.set(p.id, p));
        if (bRes.data) bRes.data.forEach((b: BingoBoard) => boardsMap.set(b.participant_id, b));
        if (cRes.data) cRes.data.forEach((c: BingoConnection) => connectionsMap.set(c.id, c));
      } catch (e) {
        console.warn('Admin fetch error from Supabase, reading local:', e);
      }
    }

    const participants = Array.from(participantsMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const boards = Array.from(boardsMap.values());
    const connections = Array.from(connectionsMap.values());

    const totalRegistrations = participants.length;
    const questionnaireCompleted = participants.filter((p) => p.questionnaire_completed).length;
    const totalConnections = connections.length;

    // Group connections by participant
    const connectionsByParticipant = new Map<string, BingoConnection[]>();
    connections.forEach((c) => {
      const list = connectionsByParticipant.get(c.participant_id) || [];
      list.push(c);
      connectionsByParticipant.set(c.participant_id, list);
    });
    
    // Board stats
    let completedBingoBoards = 0;
    boards.forEach((b) => {
      if (b.completed_letters && b.completed_letters.length >= 25) {
        completedBingoBoards++;
      }
    });

    const activeBingoParticipants = participants.filter((p) => {
      const pConns = connectionsByParticipant.get(p.id);
      const b = boardsMap.get(p.id);
      return (pConns && pConns.length > 0) || (b && b.completed_letters && b.completed_letters.length > 0);
    }).length;

    const avgConnectionsPerParticipant =
      totalRegistrations > 0 ? Number((totalConnections / totalRegistrations).toFixed(1)) : 0;

    const participantRows: AdminParticipantRow[] = participants.map((p) => {
      const b = boardsMap.get(p.id);
      const completedLetters = b ? b.completed_letters : [];
      const evalRes = b ? evaluateBingoBoard(b.letters, completedLetters) : null;
      const pConnections = connectionsByParticipant.get(p.id) || [];
      const totalMet = Math.max(completedLetters.length, pConnections.length);

      return {
        participant: p,
        completedLettersCount: totalMet,
        completedLinesCount: evalRes ? evalRes.completedCount : 0,
        isBoardComplete: totalMet >= 25,
        lastActive: p.created_at,
        connections: pConnections,
      };
    });

    return {
      stats: {
        totalRegistrations,
        questionnaireCompleted,
        activeBingoParticipants,
        totalConnections,
        completedBingoBoards,
        avgConnectionsPerParticipant,
      },
      participants: participantRows,
    };
  }
}
