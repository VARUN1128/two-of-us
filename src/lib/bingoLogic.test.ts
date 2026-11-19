import { 
  ALL_WINNING_LINES, 
  evaluateBingoBoard, 
  getWinningCellIndices 
} from './bingoLogic';
import { sanitizeAndValidateIndianMobile, sanitizeInstagramId } from './store';
import { DEFAULT_BINGO_LETTERS, generateRandomBoardLetters } from '../constants/config';

console.log('=== RUNNING TWO OF US LOGIC & VALIDATION TESTS ===\n');

let failedTests = 0;
function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Board Letter Configuration
assert(DEFAULT_BINGO_LETTERS.length === 25, 'Predefined bingo letters has exactly 25 letters');
assert(new Set(DEFAULT_BINGO_LETTERS).size === 25, 'All 25 predefined letters are unique');

// 2. Random Board Generation
const boardA = generateRandomBoardLetters();
const boardB = generateRandomBoardLetters();
assert(boardA.length === 25, 'Generated board has 25 letters');
assert(new Set(boardA).size === 25, 'Generated board has 25 distinct letters');
assert(boardA.join('') !== boardB.join(''), 'Two generated boards have different randomized shuffles');

// 3. Indian Mobile Number Validation
assert(sanitizeAndValidateIndianMobile('9876543210').isValid, 'Valid 10-digit mobile passes');
assert(sanitizeAndValidateIndianMobile('+91 9876543210').isValid, 'Valid +91 mobile passes and normalizes');
assert(!sanitizeAndValidateIndianMobile('1234567890').isValid, 'Mobile starting with 1 fails (must start with 6-9)');
assert(!sanitizeAndValidateIndianMobile('98765').isValid, 'Short mobile fails');
assert(!sanitizeAndValidateIndianMobile('987654321000').isValid, 'Long mobile fails');

// 4. Instagram Handle Normalization
assert(sanitizeInstagramId('ananya') === '@ananya', 'Instagram handle gets @ prepended');
assert(sanitizeInstagramId('@ananya') === '@ananya', 'Instagram handle with @ preserved');

// 5. Winning Lines Configuration
assert(ALL_WINNING_LINES.length === 12, 'Exactly 12 possible winning lines exist (5 rows + 5 cols + 2 diags)');
const rows = ALL_WINNING_LINES.filter(l => l.type === 'row');
const cols = ALL_WINNING_LINES.filter(l => l.type === 'column');
const diags = ALL_WINNING_LINES.filter(l => l.type === 'diagonal');
assert(rows.length === 5, 'Exactly 5 horizontal rows defined');
assert(cols.length === 5, 'Exactly 5 vertical columns defined');
assert(diags.length === 2, 'Exactly 2 diagonals defined');

// 6. Horizontal Bingo Detection Test (Row 0: 0..4)
const sampleBoard = [...DEFAULT_BINGO_LETTERS];
const row0Letters = [sampleBoard[0], sampleBoard[1], sampleBoard[2], sampleBoard[3], sampleBoard[4]];
const evalRow0 = evaluateBingoBoard(sampleBoard, row0Letters);
assert(evalRow0.completedCount === 1, 'Row 0 completion detected as 1 winning line');
assert(evalRow0.completedLines[0].id === 'row-0', 'Completed line identified as row-0');
assert(!evalRow0.isFullBoardCompleted, 'Single row completion is NOT full board completion');

// 7. Vertical Bingo Detection Test (Column 2: 2, 7, 12, 17, 22)
const col2Letters = [sampleBoard[2], sampleBoard[7], sampleBoard[12], sampleBoard[17], sampleBoard[22]];
const evalCol2 = evaluateBingoBoard(sampleBoard, col2Letters);
assert(evalCol2.completedCount === 1, 'Column 2 completion detected as 1 winning line');
assert(evalCol2.completedLines[0].id === 'col-2', 'Completed line identified as col-2');

// 8. Main Diagonal Bingo Detection Test (0, 6, 12, 18, 24)
const mainDiagLetters = [sampleBoard[0], sampleBoard[6], sampleBoard[12], sampleBoard[18], sampleBoard[24]];
const evalMainDiag = evaluateBingoBoard(sampleBoard, mainDiagLetters);
assert(evalMainDiag.completedCount === 1, 'Main diagonal completion detected as 1 winning line');
assert(evalMainDiag.completedLines[0].id === 'diag-main', 'Completed line identified as diag-main');

// 9. Anti Diagonal Bingo Detection Test (4, 8, 12, 16, 20)
const antiDiagLetters = [sampleBoard[4], sampleBoard[8], sampleBoard[12], sampleBoard[16], sampleBoard[20]];
const evalAntiDiag = evaluateBingoBoard(sampleBoard, antiDiagLetters);
assert(evalAntiDiag.completedCount === 1, 'Anti diagonal completion detected as 1 winning line');
assert(evalAntiDiag.completedLines[0].id === 'diag-anti', 'Completed line identified as diag-anti');

// 10. Newly Completed Line Detection Test (for Celebration Trigger)
const evalWithPrev = evaluateBingoBoard(sampleBoard, row0Letters, ['row-0']);
assert(evalWithPrev.newlyCompletedLines.length === 0, 'Already completed row not flagged as newly completed');

// If user now completes col 0 in addition to row 0:
const lettersRow0AndCol0 = Array.from(new Set([...row0Letters, sampleBoard[5], sampleBoard[10], sampleBoard[15], sampleBoard[20]]));
const evalMultiple = evaluateBingoBoard(sampleBoard, lettersRow0AndCol0, ['row-0']);
assert(evalMultiple.completedCount === 2, 'Two winning lines completed (Row 0 + Col 0)');
assert(evalMultiple.newlyCompletedLines.length === 1 && evalMultiple.newlyCompletedLines[0].id === 'col-0', 'Only newly completed Col 0 triggers new line celebration');

// 11. Full Board Completion Test (All 25 letters)
const evalFull = evaluateBingoBoard(sampleBoard, sampleBoard);
assert(evalFull.completedCount === 12, 'Full board completes all 12 winning lines');
assert(evalFull.isFullBoardCompleted, 'Full board completion flag is TRUE');
assert(evalFull.peopleMet === 25, 'People met is 25');
assert(evalFull.completionPercentage === 100, 'Completion percentage is 100%');

// 12. Winning Cell Indices calculation
const winningCells = getWinningCellIndices(sampleBoard, row0Letters);
assert(winningCells.size === 5, 'Winning cells set contains exactly 5 indices for 1 line');
assert(winningCells.has(0) && winningCells.has(4), 'Winning cells set has correct indices');

console.log(`\n=== TEST SUITE COMPLETED with ${failedTests} failure(s) ===`);
if (failedTests > 0) {
  process.exit(1);
}
