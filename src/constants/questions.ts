export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface PersonalityQuestion {
  number: number;
  category: 'Weekends' | 'Communication' | 'Red/green flags' | 'Hangout vibe';
  question: string;
  options: QuestionOption[];
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    number: 1,
    category: 'Weekends',
    question: 'My ideal Sunday looks like:',
    options: [
      { key: 'A', text: 'Brunch and gossip' },
      { key: 'B', text: 'Hiking and sweating it out' },
      { key: 'C', text: 'Blanket, show, zero plans' },
      { key: 'D', text: 'Spontaneous day trip' },
    ],
  },
  {
    number: 2,
    category: 'Communication',
    question: 'Texting back in under 10 minutes is:',
    options: [
      { key: 'A', text: 'A green flag' },
      { key: 'B', text: 'A little too eager' },
      { key: 'C', text: 'Exactly my pace' },
      { key: 'D', text: 'None of my business' },
    ],
  },
  {
    number: 3,
    category: 'Weekends',
    question: 'Weekend plans, your style:',
    options: [
      { key: 'A', text: 'Packed itinerary by Wednesday' },
      { key: 'B', text: 'Decided Saturday morning' },
      { key: 'C', text: 'Whatever the group wants' },
      { key: 'D', text: 'Solo recharge, thanks' },
    ],
  },
  {
    number: 4,
    category: 'Red/green flags',
    question: 'My biggest green flag is:',
    options: [
      { key: 'A', text: 'I remember the little things' },
      { key: 'B', text: 'I say what I mean' },
      { key: 'C', text: 'I show up, every time' },
      { key: 'D', text: 'I laugh at my own jokes first' },
    ],
  },
  {
    number: 5,
    category: 'Communication',
    question: 'Texter or caller?',
    options: [
      { key: 'A', text: 'Texter, always' },
      { key: 'B', text: "Caller, let's actually talk" },
      { key: 'C', text: 'Voice notes only' },
      { key: 'D', text: 'I ghost my own phone' },
    ],
  },
  {
    number: 6,
    category: 'Red/green flags',
    question: 'A red flag I ignore way too often:',
    options: [
      { key: 'A', text: '"I\'m not really a planner"' },
      { key: 'B', text: 'Replies only with emojis' },
      { key: 'C', text: 'Still active on every dating app' },
      { key: 'D', text: 'Calls everyone "babe"' },
    ],
  },
  {
    number: 7,
    category: 'Communication',
    question: 'My love language, basically:',
    options: [
      { key: 'A', text: 'Words of affirmation' },
      { key: 'B', text: 'Quality time' },
      { key: 'C', text: 'Feeding people' },
      { key: 'D', text: 'Chaotic acts of service' },
    ],
  },
  {
    number: 8,
    category: 'Hangout vibe',
    question: 'Ideal hangout:',
    options: [
      { key: 'A', text: 'Loud bar, louder music' },
      { key: 'B', text: 'Quiet café, deep talk' },
      { key: 'C', text: 'Group game night' },
      { key: 'D', text: 'Just the two of us, anywhere' },
    ],
  },
  {
    number: 9,
    category: 'Hangout vibe',
    question: 'First date energy:',
    options: [
      { key: 'A', text: 'Fancy dinner, dressed up' },
      { key: 'B', text: 'Street food crawl' },
      { key: 'C', text: 'Something active (bowling, mini golf)' },
      { key: 'D', text: 'Coffee, see where it goes' },
    ],
  },
];

export const RANDOM_QUESTION_BANK: string[] = [
  'Which fictional character would you want as a roommate?',
  'If you were a conspiracy theory, what would you be?',
  "What's your most unhinged 3am thought?",
  'Which meme describes your personality best?',
  'What song is an automatic dance-floor summon for you?',
  'If you had a personal theme song, what would it be?',
  "What's the weirdest talent you're secretly proud of?",
  'Which celebrity do you think you could out-argue?',
  "What's your villain origin story, in one sentence?",
  'If your life were a reality show, what\'s it called?',
];
