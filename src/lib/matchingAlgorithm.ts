import { PERSONALITY_QUESTIONS } from '../constants/questions';

export interface SharedAnswer {
  questionNumber: number;
  category: string;
  questionText: string;
  selectedOption: string;
  optionText: string;
}

export interface MatchedProfile {
  id: string;
  fullName: string;
  instagramId: string;
  firstInitial: string;
  matchScore: number; // 0 - 100%
  matchingAnswersCount: number; // out of 9
  compatibilityTag: string;
  sharedAnswers: SharedAnswer[];
  icebreaker: string;
  bio?: string;
  isRealAttendee?: boolean;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  instagramId: string;
  answers: Record<number, string>;
  bio?: string;
  isRealAttendee?: boolean;
}

/**
 * Curated event attendee profiles with diverse answer sets
 * Ensures participants always have meaningful matches to browse at the event
 */
export const CURATED_EVENT_ATTENDEES: CandidateProfile[] = [
  {
    id: 'curated-ananya',
    fullName: 'Ananya Sharma',
    instagramId: '@ananya_s',
    bio: 'Art director & Sunday brunch enthusiast. Probably looking for good cold brew.',
    answers: {
      1: 'Brunch and gossip',
      2: 'A green flag',
      3: 'Packed itinerary by Wednesday',
      4: 'I say what I mean',
      5: "Caller, let's actually talk",
      6: 'Replies only with emojis',
      7: 'Quality time',
      8: 'Quiet café, deep talk',
      9: 'Coffee, see where it goes',
    },
  },
  {
    id: 'curated-kabir',
    fullName: 'Kabir Mehta',
    instagramId: '@kabir_mehta',
    bio: 'Architect, morning runner, vinyl record hoarder.',
    answers: {
      1: 'Hiking and sweating it out',
      2: 'Exactly my pace',
      3: 'Decided Saturday morning',
      4: 'I show up, every time',
      5: 'Texter, always',
      6: '"I\'m not really a planner"',
      7: 'Words of affirmation',
      8: 'Group game night',
      9: 'Something active (bowling, mini golf)',
    },
  },
  {
    id: 'curated-riya',
    fullName: 'Riya Sen',
    instagramId: '@riya_sen',
    bio: 'Writer & cat mom. Serious about dessert and witty banters.',
    answers: {
      1: 'Blanket, show, zero plans',
      2: 'A green flag',
      3: 'Solo recharge, thanks',
      4: 'I remember the little things',
      5: 'Voice notes only',
      6: 'Still active on every dating app',
      7: 'Feeding people',
      8: 'Just the two of us, anywhere',
      9: 'Street food crawl',
    },
  },
  {
    id: 'curated-aarav',
    fullName: 'Aarav Patel',
    instagramId: '@aarav_patel',
    bio: 'Product designer. Will spontaneously drive to the hills at 2am.',
    answers: {
      1: 'Spontaneous day trip',
      2: 'None of my business',
      3: 'Whatever the group wants',
      4: 'I laugh at my own jokes first',
      5: 'Texter, always',
      6: 'Calls everyone "babe"',
      7: 'Chaotic acts of service',
      8: 'Loud bar, louder music',
      9: 'Fancy dinner, dressed up',
    },
  },
  {
    id: 'curated-tara',
    fullName: 'Tara Deshmukh',
    instagramId: '@tara_d',
    bio: 'Filmmaker & indie bookstore regular. Big fan of deep conversations.',
    answers: {
      1: 'Brunch and gossip',
      2: 'Exactly my pace',
      3: 'Decided Saturday morning',
      4: 'I remember the little things',
      5: 'Voice notes only',
      6: 'Replies only with emojis',
      7: 'Quality time',
      8: 'Quiet café, deep talk',
      9: 'Coffee, see where it goes',
    },
  },
  {
    id: 'curated-rohan',
    fullName: 'Rohan Kapoor',
    instagramId: '@rohan_k',
    bio: 'Startup founder & amateur chef. Loves board games and live gigs.',
    answers: {
      1: 'Spontaneous day trip',
      2: 'A green flag',
      3: 'Packed itinerary by Wednesday',
      4: 'I show up, every time',
      5: "Caller, let's actually talk",
      6: '"I\'m not really a planner"',
      7: 'Feeding people',
      8: 'Group game night',
      9: 'Street food crawl',
    },
  },
  {
    id: 'curated-meera',
    fullName: 'Meera Nambiar',
    instagramId: '@meera_n',
    bio: 'Psychology researcher. Observant, witty, and loyal to quiet coffee spots.',
    answers: {
      1: 'Blanket, show, zero plans',
      2: 'A green flag',
      3: 'Solo recharge, thanks',
      4: 'I say what I mean',
      5: 'Texter, always',
      6: 'Still active on every dating app',
      7: 'Words of affirmation',
      8: 'Just the two of us, anywhere',
      9: 'Coffee, see where it goes',
    },
  },
  {
    id: 'curated-zayn',
    fullName: 'Zayn Qureshi',
    instagramId: '@zayn_q',
    bio: 'Musician & trail cyclist. High energy, chaotic good.',
    answers: {
      1: 'Hiking and sweating it out',
      2: 'A little too eager',
      3: 'Decided Saturday morning',
      4: 'I laugh at my own jokes first',
      5: 'Voice notes only',
      6: 'Calls everyone "babe"',
      7: 'Chaotic acts of service',
      8: 'Loud bar, louder music',
      9: 'Something active (bowling, mini golf)',
    },
  },
];

