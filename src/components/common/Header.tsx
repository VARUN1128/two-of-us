import React from 'react';
import type { AppStage, Participant } from '../../types';
import { Users, Shield, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  stage: AppStage;
  participant: Participant | null;
  connectionsCount: number;
  onNavigate: (stage: AppStage) => void;
  onOpenAdmin: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  participant,
  connectionsCount,
  onNavigate,
  onOpenAdmin,
  onSignOut,
}) => {
  const showConnections =
    participant &&
    (stage === 'bingo' || stage === 'connections' || stage === 'board_completed');

  return (
    <header className="sticky top-0 z-40 w-full px-5 py-3.5 transition-all bg-transparent">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Brand or Back */}
        <div className="flex items-center gap-2">
          {stage === 'connections' ? (
            <button
              onClick={() => onNavigate('bingo')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0B3B3D] hover:text-[#088F87] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-[#F4F8F9]"
              aria-label="Back to Bingo Board"
            >
              <ArrowLeft className="w-4 h-4 text-[#088F87]" />
              <span>Bingo Board</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (stage === 'admin') {
                  onNavigate(participant ? (participant.questionnaire_completed ? 'bingo' : 'questionnaire') : 'welcome');
                } else if (!participant) {
                  onNavigate('welcome');
                }
              }}
              className="focus:outline-none flex items-center gap-2.5 text-left select-none group"
            >
              <img
                src="/brand-heart-clean.png"
                alt="Two of Us Logo"
                className="w-6 h-6 object-contain group-hover:scale-105 transition-transform"
              />
              <span
                className="font-serif text-2xl font-normal text-[#0B3B3D] tracking-tight leading-none"
                style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
              >
                Two of Us
              </span>
            </button>
          )}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {showConnections && stage !== 'connections' && (
            <button
              onClick={() => onNavigate('connections')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#E6F6F5] text-[#0B3B3D] hover:bg-[#A3C4CB]/30 border border-[#088F87]/20 transition-all active:scale-95 shadow-xs"
              title="View your connections"
            >
              <Users className="w-3.5 h-3.5 text-[#088F87]" />
              <span>Connections</span>
              <span className="w-5 h-5 rounded-full bg-[#088F87] text-white flex items-center justify-center text-[10px] font-bold">
                {connectionsCount}
              </span>
            </button>
          )}

          {/* Sign Out / Reset if logged in */}
          {participant && onSignOut && (
            <button
              onClick={onSignOut}
              className="px-2.5 py-1 text-[11px] font-medium text-[#0B3B3D]/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out / Switch Player"
            >
              Exit
            </button>
          )}

          {/* Admin shortcut shield button matching screenshot */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-full transition-colors ${
              stage === 'admin'
                ? 'bg-[#088F87] text-white'
                : 'text-[#0B3B3D]/70 hover:text-[#088F87] hover:bg-[#F4F8F9]/80'
            }`}
            title="Organizer Command Center"
            aria-label="Organizer Command Center"
          >
            <Shield className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
