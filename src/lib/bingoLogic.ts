import type { WinningLine } from '../types';

export const ALL_WINNING_LINES: WinningLine[] = [
  // 5 Rows
  { id: 'row-0', type: 'row', index: 0, label: 'Row 1', indices: [0, 1, 2, 3, 4] },
  { id: 'row-1', type: 'row', index: 1, label: 'Row 2', indices: [5, 6, 7, 8, 9] },
  { id: 'row-2', type: 'row', index: 2, label: 'Row 3', indices: [10, 11, 12, 13, 14] },
  { id: 'row-3', type: 'row', index: 3, label: 'Row 4', indices: [15, 16, 17, 18, 19] },
  { id: 'row-4', type: 'row', index: 4, label: 'Row 5', indices: [20, 21, 22, 23, 24] },

  // 5 Columns
  { id: 'col-0', type: 'column', index: 0, label: 'Column 1', indices: [0, 5, 10, 15, 20] },
  { id: 'col-1', type: 'column', index: 1, label: 'Column 2', indices: [1, 6, 11, 16, 21] },
  { id: 'col-2', type: 'column', index: 2, label: 'Column 3', indices: [2, 7, 12, 17, 22] },
  { id: 'col-3', type: 'column', index: 3, label: 'Column 4', indices: [3, 8, 13, 18, 23] },
  { id: 'col-4', type: 'column', index: 4, label: 'Column 5', indices: [4, 9, 14, 19, 24] },

  // 2 Diagonals
  { id: 'diag-main', type: 'diagonal', index: 0, label: 'Top-Left to Bottom-Right Diagonal', indices: [0, 6, 12, 18, 24] },
  { id: 'diag-anti', type: 'diagonal', index: 1, label: 'Top-Right to Bottom-Left Diagonal', indices: [4, 8, 12, 16, 20] },
];

export interface BingoCheckResult {
  completedLines: WinningLine[];
  completedCount: number;
  newlyCompletedLines: WinningLine[];
  peopleMet: number;
  completionPercentage: number;
  isFullBoardCompleted: boolean;
}

/**
 * Evaluates the bingo board against the completed letters
 * @param boardLetters Array of 25 letters representing the board grid
 * @param completedLetters Array of letters that have been completed
 * @param previousCompletedLineIds Optional list of line IDs already completed before this move
 */
export function evaluateBingoBoard(
  boardLetters: string[],
  completedLetters: string[],
  previousCompletedLineIds: string[] = []
): BingoCheckResult {
  const completedSet = new Set(completedLetters.map(l => l.toUpperCase()));
  const completedIndices = new Set<number>();

  boardLetters.forEach((letter, idx) => {
    if (completedSet.has(letter.toUpperCase())) {
      completedIndices.add(idx);
    }
  });

  const completedLines: WinningLine[] = [];

  for (const line of ALL_WINNING_LINES) {
    const isLineComplete = line.indices.every(idx => completedIndices.has(idx));
    if (isLineComplete) {
      completedLines.push(line);
    }
  }

  const prevSet = new Set(previousCompletedLineIds);
  const newlyCompletedLines = completedLines.filter(line => !prevSet.has(line.id));

  const peopleMet = completedSet.size;
  const completionPercentage = Math.round((peopleMet / 25) * 100);
  const isFullBoardCompleted = peopleMet >= 25;

  return {
    completedLines,
    completedCount: completedLines.length,
    newlyCompletedLines,
    peopleMet,
    completionPercentage,
    isFullBoardCompleted,
  };
}

/**
 * Returns a set of board indices that belong to any completed winning line
 */
export function getWinningCellIndices(
  boardLetters: string[],
  completedLetters: string[]
): Set<number> {
  const { completedLines } = evaluateBingoBoard(boardLetters, completedLetters);
  const winningIndices = new Set<number>();

  for (const line of completedLines) {
    for (const idx of line.indices) {
      winningIndices.add(idx);
    }
  }

  return winningIndices;
}
