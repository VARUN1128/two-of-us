import React, { useState, useEffect } from 'react';
import type { BingoBoard, Participant } from '../../types';
import { AppDataStore } from '../../lib/store';
import type { MatchedProfile } from '../../lib/matchingAlgorithm';
import { evaluateBingoBoard, BINGO_SPELL } from '../../lib/bingoLogic';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Flame, 
  MessageCircle, 
  CheckCircle2, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Lock,
  Scissors,
  ArrowRight
} from 'lucide-react';
import { fireBingoConfetti } from '../common/Confetti';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface MatchesPageProps {
  participant: Participant;
  board?: BingoBoard | null;
  onBackToBingo: () => void;
  onViewConnections: () => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  participant,
  board,
  onBackToBingo,
  onViewConnections,
}) => {
  const [matches, setMatches] = useState<MatchedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'soulmate'>('all');
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);

  // Check if all 5 letters in "B-I-N-G-O" are cut
  const evalResult = board ? evaluateBingoBoard(board.letters, board.completed_letters) : null;
  const isUnlocked = evalResult ? evalResult.isFullBingoWon : false;

  useEffect(() => {
    let isMounted = true;

    // Only load matched profiles if all letters in "BINGO" are cut
    if (!isUnlocked) {
      setIsLoading(false);
      return;
    }

    async function loadMatches() {
      setIsLoading(true);
      try {
        const results = await AppDataStore.getTopMatchedProfiles(participant.id);
        if (isMounted) {
          setMatches(results);
          if (results.length > 0) {
            // Default expand the #1 top match
            setExpandedProfileId(results[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load matched profiles:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          fireBingoConfetti(false);
        }
      }
    }

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, [participant.id, isUnlocked]);

  const filteredMatches = matches.filter((m) => {
    if (filter === 'soulmate') return m.matchScore >= 80;
    if (filter === 'high') return m.matchScore >= 65;
    return true;
  });

  const getMatchScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-[#FDF2F0] text-[#D34E2A] border-[#E05A47] ring-2 ring-[#E05A47]/20';
    if (score >= 65) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-[#F4F8F9] text-[#0B3B3D] border-[#A3C4CB]/50';
  };

  // If all 5 letters in B-I-N-G-O are NOT cut yet, display the locked state
  if (!isUnlocked) {
    const cutCount = evalResult ? evalResult.cutLetters.length : 0;
    return (
      <div className="flex-1 flex flex-col justify-between items-center max-w-md mx-auto w-full px-5 py-8 text-center animate-in fade-in duration-300 min-h-[85vh]">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBackToBingo}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3B3D] hover:text-[#E05A47] transition-colors py-1.5 px-3 rounded-full bg-[#F4F8F9] hover:bg-[#FDF2F0] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E05A47]" />
            <span>Back to Bingo</span>
          </button>

          <button
            onClick={onViewConnections}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E05A47] bg-[#FDF2F0] hover:bg-[#FCEEE8] px-3 py-1.5 rounded-full border border-[#E05A47]/30 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Connections</span>
          </button>
        </div>

        {/* Lock Hero Card */}
        <div className="my-auto py-4 space-y-5 max-w-sm w-full">
          {/* Animated Lock Badge */}
          <div className="w-20 h-20 rounded-full bg-[#FDF2F0] border-2 border-[#E05A47] flex items-center justify-center text-[#E05A47] mx-auto shadow-md">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F0] border border-[#F3BEB5] text-xs font-bold text-[#E05A47] uppercase tracking-wider">
              <span>Full B-I-N-G-O Required</span>
            </div>

            <h2
              className="text-3xl font-medium text-[#0B3B3D] tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
            >
              Personality Matches Locked
            </h2>

            <p className="text-xs sm:text-sm text-[#0B3B3D]/75 leading-relaxed">
              Matched profiles will only show after all 5 letters in <strong>B-I-N-G-O</strong> are cut on your board.
            </p>
          </div>

          {/* Visual 5-Letter B-I-N-G-O Strike Tracker */}
          <div className="p-4 rounded-3xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0B3B3D]">
              <span className="flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#E05A47]" />
                <span>B-I-N-G-O Letter Progress</span>
              </span>
              <span className="text-[#E05A47] font-bold">
                {cutCount} / 5 Letters Cut
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {BINGO_SPELL.map((char, i) => {
                const isCut = i < cutCount;
                return (
                  <div
                    key={char}
                    className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center aspect-square ${
                      isCut
                        ? 'bg-[#FDF2F0] border border-[#E05A47] text-[#D34E2A] font-bold shadow-2xs'
                        : 'bg-white border border-[#A3C4CB]/40 text-[#0B3B3D]/40 font-medium'
                    }`}
                  >
                    <span
                      className="font-serif text-2xl leading-none"
                      style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                    >
                      {char}
                    </span>
                    {isCut && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#D34E2A]" preserveAspectRatio="none">
                          <line x1="15" y1="85" x2="85" y2="15" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#0B3B3D]/70 pt-1">
              Complete {5 - cutCount} more {5 - cutCount === 1 ? 'line' : 'lines'} on your board to cut all letters in B-I-N-G-O and reveal your matches!
            </p>
          </div>
        </div>

        {/* Bottom CTA to Return to Bingo */}
        <div className="w-full pt-6 space-y-2">
          <button
            onClick={onBackToBingo}
            className="w-full py-4 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white font-medium text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Return to Bingo & Cut More Lines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-4 py-5 animate-in fade-in duration-300 font-sans pb-12">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToBingo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3B3D] hover:text-[#E05A47] transition-colors py-1.5 px-3 rounded-full bg-[#F4F8F9] hover:bg-[#FDF2F0] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E05A47]" />
          <span>Back to Bingo</span>
        </button>

        <button
          onClick={onViewConnections}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E05A47] bg-[#FDF2F0] hover:bg-[#FCEEE8] px-3 py-1.5 rounded-full border border-[#E05A47]/30 transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Connections</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-2 mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F0] border border-[#F3BEB5] text-[#D34E2A] text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BINGO Matchmaking Unlocked</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-medium text-[#0B3B3D] tracking-tight leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Your Top Matches
        </h1>

        <p className="text-xs sm:text-sm text-[#0B3B3D]/75 max-w-sm mx-auto leading-relaxed">
          Profiles in the room with the highest questionnaire compatibility. Connect, strike up a conversation, or say hi on Instagram!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'high'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          High Chemistry (65%+)
        </button>
        <button
          onClick={() => setFilter('soulmate')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'soulmate'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          Top Sparks (80%+)
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E05A47] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#0B3B3D]/70">Comparing 9 questionnaire dimensions...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="p-8 text-center bg-[#F4F8F9] rounded-3xl border border-[#A3C4CB]/30 space-y-3">
          <Heart className="w-8 h-8 text-[#A3C4CB] mx-auto" />
          <p className="text-sm font-medium text-[#0B3B3D]">No matches in this category yet</p>
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-semibold text-[#E05A47] underline"
          >
            Show all available matches
          </button>
        </div>
      ) : (
        /* Profiles Cards List */
        <div className="space-y-4">
          {filteredMatches.map((profile, index) => {
            const isExpanded = expandedProfileId === profile.id;
            const isTopMatch = index === 0 && filter === 'all';
            const cleanHandle = profile.instagramId.replace(/^@/, '');

            return (
              <div
                key={profile.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isTopMatch
                    ? 'bg-gradient-to-b from-white to-[#FDF8F4] border-[#E05A47] shadow-md ring-2 ring-[#E05A47]/10'
                    : 'bg-white border-[#A3C4CB]/40 hover:border-[#E05A47]/40 shadow-xs'
                }`}
              >
                {/* Top Badge for #1 Match */}
                {isTopMatch && (
                  <div className="bg-[#E05A47] text-white text-[11px] font-bold py-1 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>#1 Highest Compatibility Match</span>
                  </div>
                )}

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Profile Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial circle */}
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#D34E2A] to-[#E05A47] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs shrink-0">
                        {profile.firstInitial}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#0B3B3D]">
                            {profile.fullName}
                          </h3>
                        </div>

                        <a
                          href={`https://instagram.com/${cleanHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#0B3B3D]/70 hover:text-[#E05A47] transition-colors"
                        >
                          <InstagramIcon className="w-3 h-3 text-[#E05A47]" />
                          <span>@{cleanHandle}</span>
                        </a>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getMatchScoreBadgeColor(
                          profile.matchScore
                        )}`}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{profile.matchScore}% Match</span>
                      </div>
                      <div className="text-[10px] text-[#0B3B3D]/60 mt-1">
                        {profile.matchingAnswersCount} of 9 Aligned
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Tag & Bio */}
                  <div className="p-3 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E05A47] flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-[#E05A47]" />
                        <span>{profile.compatibilityTag}</span>
                      </span>
                      <span className="text-[11px] text-[#0B3B3D]/60">
                        {profile.sharedAnswers.length} shared answers
                      </span>
                    </div>

                    {profile.bio && (
                      <p className="text-xs text-[#0B3B3D]/80 leading-relaxed italic">
                        "{profile.bio}"
                      </p>
                    )}
                  </div>

                  {/* Shared Answers Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedProfileId(isExpanded ? null : profile.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-[#0B3B3D] hover:text-[#E05A47] transition-colors py-1 cursor-pointer"
                    >
                      <span>
                        {isExpanded ? 'Hide shared answers' : `View ${profile.sharedAnswers.length} shared answers`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#E05A47]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#0B3B3D]/50" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 space-y-2 pt-2 border-t border-[#A3C4CB]/30 animate-in fade-in duration-200">
                        {profile.sharedAnswers.map((item) => (
                          <div
                            key={item.questionNumber}
                            className="p-2.5 rounded-xl bg-white border border-[#A3C4CB]/40 text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-[10px] font-semibold text-[#E05A47] uppercase tracking-wider">
                              <span>{item.category}</span>
                              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Both Matched</span>
                              </span>
                            </div>
                            <div className="text-[#0B3B3D] font-medium leading-tight">
                              {item.questionText}
                            </div>
                            <div className="text-[#D34E2A] font-semibold italic bg-[#FDF2F0] px-2 py-1 rounded-md mt-1">
                              "{item.optionText}"
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Icebreaker Prompt */}
                  <div className="p-3 rounded-2xl bg-[#FDF2F0] border border-[#F3BEB5]/60 text-xs text-[#0B3B3D] space-y-1">
                    <div className="font-bold text-[#D34E2A] flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Suggested Icebreaker</span>
                    </div>
                    <p className="text-[#0B3B3D]/85 leading-snug">
                      {profile.icebreaker}
                    </p>
                  </div>

                  {/* Connect Actions */}
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`https://instagram.com/${cleanHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#E05A47] hover:bg-[#C44633] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>Connect on Instagram</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `Match with ${profile.fullName} on Two of Us`,
                            text: `I got a ${profile.matchScore}% match with ${profile.fullName} on Two of Us!`,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(`https://instagram.com/${cleanHandle}`);
                          alert(`Instagram handle @${cleanHandle} copied!`);
                        }
                      }}
                      className="p-3 rounded-xl border border-[#A3C4CB] hover:bg-[#F4F8F9] text-[#0B3B3D] transition-colors"
                      title="Share / Copy Handle"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Return Button */}
      <div className="pt-8 text-center space-y-3">
        <button
          onClick={onBackToBingo}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0B3B3D] hover:bg-[#072425] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          Return to Bingo Board
        </button>
        <p className="text-[11px] text-[#0B3B3D]/60">
          Match scores are computed by comparing all 9 personality dimensions.
        </p>
      </div>
    </div>
  );
};
