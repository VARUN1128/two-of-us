import React, { useState, useEffect } from 'react';
import { AppDataStore } from '../../lib/store';
import type { AdminParticipantRow } from '../../lib/store';
import type { EventSettings, BingoConnection } from '../../types';
import { 
  Users, 
  Search, 
  Shield, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Sliders, 
  ArrowLeft,
  CheckCircle2,
  Phone,
  Camera,
  Trophy,
  Sparkles,
  X,
  Eye,
  Flame,
  Award
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Data State
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'leaderboard' | 'controls'>('directory');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'questionnaire' | 'completed'>('all');
  const [selectedParticipantRow, setSelectedParticipantRow] = useState<AdminParticipantRow | null>(null);
  const [selectedSelfiePreview, setSelectedSelfiePreview] = useState<BingoConnection | null>(null);

  const [stats, setStats] = useState({
    totalRegistrations: 0,
    questionnaireCompleted: 0,
    activeBingoParticipants: 0,
    totalConnections: 0,
    completedBingoBoards: 0,
    avgConnectionsPerParticipant: 0,
  });
  const [participants, setParticipants] = useState<AdminParticipantRow[]>([]);
  const [eventSettings, setEventSettings] = useState<EventSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Default admin passcode
  const expectedPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'twoofus2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === expectedPasscode) {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Invalid admin passcode. Please enter twoofus2026.');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setAuthError('');
    loadData();
  };

  const loadData = async () => {
    try {
      const [data, settings] = await Promise.all([
        AppDataStore.getAdminData(),
        AppDataStore.getEventSettings(),
      ]);
      setStats(data.stats);
      setParticipants(data.participants);
      setEventSettings(settings);

      // Keep selected participant row updated if currently open
      if (selectedParticipantRow) {
        const updated = data.participants.find(p => p.participant.id === selectedParticipantRow.participant.id);
        if (updated) setSelectedParticipantRow(updated);
      }
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleRegistration = async () => {
    if (!eventSettings) return;
    const updated = await AppDataStore.updateEventSettings({
      registration_enabled: !eventSettings.registration_enabled,
    });
    setEventSettings(updated);
  };

  const handleToggleBingo = async () => {
    if (!eventSettings) return;
    const updated = await AppDataStore.updateEventSettings({
      bingo_enabled: !eventSettings.bingo_enabled,
    });
    setEventSettings(updated);
  };

  const handleToggleEventStatus = async () => {
    if (!eventSettings) return;
    const nextStatus = eventSettings.event_status === 'active' ? 'paused' : 'active';
    const updated = await AppDataStore.updateEventSettings({
      event_status: nextStatus,
    });
    setEventSettings(updated);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Filter participants
  const filteredParticipants = participants.filter((row) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      row.participant.full_name.toLowerCase().includes(q) ||
      row.participant.mobile_number.includes(q) ||
      row.participant.instagram_id.toLowerCase().includes(q)
    );

    if (!matchesSearch) return false;

    if (filterType === 'active') return row.completedLettersCount > 0;
    if (filterType === 'questionnaire') return row.participant.questionnaire_completed;
    if (filterType === 'completed') return row.isBoardComplete || row.completedLinesCount >= 5;

    return true;
  });

  // Top networkers leaderboard (sorted by connections/selfies taken)
  const leaderboard = [...participants]
    .filter(p => p.completedLettersCount > 0)
    .sort((a, b) => b.completedLettersCount - a.completedLettersCount);

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[85vh] flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full font-sans">
        {/* Corner Logo */}
        <button
          onClick={onBackToApp}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 cursor-pointer group focus:outline-none"
          title="Return to Event App"
        >
          <img
            src="/brand-fox-heart-logo.png"
            alt="Two of Us Logo"
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
          />
        </button>

        <div className="w-full p-6 rounded-3xl bg-white border border-[#A3C4CB]/50 shadow-xl space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] border border-[#E05A47]/20 flex items-center justify-center text-[#E05A47] mx-auto shadow-xs">
            <Shield className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 
              className="font-serif text-2xl font-medium text-[#0B3B3D]"
              style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
            >
              Organizer Access
            </h3>
            <p className="text-xs text-[#0B3B3D]/70 font-sans">
              Enter admin passcode to track participants, live selfies, and event networking.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <input
                type="password"
                placeholder="Admin Passcode (twoofus2026)"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  if (authError) setAuthError('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#A3C4CB] text-sm text-[#0B3B3D] placeholder-[#A3C4CB] text-center focus:outline-none focus:border-[#E05A47]"
                autoFocus
                required
              />
              {authError && (
                <p className="text-xs text-red-600 mt-1.5">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#E05A47] hover:bg-[#C44633] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-1">
            <button
              onClick={handleQuickUnlock}
              className="text-[11px] text-[#E05A47] hover:underline font-medium cursor-pointer"
            >
              Quick Organizer Unlock (twoofus2026)
            </button>
          </div>

          <button
            onClick={onBackToApp}
            className="text-xs text-[#0B3B3D]/60 hover:text-[#E05A47] transition-colors pt-2 block mx-auto cursor-pointer"
          >
            ← Return to Event App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 sm:py-5 font-sans space-y-5 animate-in fade-in duration-300">
      {/* Corner Logo & Action Bar (Header removed) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Corner Logo */}
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title="Return to Event App"
        >
          <img
            src="/brand-fox-heart-logo.png"
            alt="Two of Us Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#E05A47] bg-[#FDF2F0] px-2 py-0.5 rounded-full border border-[#E05A47]/20">
            Admin
          </span>
        </button>

        {/* Minimal Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#A3C4CB]/50 text-xs font-medium text-[#0B3B3D] hover:bg-[#F4F8F9] transition-all cursor-pointer"
            title="Refresh participant & selfie data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#E05A47]' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F4F8F9] hover:bg-[#FDF2F0] text-[#0B3B3D] hover:text-[#E05A47] text-xs font-medium transition-colors cursor-pointer border border-[#A3C4CB]/30"
            title="Return to App"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards (6 Stat Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Participants */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Participants</span>
            <Users className="w-3.5 h-3.5 text-[#E05A47]" />
          </div>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.totalRegistrations}</div>
          <span className="text-[10px] text-[#E05A47] font-medium">Total Registered</span>
        </div>

        {/* Card 2: Total Networked Selfies */}
        <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F3BEB5] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#D34E2A] font-semibold">Selfies Taken</span>
            <Camera className="w-3.5 h-3.5 text-[#D34E2A]" />
          </div>
          <div className="text-2xl font-bold text-[#D34E2A]">{stats.totalConnections}</div>
          <span className="text-[10px] text-[#0B3B3D]/70 font-medium">Total Connections</span>
        </div>

        {/* Card 3: Active Networkers */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Active Networkers</span>
            <Flame className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.activeBingoParticipants}</div>
          <span className="text-[10px] text-amber-700 font-medium">Met ≥1 person</span>
        </div>

        {/* Card 4: Questionnaires Done */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Questionnaires</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.questionnaireCompleted}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Completed Q1-Q9</span>
        </div>

        {/* Card 5: Full Boards */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Full Boards</span>
            <Trophy className="w-3.5 h-3.5 text-[#E05A47]" />
          </div>
          <div className="text-2xl font-bold text-[#E05A47]">{stats.completedBingoBoards}</div>
          <span className="text-[10px] text-[#0B3B3D]/60 font-medium">All 25 Cleared</span>
        </div>

        {/* Card 6: Average Connections */}
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Avg Networked</span>
            <Sparkles className="w-3.5 h-3.5 text-[#E05A47]" />
          </div>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.avgConnectionsPerParticipant}</div>
          <span className="text-[10px] text-[#E05A47] font-medium">Per Participant</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#A3C4CB]/30 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'directory'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Participant Tracking Directory ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Top Networkers Leaderboard ({leaderboard.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('controls')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'controls'
              ? 'bg-[#E05A47] text-white shadow-xs'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Event Controls</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PARTICIPANT DIRECTORY & NETWORK TRACKING           */}
      {/* ========================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-3">
          {/* Controls row: Search + Status filter pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  filterType === 'all'
                    ? 'bg-[#0B3B3D] text-white font-semibold'
                    : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
                }`}
              >
                All ({participants.length})
              </button>
              <button
                onClick={() => setFilterType('active')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  filterType === 'active'
                    ? 'bg-[#E05A47] text-white font-semibold'
                    : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
                }`}
              >
                Networked ≥1 ({participants.filter(p => p.completedLettersCount > 0).length})
              </button>
              <button
                onClick={() => setFilterType('questionnaire')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  filterType === 'questionnaire'
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
                }`}
              >
                Questionnaire Done ({stats.questionnaireCompleted})
              </button>
              <button
                onClick={() => setFilterType('completed')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  filterType === 'completed'
                    ? 'bg-[#D34E2A] text-white font-semibold'
                    : 'bg-[#F4F8F9] text-[#0B3B3D]/70 hover:bg-[#FDF2F0]'
                }`}
              >
                Full B-I-N-G-O ({stats.completedBingoBoards})
              </button>
            </div>

            {/* Search input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A3C4CB]" />
              <input
                type="text"
                placeholder="Search participant, mobile, IG..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-[#A3C4CB]/50 text-[#0B3B3D] placeholder-[#A3C4CB] focus:outline-none focus:border-[#E05A47]"
              />
            </div>
          </div>

          {/* Table container */}
          <div className="bg-white rounded-2xl border border-[#A3C4CB]/40 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0B3B3D]">
                <thead className="bg-[#F4F8F9] border-b border-[#A3C4CB]/30 text-[11px] font-semibold text-[#0B3B3D]/80">
                  <tr>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Mobile & Instagram</th>
                    <th className="py-3 px-4 text-center">Questionnaire</th>
                    <th className="py-3 px-4 text-center">People Networked (Selfies)</th>
                    <th className="py-3 px-4 text-center">Lines Cut</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Network Trail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A3C4CB]/20">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#0B3B3D]/60">
                        {searchQuery ? 'No participants match your search.' : 'No participants found in this category.'}
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((row) => {
                      const { participant, completedLettersCount, completedLinesCount, isBoardComplete, connections } = row;
                      const hasNetworked = completedLettersCount > 0;

                      return (
                        <tr key={participant.id} className="hover:bg-[#F4F8F9]/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#0B3B3D] text-sm">{participant.full_name}</div>
                            <div className="text-[10px] text-[#0B3B3D]/50 font-mono">
                              Joined {new Date(participant.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-mono text-[11px] text-[#E05A47]">
                              <Phone className="w-3 h-3 text-[#A3C4CB] shrink-0" />
                              <span>+91 {participant.mobile_number}</span>
                            </div>
                            <div className="text-[11px] text-[#0B3B3D]/70 mt-0.5">
                              {participant.instagram_id}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {participant.questionnaire_completed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF2F0] text-[#E05A47] font-semibold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px]">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* People Networked / Selfies */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0B3B3D]">
                              <Camera className="w-3.5 h-3.5 text-[#E05A47]" />
                              <span>{completedLettersCount}</span>
                              <span className="text-[10px] text-[#0B3B3D]/50 font-normal">/ 25</span>
                            </div>
                            <div className="w-20 mx-auto bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div 
                                className="bg-[#E05A47] h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.round((completedLettersCount / 25) * 100))}%` }}
                              />
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-[#F4F8F9] text-[#E05A47] font-bold text-[11px] border border-[#A3C4CB]/30">
                              {completedLinesCount} / 12
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {isBoardComplete ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#E05A47] text-white font-bold text-[10px] shadow-2xs">
                                Full Board 🏆
                              </span>
                            ) : completedLinesCount >= 5 ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FDF2F0] border border-[#E05A47] text-[#D34E2A] font-bold text-[10px]">
                                B-I-N-G-O! 🎉
                              </span>
                            ) : hasNetworked ? (
                              <span className="text-[#E05A47] font-medium text-[11px]">
                                In Progress
                              </span>
                            ) : (
                              <span className="text-[#A3C4CB] text-[11px]">
                                Not Started
                              </span>
                            )}
                          </td>

                          {/* Action Button: View Networking Trail */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedParticipantRow(row)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                connections.length > 0
                                  ? 'bg-[#FDF2F0] hover:bg-[#FCEEE8] border border-[#F3BEB5] text-[#D34E2A]'
                                  : 'bg-[#F4F8F9] hover:bg-[#FDF2F0] text-[#0B3B3D]/60 border border-[#A3C4CB]/40'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{connections.length > 0 ? `Trail (${connections.length})` : 'Details'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TOP NETWORKERS LEADERBOARD                         */}
      {/* ========================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#0B3B3D]">
                Top Event Networkers Leaderboard
              </h3>
              <p className="text-xs text-[#0B3B3D]/70">
                Attendees ranked by the number of unique people they met and photographed
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FDF2F0] text-[#E05A47] font-bold text-xs">
              {leaderboard.length} Active Participants
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {leaderboard.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-[#A3C4CB]/30 space-y-2">
                <Users className="w-8 h-8 text-[#A3C4CB] mx-auto" />
                <p className="text-sm font-semibold text-[#0B3B3D]">No selfies recorded yet</p>
                <p className="text-xs text-[#0B3B3D]/60">Participants who connect and photograph will appear on the leaderboard here.</p>
              </div>
            ) : (
              leaderboard.map((row, index) => {
                const { participant, completedLettersCount, completedLinesCount, connections } = row;
                const isTop3 = index < 3;

                return (
                  <div
                    key={participant.id}
                    onClick={() => setSelectedParticipantRow(row)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
                      index === 0
                        ? 'bg-gradient-to-br from-[#FFF8F6] to-[#FDF2F0] border-[#E05A47] ring-2 ring-[#E05A47]/10'
                        : isTop3
                        ? 'bg-white border-[#F3BEB5] shadow-2xs'
                        : 'bg-white border-[#A3C4CB]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? 'bg-[#E05A47] text-white shadow-xs'
                            : index === 1
                            ? 'bg-amber-600 text-white'
                            : index === 2
                            ? 'bg-stone-500 text-white'
                            : 'bg-[#F4F8F9] text-[#0B3B3D]'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#0B3B3D] flex items-center gap-1.5">
                            <span>{participant.full_name}</span>
                            {index === 0 && <Award className="w-3.5 h-3.5 text-[#E05A47]" />}
                          </div>
                          <div className="text-[11px] text-[#0B3B3D]/60 font-mono">
                            {participant.instagram_id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-[#E05A47]">
                          {completedLettersCount}
                        </div>
                        <div className="text-[10px] text-[#0B3B3D]/60 uppercase tracking-wider font-semibold">
                          People Met
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#A3C4CB]/20 flex items-center justify-between text-xs text-[#0B3B3D]/75">
                      <span>{completedLinesCount} Lines Completed</span>
                      <span className="font-semibold text-[#D34E2A] flex items-center gap-1">
                        <span>View {connections.length} Selfies</span>
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EVENT CONTROLS                                    */}
      {/* ========================================================= */}
      {activeTab === 'controls' && eventSettings && (
        <div className="p-5 rounded-3xl bg-white border border-[#A3C4CB]/40 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-medium text-[#0B3B3D]">
              Live Event Controls & Overrides
            </h3>
            <p className="text-xs text-[#0B3B3D]/70">
              Manage live registration access and event pause status
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Event Status Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Event Status</div>
                <div className="text-xs text-[#E05A47] capitalize font-bold mt-0.5">
                  {eventSettings.event_status}
                </div>
              </div>
              <button
                onClick={handleToggleEventStatus}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-xs ${
                  eventSettings.event_status === 'active'
                    ? 'bg-[#E05A47] hover:bg-[#C44633]'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {eventSettings.event_status === 'active' ? 'Pause Event' : 'Resume Event'}
              </button>
            </div>

            {/* Registration Enabled Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Registration</div>
                <div className="text-xs text-[#0B3B3D]/70 mt-0.5">
                  {eventSettings.registration_enabled ? 'Open to New Attendees' : 'Closed'}
                </div>
              </div>
              <button
                onClick={handleToggleRegistration}
                className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  eventSettings.registration_enabled
                    ? 'bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/30'
                    : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle Registration"
              >
                {eventSettings.registration_enabled ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>

            {/* Bingo Game Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Bingo Gameplay</div>
                <div className="text-xs text-[#0B3B3D]/70 mt-0.5">
                  {eventSettings.bingo_enabled ? 'Active' : 'Locked'}
                </div>
              </div>
              <button
                onClick={handleToggleBingo}
                className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  eventSettings.bingo_enabled
                    ? 'bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/30'
                    : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle Bingo"
              >
                {eventSettings.bingo_enabled ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PARTICIPANT DETAILED NETWORKING TRAIL              */}
      {/* ========================================================= */}
      {selectedParticipantRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#A3C4CB]/40 overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="p-4 px-5 border-b border-[#A3C4CB]/30 flex items-center justify-between bg-[#F4F8F9] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E05A47] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                  {selectedParticipantRow.participant.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#0B3B3D]">
                    {selectedParticipantRow.participant.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#0B3B3D]/70">
                    <span>+91 {selectedParticipantRow.participant.mobile_number}</span>
                    <span>•</span>
                    <span>{selectedParticipantRow.participant.instagram_id}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipantRow(null)}
                className="p-1.5 rounded-full text-[#0B3B3D]/60 hover:text-[#0B3B3D] hover:bg-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar inside Modal */}
            <div className="grid grid-cols-3 gap-2 p-3 px-5 bg-[#FDF8F6] border-b border-[#A3C4CB]/20 text-center shrink-0">
              <div>
                <span className="text-[10px] text-[#0B3B3D]/60 uppercase tracking-wider font-semibold">People Networked</span>
                <div className="text-lg font-bold text-[#D34E2A]">
                  {selectedParticipantRow.completedLettersCount} / 25
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#0B3B3D]/60 uppercase tracking-wider font-semibold">Lines Completed</span>
                <div className="text-lg font-bold text-[#0B3B3D]">
                  {selectedParticipantRow.completedLinesCount} Lines
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#0B3B3D]/60 uppercase tracking-wider font-semibold">Questionnaire</span>
                <div className="text-lg font-bold text-emerald-700">
                  {selectedParticipantRow.participant.questionnaire_completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Modal Body: List of All People Networked with Selfies */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0B3B3D] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#E05A47]" />
                  <span>Network Trail & Captured Selfies ({selectedParticipantRow.connections.length})</span>
                </h4>
              </div>

              {selectedParticipantRow.connections.length === 0 ? (
                <div className="p-8 text-center bg-[#F4F8F9] rounded-2xl border border-[#A3C4CB]/30 space-y-2">
                  <Camera className="w-8 h-8 text-[#A3C4CB] mx-auto" />
                  <p className="text-sm font-semibold text-[#0B3B3D]">No selfies taken yet</p>
                  <p className="text-xs text-[#0B3B3D]/60">This participant has not connected or taken selfies with anyone on their board yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedParticipantRow.connections.map((conn) => (
                    <div
                      key={conn.id}
                      className="p-3 rounded-2xl border border-[#A3C4CB]/40 bg-white hover:border-[#E05A47]/40 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#E05A47] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0">
                            {conn.bingo_letter}
                          </span>
                          <span className="font-semibold text-sm text-[#0B3B3D]">
                            {conn.person_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#0B3B3D]/50 font-mono">
                          {new Date(conn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Selfie Image Thumbnail */}
                      <div
                        onClick={() => setSelectedSelfiePreview(conn)}
                        className="relative rounded-xl overflow-hidden aspect-video bg-[#0B3B3D]/10 cursor-pointer group flex items-center justify-center border border-[#A3C4CB]/30"
                      >
                        {conn.selfie_url ? (
                          <img
                            src={conn.selfie_url}
                            alt={conn.person_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // If image fails, hide broken img and show fallback
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="fallback-placeholder w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B3B3D]/10 to-[#E05A47]/10 p-3 text-center"
                          style={{ display: conn.selfie_url ? 'none' : 'flex' }}
                        >
                          <Camera className="w-6 h-6 text-[#E05A47]/70 mb-1" />
                          <span className="text-[11px] font-semibold text-[#0B3B3D]/80">Selfie Captured</span>
                          <span className="text-[9px] text-[#0B3B3D]/50">with {conn.person_name}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                          <Eye className="w-4 h-4" />
                          <span>View Photo</span>
                        </div>
                      </div>

                      {/* Random Question & Answer */}
                      <div className="text-xs space-y-1 bg-[#FDF8F6] p-2.5 rounded-xl border border-[#F3BEB5]/40">
                        <p className="font-semibold text-[#0B3B3D] text-[11px] leading-tight">
                          Q: {conn.random_question}
                        </p>
                        <p className="italic text-[#D34E2A] text-xs font-medium">
                          "{conn.question_answer}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#A3C4CB]/30 bg-[#F4F8F9] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedParticipantRow(null)}
                className="py-2 px-5 rounded-xl bg-[#0B3B3D] text-white text-xs font-semibold hover:bg-[#072425] transition-colors cursor-pointer"
              >
                Close Trail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FULL SELFIE PHOTO PREVIEW                         */}
      {/* ========================================================= */}
      {selectedSelfiePreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-[#A3C4CB]/30 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E05A47] text-white flex items-center justify-center font-serif text-xs font-bold">
                  {selectedSelfiePreview.bingo_letter}
                </span>
                <span className="font-serif text-base font-semibold text-[#0B3B3D]">
                  {selectedSelfiePreview.person_name}
                </span>
              </div>
              <button
                onClick={() => setSelectedSelfiePreview(null)}
                className="text-[#0B3B3D]/60 hover:text-[#0B3B3D] p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-square border border-[#A3C4CB]/40 bg-[#0B3B3D]/10 flex items-center justify-center">
              {selectedSelfiePreview.selfie_url ? (
                <img
                  src={selectedSelfiePreview.selfie_url}
                  alt={selectedSelfiePreview.person_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).parentElement?.querySelector('.preview-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="preview-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B3B3D]/10 to-[#E05A47]/10 p-6 text-center"
                style={{ display: selectedSelfiePreview.selfie_url ? 'none' : 'flex' }}
              >
                <Camera className="w-12 h-12 text-[#E05A47]/70 mb-2" />
                <span className="text-sm font-semibold text-[#0B3B3D]">Selfie with {selectedSelfiePreview.person_name}</span>
                <span className="text-xs text-[#0B3B3D]/60 mt-1">Stored securely on participant device</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FDF8F6] border border-[#F3BEB5]/40 text-xs space-y-1">
              <p className="font-semibold text-[#0B3B3D] text-[11px]">Q: {selectedSelfiePreview.random_question}</p>
              <p className="italic text-[#D34E2A]">"{selectedSelfiePreview.question_answer}"</p>
            </div>

            <button
              onClick={() => setSelectedSelfiePreview(null)}
              className="w-full py-2.5 rounded-xl bg-[#0B3B3D] text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
