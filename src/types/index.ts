export interface Participant {
  id: string;
  full_name: string;
  mobile_number: string;
  instagram_id: string;
  created_at: string;
  terms_accepted: boolean;
  terms_accepted_at: string;
  marketing_opt_out: boolean;
  questionnaire_completed: boolean;
}

export interface QuestionnaireAnswer {
  id?: string;
  participant_id: string;
  question_number: number;
  question_text: string;
  selected_option: string;
  created_at?: string;
}

export interface BingoBoard {
  id: string;
  participant_id: string;
  letters: string[]; // 25 letters
  completed_letters: string[];
  created_at: string;
  completed_at?: string | null;
}

export interface BingoConnection {
  id: string;
  participant_id: string;
  bingo_letter: string;
  person_name: string;
  selfie_url: string;
  random_question: string;
  question_answer: string;
  created_at: string;
}

export interface EventSettings {
  id: string;
  event_name: string;
  event_status: 'upcoming' | 'active' | 'paused' | 'ended';
  registration_enabled: boolean;
  bingo_enabled: boolean;
  event_start_time?: string;
  event_end_time?: string;
}

export interface WinningLine {
  id: string;
  type: 'row' | 'column' | 'diagonal';
  index: number; // 0-4 for row/col, 0 (main) or 1 (anti) for diagonal
  label: string; // e.g. "Row 2", "Column 4", "Main Diagonal"
  indices: number[]; // 5 board cell indices
}

export type AppStage = 
  | 'welcome' 
  | 'registration' 
  | 'questionnaire' 
  | 'questionnaire_complete' 
  | 'bingo' 
  | 'connections' 
  | 'board_completed' 
  | 'admin';