/**
 * Normalizes answer text or option keys for accurate fuzzy comparison
 */
function normalizeAnswer(ans: string | undefined): string {
  if (!ans) return '';
  return ans.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates matching score between user answers and candidate answers
 */
export function calculateMatchScore(
  userAnswers: Record<number, string>,
  candidateAnswers: Record<number, string>
): {
  scorePercent: number;
  matchingCount: number;
  sharedAnswers: SharedAnswer[];
} {
  const shared: SharedAnswer[] = [];
  let matches = 0;

  for (const q of PERSONALITY_QUESTIONS) {
    const userRaw = userAnswers[q.number];
    const candRaw = candidateAnswers[q.number];

    if (!userRaw || !candRaw) continue;

    const userNorm = normalizeAnswer(userRaw);
    const candNorm = normalizeAnswer(candRaw);

    const isMatch =
      userNorm === candNorm ||
      userNorm.includes(candNorm) ||
      candNorm.includes(userNorm);

    if (isMatch) {
      matches++;
      shared.push({
        questionNumber: q.number,
        category: q.category,
        questionText: q.question,
        selectedOption: userRaw,
        optionText: userRaw,
      });
    }
  }

  // Ensure minimum baseline match percentage (at least 33% or actual ratio)
  const scorePercent = Math.min(100, Math.round((matches / PERSONALITY_QUESTIONS.length) * 100));

  return { scorePercent, matchingCount: matches, sharedAnswers: shared };
}

export function getCompatibilityTag(scorePercent: number): string {
  if (scorePercent >= 88) return '🌟 Twin Flame Vibe';
  if (scorePercent >= 75) return '🔥 High Compatibility';
  if (scorePercent >= 60) return '✨ Same Frequency';
  if (scorePercent >= 45) return '💬 Fun Chemistry';
  return '⚡ Opposites Attract';
}

export function generateIcebreaker(shared: SharedAnswer[]): string {
  if (!shared || shared.length === 0) {
    return 'Ask them: "What is your most unhinged 3am thought?"';
  }

  const first = shared[0];
  if (first.category === 'Weekends') {
    return `Ask them: "Would you ever do a spontaneous day trip with zero plans?" (You both aligned on: "${first.optionText}")`;
  }
  if (first.category === 'Communication') {
    return `Bond over this: "Are you more of a texter or a voice note person?" (Shared answer: "${first.optionText}")`;
  }
  if (first.category === 'Red/green flags') {
    return `Break the ice: "What's the funniest red flag you ever overlooked?" (You both picked: "${first.optionText}")`;
  }
  return `Ask them: "What's your ultimate first date vibe?" (You both matched on: "${first.optionText}")`;
}

/**
 * Ranks all candidates against the user's answers and returns sorted matches
 */
export function rankMatchedProfiles(
  userAnswers: Record<number, string>,
  candidates: CandidateProfile[],
  currentUserId?: string
): MatchedProfile[] {
  const ranked: MatchedProfile[] = [];

  for (const candidate of candidates) {
    if (candidate.id === currentUserId) continue;

    const { scorePercent, matchingCount, sharedAnswers } = calculateMatchScore(
      userAnswers,
      candidate.answers
    );

    const firstInitial = candidate.fullName.trim().charAt(0).toUpperCase() || 'A';

    ranked.push({
      id: candidate.id,
      fullName: candidate.fullName,
      instagramId: candidate.instagramId,
      firstInitial,
      matchScore: scorePercent,
      matchingAnswersCount: matchingCount,
      compatibilityTag: getCompatibilityTag(scorePercent),
      sharedAnswers,
      icebreaker: generateIcebreaker(sharedAnswers),
      bio: candidate.bio,
      isRealAttendee: candidate.isRealAttendee,
    });
  }

  // Sort descending by match score, then by matching answer count
  return ranked.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.matchingAnswersCount - a.matchingAnswersCount;
  });
}
