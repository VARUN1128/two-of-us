import React from 'react';
import { BrandLogo } from './BrandLogo';
import type { AppStage, Participant } from '../../types';
import { Users, Shield, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  stage: AppStage;
  participant: Participant | null;
  connectionsCount: number;
  onNavigate: (stage: AppStage) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  participant,
  connectionsCount,
  onNavigate,
  onOpenAdmin,
}) => {
  const showConnections =
    participant &&
    (stage === 'bingo' || stage === 'connections' || stage === 'board_completed');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#A3C4CB]/30 px-4 py-3 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Left: Brand or Back */}
        <div className="flex items-center gap-3">
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
                }
              }}
              className="focus:outline-none text-left"
            >
              <BrandLogo size="sm" showSubtitle={false} />
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

          {/* Admin shortcut button */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-full transition-colors ${
              stage === 'admin'
                ? 'bg-[#088F87] text-white'
                : 'text-[#A3C4CB] hover:text-[#0B3B3D] hover:bg-[#F4F8F9]'
            }`}
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
