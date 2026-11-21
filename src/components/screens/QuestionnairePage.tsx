import React, { useState, useEffect } from 'react';
import { PERSONALITY_QUESTIONS } from '../../constants/questions';
import type { QuestionOption } from '../../constants/questions';
import type { Participant } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { AppDataStore } from '../../lib/store';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface QuestionnairePageProps {
  participant: Participant;
  onComplete: () => void;
}

export const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  participant,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing answers on mount
  useEffect(() => {
    let mounted = true;
    AppDataStore.getQuestionnaireAnswers(participant.id).then((saved) => {
      if (mounted) {
        setSelectedAnswers(saved);
        // Resume at first unanswered question
        for (let i = 0; i < PERSONALITY_QUESTIONS.length; i++) {
          if (!saved[PERSONALITY_QUESTIONS[i].number]) {
            setCurrentIndex(i);
            break;
          }
        }
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [participant.id]);

  const currentQ = PERSONALITY_QUESTIONS[currentIndex];
  const currentAnswer = selectedAnswers[currentQ?.number];
  const totalQuestions = PERSONALITY_QUESTIONS.length;

  const handleSelectOption = async (option: QuestionOption) => {
    const updated = {
      ...selectedAnswers,
      [currentQ.number]: `${option.key}: ${option.text}`,
    };
    setSelectedAnswers(updated);

    // Save answer in real time
    await AppDataStore.saveQuestionnaireAnswer(
      participant.id,
      currentQ.number,
      currentQ.question,
      `${option.key}: ${option.text}`
    );
  };

  const handleNext = async () => {
    if (!currentAnswer) return;

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all 9 questions
      setIsSaving(true);
      await AppDataStore.completeQuestionnaire(participant.id);
      setIsSaving(false);
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#E05A47] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#0B3B3D]/70 font-sans">Loading your questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col justify-between max-w-md md:max-w-lg mx-auto w-full px-4 sm:px-6 py-3 sm:py-5 overflow-hidden animate-in fade-in duration-300 select-none">
      {/* Top Progress & Category */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-1 text-xs font-medium py-1 px-2 -ml-2 rounded-lg transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-[#0B3B3D]/70 hover:text-[#E05A47] hover:bg-[#F4F8F9]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/20">
            {currentQ.category}
          </span>

          <span className="text-xs font-medium text-[#0B3B3D]/60">
            {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <ProgressBar
          current={currentIndex + 1}
          total={totalQuestions}
          label={`Question ${currentIndex + 1} of ${totalQuestions}`}
        />
      </div>

      {/* Center: Question and 4 Selectable Answer Cards (Always fits without scroll) */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 sm:py-3 space-y-3 sm:space-y-4 overflow-y-auto min-h-0">
        <div className="space-y-1 sm:space-y-1.5 shrink-0">
          <div className="text-[11px] sm:text-xs text-[#E05A47] font-semibold tracking-wide">
            Question 0{currentQ.number}
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0B3B3D] leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            {currentQ.question}
          </h2>
        </div>

        {/* 4 Answer Cards */}
        <div className="space-y-2 sm:space-y-2.5">
          {currentQ.options.map((option) => {
            const isSelected = currentAnswer?.startsWith(option.key);

            return (
              <div
                key={option.key}
                onClick={() => handleSelectOption(option)}
                className={`group relative py-2.5 px-3.5 sm:py-3.5 sm:px-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#FDF2F0] border-[#E05A47] shadow-xs'
                    : 'bg-white border-[#A3C4CB]/50 hover:border-[#E05A47]/60 hover:bg-[#F4F8F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Key Badge (A, B, C, D) */}
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#E05A47] text-white'
                        : 'bg-[#F4F8F9] text-[#0B3B3D]/80 group-hover:bg-[#A3C4CB]/30'
                    }`}
                  >
                    {option.key}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium leading-snug ${
                      isSelected ? 'text-[#0B3B3D] font-semibold' : 'text-[#0B3B3D]/90'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>

                {/* Selection Checkmark */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-[#E05A47] border-[#E05A47] text-white scale-100'
                      : 'border-[#A3C4CB]/40 bg-transparent opacity-0 group-hover:opacity-40'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Continue Action (Always anchored and visible in viewport) */}
      <div className="shrink-0 pt-2 sm:pt-3 pb-1">
        <button
          onClick={handleNext}
          disabled={!currentAnswer || isSaving}
          className={`w-full py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            currentAnswer && !isSaving
              ? 'bg-[#D34E2A] hover:bg-[#BA3F1E] text-white active:scale-98 shadow-[0_4px_14px_rgba(211,78,42,0.25)]'
              : 'bg-[#A3C4CB]/40 text-[#0B3B3D]/40 cursor-not-allowed shadow-none'
          }`}
        >
          {isSaving ? (
            <span>Saving Answers...</span>
          ) : currentIndex === totalQuestions - 1 ? (
            <>
              <span>Finish Questionnaire</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
