// 25 distinct uppercase letters for the 5x5 Human Bingo board
// Omitting 'X' which is exceptionally rare for first names
export const DEFAULT_BINGO_LETTERS: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'Y', 'Z'
];

export const BRAND_COLORS = {
  deepInk: '#0B3B3D',
  paleBlue: '#A3C4CB',
  reddishOrange: '#E05A47',
  lagoonTeal: '#E05A47', // alias for reddish-orange
  pureWhite: '#FFFFFF',
};

// Legal & event placeholders as requested in Section 10
export const LEGAL_CONFIG = {
  organizerEmail: 'team@twoofus.live',
  staffIdentifier: 'Reddish-Orange Two of Us Badge or Lanyard',
  jurisdictionCity: 'Mumbai',
  minAge: 18,
};

// Shuffle helper (Fisher-Yates) for board generation
export function generateRandomBoardLetters(): string[] {
  const letters = [...DEFAULT_BINGO_LETTERS];
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}
