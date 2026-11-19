import React, { useState } from 'react';
import type { BingoConnection, Participant } from '../../types';
import { ArrowLeft, Users, Calendar, Sparkles, X, Heart } from 'lucide-react';

interface MyConnectionsPageProps {
  participant: Participant;
  connections: BingoConnection[];
  onBackToBingo: () => void;
}

export const MyConnectionsPage: React.FC<MyConnectionsPageProps> = ({
  participant: _participant,
  connections,
  onBackToBingo,
}) => {
  const [selectedSelfie, setSelectedSelfie] = useState<{
    url: string;
    name: string;
    letter: string;
    question: string;
    answer: string;
  } | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-4 py-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBackToBingo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3B3D] hover:text-[#E05A47] transition-colors py-1.5 px-3 rounded-full bg-[#F4F8F9] hover:bg-[#FDF2F0]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E05A47]" />
          <span>Back to Bingo</span>
        </button>

        <span className="text-xs font-medium text-[#E05A47] bg-[#FDF2F0] px-3 py-1 rounded-full border border-[#E05A47]/20">
          {connections.length} {connections.length === 1 ? 'Connection' : 'Connections'}
        </span>
      </div>

      <div className="space-y-1 mb-6">
        <h2
          className="text-3xl font-medium text-[#0B3B3D] tracking-tight"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          My Connections
        </h2>
        <p className="text-xs text-[#0B3B3D]/70 font-sans">
          The stories, smiles, and new friends you met during Two of Us.
        </p>
      </div>

      {/* Empty State */}
      {connections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F4F8F9] rounded-3xl border border-[#A3C4CB]/30 my-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#E05A47] shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-xs">
            <h3 className="font-serif text-xl font-medium text-[#0B3B3D]">
              No connections yet!
            </h3>
            <p className="text-xs text-[#0B3B3D]/70 font-sans leading-relaxed">
              Tap any letter on your Bingo board to break the ice, snap a selfie, and start filling your connection diary.
            </p>
          </div>
          <button
            onClick={onBackToBingo}
            className="px-6 py-2.5 rounded-full bg-[#E05A47] text-white text-xs font-semibold hover:bg-[#C44633] transition-all shadow-xs"
          >
            Go to Bingo Board
          </button>
        </div>
      ) : (
        /* Connections Grid / List */
        <div className="space-y-3.5 pb-8">
          {connections.map((c) => (
            <div
              key={c.id || c.bingo_letter}
              className="p-4 rounded-2xl bg-white border border-[#A3C4CB]/40 shadow-xs hover:border-[#E05A47]/40 hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              {/* Selfie thumbnail with letter overlay */}
              <div
                className="relative cursor-pointer shrink-0 group self-center sm:self-auto"
                onClick={() =>
                  setSelectedSelfie({
                    url: c.selfie_url,
                    name: c.person_name,
                    letter: c.bingo_letter,
                    question: c.random_question,
                    answer: c.question_answer,
                  })
                }
                title="Click to view full photo"
              >
                <img
                  src={c.selfie_url}
                  alt={c.person_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#A3C4CB]/40 group-hover:scale-[1.02] transition-transform"
                />
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-lg bg-[#E05A47] text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                  {c.bingo_letter}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  View
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-medium text-[#0B3B3D]">
                      {c.person_name}
                    </h3>
                    <span className="text-[10px] font-semibold text-[#E05A47] bg-[#FDF2F0] px-2 py-0.5 rounded-full">
                      Letter '{c.bingo_letter}'
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#0B3B3D]/60 font-sans">
                    <Calendar className="w-3 h-3 text-[#A3C4CB]" />
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                </div>

                {/* Q&A Snippet */}
                <div className="bg-[#F4F8F9] p-3 rounded-xl border border-[#A3C4CB]/30 space-y-1">
                  <div className="flex items-start gap-1.5 text-xs text-[#0B3B3D]/80">
                    <Sparkles className="w-3.5 h-3.5 text-[#E05A47] shrink-0 mt-0.5" />
                    <span className="font-medium text-[11px]">{c.random_question}</span>
                  </div>
                  <div className="text-xs text-[#E05A47] font-semibold italic pl-5">
                    "{c.question_answer}"
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* High-Res Selfie Modal Preview */}
      {selectedSelfie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-[#A3C4CB]/50 relative">
            <button
              onClick={() => setSelectedSelfie(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0B3B3D] transition-colors shadow-xs"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pt-1">
              <span className="w-8 h-8 rounded-xl bg-[#E05A47] text-white flex items-center justify-center font-serif text-sm font-bold">
                {selectedSelfie.letter}
              </span>
              <div>
                <h4 className="font-serif text-xl font-medium text-[#0B3B3D]">
                  {selectedSelfie.name}
                </h4>
                <p className="text-[11px] text-[#E05A47] font-sans">
                  Human Bingo Connection
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#A3C4CB]/40 shadow-xs">
              <img
                src={selectedSelfie.url}
                alt={selectedSelfie.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FDF2F0] border border-[#E05A47]/20 space-y-1">
              <div className="text-[11px] font-semibold text-[#0B3B3D]">
                Q: {selectedSelfie.question}
              </div>
              <div className="text-xs text-[#E05A47] font-bold italic">
                "{selectedSelfie.answer}"
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0B3B3D]/60 pt-1">
              <Heart className="w-3.5 h-3.5 fill-[#E05A47] text-[#E05A47]" />
              <span>Two of Us Memories</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
