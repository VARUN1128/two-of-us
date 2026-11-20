import { 
  calculateMatchScore, 
  getCompatibilityTag, 
  generateIcebreaker, 
  rankMatchedProfiles,
  CURATED_EVENT_ATTENDEES 
} from './matchingAlgorithm';

console.log('=== RUNNING PERSONALITY MATCHING ALGORITHM TESTS ===\n');

let failedTests = 0;
function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failedTests++;
  }
}

// Test 1: Exact matches calculation
const userAnswersExact = {
  1: 'Brunch and gossip',
  2: 'A green flag',
  3: 'Packed itinerary by Wednesday',
  4: 'I say what I mean',
  5: "Caller, let's actually talk",
  6: 'Replies only with emojis',
  7: 'Quality time',
  8: 'Quiet café, deep talk',
  9: 'Coffee, see where it goes',
};

const result100 = calculateMatchScore(userAnswersExact, userAnswersExact);
assert(result100.scorePercent === 100, 'All 9 identical answers yield 100% match');
assert(result100.matchingCount === 9, 'All 9 questions counted as matching');
assert(result100.sharedAnswers.length === 9, 'Shared answers array has 9 items');

// Test 2: Partial matches
const candidateHalf = {
  1: 'Brunch and gossip', // Match
  2: 'A green flag', // Match
  3: 'Solo recharge, thanks', // Different
  4: 'I say what I mean', // Match
  5: 'Texter, always', // Different
  6: 'Replies only with emojis', // Match
  7: 'Words of affirmation', // Different
  8: 'Group game night', // Different
  9: 'Coffee, see where it goes', // Match
};
const resultHalf = calculateMatchScore(userAnswersExact, candidateHalf);
assert(resultHalf.matchingCount === 5, '5 out of 9 matching questions correctly calculated');
assert(resultHalf.scorePercent === Math.round((5 / 9) * 100), 'Score percentage matches 56%');

// Test 3: Compatibility tags
assert(getCompatibilityTag(100) === '🌟 Twin Flame Vibe', '100% score receives Twin Flame Vibe tag');
assert(getCompatibilityTag(78) === '🔥 High Compatibility', '78% score receives High Compatibility tag');
assert(getCompatibilityTag(67) === '✨ Same Frequency', '67% score receives Same Frequency tag');
assert(getCompatibilityTag(45) === '💬 Fun Chemistry', '45% score receives Fun Chemistry tag');
assert(getCompatibilityTag(20) === '⚡ Opposites Attract', '<45% score receives Opposites Attract tag');

// Test 4: Icebreaker generation
const icebreaker = generateIcebreaker(resultHalf.sharedAnswers);
assert(typeof icebreaker === 'string' && icebreaker.length > 10, 'Icebreaker string generated');
assert(icebreaker.includes('Brunch and gossip'), 'Icebreaker references shared answer topic');

// Test 5: Ranking candidates
const ranked = rankMatchedProfiles(userAnswersExact, CURATED_EVENT_ATTENDEES);
assert(ranked.length === CURATED_EVENT_ATTENDEES.length, 'All candidates ranked');
assert(ranked[0].matchScore >= ranked[1].matchScore, 'Candidate 0 has higher or equal match score than candidate 1');
assert(ranked[0].fullName === 'Ananya Sharma', 'Ananya Sharma ranks #1 with 100% match');
assert(ranked[0].matchScore === 100, 'Top match has 100% score');

// Test 6: Excluding current user from candidate rankings
const selfCandidate = {
  id: 'me-123',
  fullName: 'Myself',
  instagramId: '@me',
  answers: userAnswersExact
};
const rankedExcludingSelf = rankMatchedProfiles(userAnswersExact, [selfCandidate, ...CURATED_EVENT_ATTENDEES], 'me-123');
assert(!rankedExcludingSelf.some(c => c.id === 'me-123'), 'Current user is cleanly excluded from matches list');

console.log(`\n=== MATCHING TEST SUITE FINISHED with ${failedTests} failure(s) ===\n`);
if (failedTests > 0) process.exit(1);
