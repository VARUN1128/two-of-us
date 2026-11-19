import React, { useState } from 'react';
import type { BingoBoard, BingoConnection, Participant, WinningLine } from '../../types';
import { evaluateBingoBoard, getWinningCellIndices } from '../../lib/bingoLogic';
import { BingoInteractionModal } from './BingoInteractionModal';
import { BingoSuccessNotification } from './BingoSuccessNotification';
import { ProgressBar } from '../common/ProgressBar';
import { Users, Award, Trophy, Check, ArrowRight } from 'lucide-react';
import { AppDataStore } from '../../lib/store';

interface HumanBingoPageProps {
  participant: Participant;
  board: BingoBoard;
  connections: BingoConnection[];
  onBoardUpdated: (board: BingoBoard, newConnections: BingoConnection[]) => void;
  onViewConnections: () => void;
  onFullBoardCompleted: () => void;
}

export const HumanBingoPage: React.FC<HumanBingoPageProps> = ({
  participant,
  board,
  connections,
  onBoardUpdated,
  onViewConnections,
  onFullBoardCompleted,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newlyCompletedLines, setNewlyCompletedLines] = useState<WinningLine[]>([]);
  const [viewCompletedLetter, setViewCompletedLetter] = useState<string | null>(null);

  const evalResult = evaluateBingoBoard(board.letters, board.completed_letters);
  const winningIndices = getWinningCellIndices(board.letters, board.completed_letters);
  const completedSet = new Set(board.completed_letters.map((l) => l.toUpperCase()));

  // Map of letter to connection details
  const connectionByLetter = new Map<string, BingoConnection>();
  connections.forEach((c) => {
    connectionByLetter.set(c.bingo_letter.toUpperCase(), c);
  });

  const handleCellClick = (letter: string) => {
    const isCompleted = completedSet.has(letter.toUpperCase());
    if (isCompleted) {
      // Show connection preview
      setViewCompletedLetter(letter.toUpperCase());
    } else {
      setSelectedLetter(letter.toUpperCase());
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async (data: {
    letter: string;
    personName: string;
    selfieSource: File | string;
    randomQuestion: string;
    questionAnswer: string;
  }) => {
    const result = await AppDataStore.submitBingoConnection(
      participant.id,
      data.letter,
      data.personName,
      data.selfieSource,
      data.randomQuestion,
      data.questionAnswer
    );

    if (result.success && result.board && result.connection) {
      const updatedConnections = [result.connection, ...connections];
      onBoardUpdated(result.board, updatedConnections);

      if (result.newlyCompletedLines.length > 0) {
        setNewlyCompletedLines(result.newlyCompletedLines);
      }

      if (result.isFullBoardCompleted) {
        setTimeout(() => {
          onFullBoardCompleted();
        }, 1200);
      }

      return { success: true };
    }

    return { success: false, error: result.error || 'Failed to submit' };
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-5 animate-in fade-in duration-300">
      {/* Top Banner / Headline */}
      <div className="text-center space-y-1.5 mb-4">
        <h2
          className="text-2xl md:text-3xl font-medium text-[#0B3B3D] tracking-tight"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Human Bingo
        </h2>
        <p className="text-xs text-[#0B3B3D]/75 font-sans leading-relaxed max-w-xs mx-auto">
          Find someone whose name starts with the letter on your board. Meet them, take a selfie together, answer a fun question, and mark that letter off.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 mb-4 shadow-2xs">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#0B3B3D]/70 font-medium">
            <Users className="w-3 h-3 text-[#E05A47]" />
            <span>People Met</span>
          </div>
          <div className="text-lg font-bold text-[#0B3B3D] mt-0.5">
            {evalResult.peopleMet} <span className="text-xs text-[#0B3B3D]/50 font-normal">/ 25</span>
          </div>
        </div>

        <div className="text-center border-x border-[#A3C4CB]/30">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#0B3B3D]/70 font-medium">
            <Award className="w-3 h-3 text-[#E05A47]" />
            <span>Bingo Lines</span>
          </div>
          <div className="text-lg font-bold text-[#E05A47] mt-0.5">
            {evalResult.completedCount} <span className="text-xs text-[#0B3B3D]/50 font-normal">/ 12</span>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#0B3B3D]/70 font-medium">
            <Trophy className="w-3 h-3 text-[#E05A47]" />
            <span>Completed</span>
          </div>
          <div className="text-lg font-bold text-[#0B3B3D] mt-0.5">
            {evalResult.completionPercentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          current={evalResult.peopleMet}
          total={25}
          label={`${evalResult.peopleMet} of 25 Letters Cleared`}
        />
      </div>

      {/* The 5 x 5 Bingo Board */}
      <div className="bg-[#F4F8F9] p-3 rounded-3xl border border-[#A3C4CB]/40 shadow-xs mb-4">
        <div className="grid grid-cols-5 gap-2 aspect-square w-full">
          {board.letters.map((letter, idx) => {
            const isCompleted = completedSet.has(letter.toUpperCase());
            const isWinningCell = winningIndices.has(idx);
            const connection = connectionByLetter.get(letter.toUpperCase());

            return (
              <button
                key={`${letter}-${idx}`}
                onClick={() => handleCellClick(letter)}
                className={`relative rounded-2xl flex flex-col items-center justify-center aspect-square transition-all duration-200 select-none cursor-pointer active:scale-95 group ${
                  isCompleted
                    ? isWinningCell
                      ? 'bg-[#E05A47] text-white shadow-md ring-2 ring-[#E05A47] ring-offset-1 ring-offset-white'
                      : 'bg-[#E05A47] text-white shadow-xs'
                    : 'bg-white hover:bg-[#FDF2F0] text-[#0B3B3D] border border-[#A3C4CB]/60 hover:border-[#E05A47]'
                }`}
                title={
                  isCompleted && connection
                    ? `Completed with ${connection.person_name}`
                    : `Tap to connect with someone starting with ${letter}`
                }
              >
                {/* Completed letter photo or check badge */}
                {isCompleted ? (
                  <div className="flex flex-col items-center justify-center w-full h-full p-1 relative">
                    <span 
                      className="font-serif text-xl sm:text-2xl font-bold leading-none"
                      style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                    >
                      {letter}
                    </span>
                    {connection && (
                      <span className="text-[9px] font-sans font-medium text-white/90 truncate max-w-full px-1 mt-0.5 leading-tight">
                        {connection.person_name.split(' ')[0]}
                      </span>
                    )}
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white text-[#E05A47] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span 
                      className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B3B3D] group-hover:text-[#E05A47] transition-colors"
                      style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                    >
                      {letter}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-[#A3C4CB] font-sans font-medium group-hover:text-[#E05A47]">
                      Tap
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Board bottom navigation & full completion button */}
      <div className="space-y-2.5 pt-1">
        {evalResult.isFullBoardCompleted ? (
          <button
            onClick={onFullBoardCompleted}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 animate-bounce cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>View Full Board Completion Celebration!</span>
          </button>
        ) : null}

        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={onViewConnections}
            className="inline-flex items-center gap-1.5 font-medium text-[#E05A47] hover:text-[#C44633] transition-colors py-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Connections ({connections.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <span className="text-[11px] text-[#0B3B3D]/60 font-sans">
            {25 - evalResult.peopleMet} letters left to meet
          </span>
        </div>
      </div>

      {/* Interaction Modal for letter */}
      {selectedLetter && (
        <BingoInteractionModal
          isOpen={isModalOpen}
          letter={selectedLetter}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLetter(null);
          }}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Line completed celebration notification */}
      {newlyCompletedLines.length > 0 && (
        <BingoSuccessNotification
          newlyCompletedLines={newlyCompletedLines}
          onDismiss={() => setNewlyCompletedLines([])}
        />
      )}

      {/* Quick view of already completed letter */}
      {viewCompletedLetter && connectionByLetter.get(viewCompletedLetter) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 space-y-4 shadow-2xl border border-[#A3C4CB]/40">
            {(() => {
              const c = connectionByLetter.get(viewCompletedLetter)!;
              return (
                <>
                  <div className="flex items-center justify-between border-b border-[#A3C4CB]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#E05A47] text-white flex items-center justify-center font-serif text-sm font-bold">
                        {viewCompletedLetter}
                      </span>
                      <span className="font-serif text-lg font-medium text-[#0B3B3D]">
                        {c.person_name}
                      </span>
                    </div>
                    <button
                      onClick={() => setViewCompletedLetter(null)}
                      className="text-[#0B3B3D]/50 hover:text-[#0B3B3D] p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <img
                    src={c.selfie_url}
                    alt={c.person_name}
                    className="w-full aspect-square rounded-2xl object-cover border border-[#E05A47]/20"
                  />

                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-[#0B3B3D]">Q: {c.random_question}</p>
                    <p className="italic text-[#E05A47] bg-[#FDF2F0] p-2.5 rounded-xl border border-[#E05A47]/20">
                      "{c.question_answer}"
                    </p>
                  </div>

                  <button
                    onClick={() => setViewCompletedLetter(null)}
                    className="w-full py-2.5 rounded-xl bg-[#E05A47] text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
