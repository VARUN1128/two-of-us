import React, { useState, useEffect } from 'react';
import { AppDataStore } from '../../lib/store';
import type { EventSettings, Participant } from '../../types';
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
  Phone
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
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    questionnaireCompleted: 0,
    activeBingoParticipants: 0,
    totalConnections: 0,
    completedBingoBoards: 0,
    avgConnectionsPerParticipant: 0,
  });
  const [participants, setParticipants] = useState<
    Array<{
      participant: Participant;
      completedLettersCount: number;
      completedLinesCount: number;
      isBoardComplete: boolean;
      lastActive: string;
    }>
  >([]);
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
      setAuthError('Invalid admin passcode. Please try again.');
    }
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
    if (!q) return true;
    return (
      row.participant.full_name.toLowerCase().includes(q) ||
      row.participant.mobile_number.includes(q) ||
      row.participant.instagram_id.toLowerCase().includes(q)
    );
  });

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full font-sans">
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
              Enter admin passcode to manage event and monitor live participants.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <input
                type="password"
                placeholder="Admin Passcode"
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
              className="w-full py-2.5 rounded-xl bg-[#E05A47] hover:bg-[#C44633] text-white text-xs font-semibold shadow-xs transition-all"
            >
              Sign In to Dashboard
            </button>
          </form>

          <button
            onClick={onBackToApp}
            className="text-xs text-[#0B3B3D]/60 hover:text-[#E05A47] transition-colors pt-2 block mx-auto"
          >
            ← Return to Event App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 font-sans space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#A3C4CB]/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="p-2 rounded-xl border border-[#A3C4CB]/40 hover:bg-[#F4F8F9] text-[#0B3B3D]"
            title="Back to App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-2xl font-semibold text-[#0B3B3D]"
                style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
              >
                Organizer Command Center
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FDF2F0] text-[#E05A47] text-[10px] font-bold uppercase tracking-wider">
                Live Admin
              </span>
            </div>
            <p className="text-xs text-[#0B3B3D]/70">
              Two of Us Event Live Monitoring & Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#A3C4CB]/50 text-xs font-medium text-[#0B3B3D] hover:bg-[#F4F8F9] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#E05A47]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Registrations</span>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.totalRegistrations}</div>
          <span className="text-[10px] text-[#E05A47]">Total Attendees</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Questionnaires</span>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.questionnaireCompleted}</div>
          <span className="text-[10px] text-[#E05A47]">Completed Q1-Q9</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Active Players</span>
          <div className="text-2xl font-bold text-[#E05A47]">{stats.activeBingoParticipants}</div>
          <span className="text-[10px] text-[#0B3B3D]/60">&gt;0 letters met</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Connections</span>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.totalConnections}</div>
          <span className="text-[10px] text-[#E05A47]">Selfies & Q&As</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Full Boards</span>
          <div className="text-2xl font-bold text-[#E05A47]">{stats.completedBingoBoards}</div>
          <span className="text-[10px] text-[#0B3B3D]/60">25/25 Cleared</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-1">
          <span className="text-[11px] text-[#0B3B3D]/70 font-medium">Avg Connections</span>
          <div className="text-2xl font-bold text-[#0B3B3D]">{stats.avgConnectionsPerParticipant}</div>
          <span className="text-[10px] text-[#E05A47]">Per Attendee</span>
        </div>
      </div>

      {/* Event Controls */}
      {eventSettings && (
        <div className="p-4 rounded-2xl bg-white border border-[#A3C4CB]/40 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B3B3D]">
            <Sliders className="w-4 h-4 text-[#E05A47]" />
            <span>Live Event Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Event Status Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Event Status</div>
                <div className="text-[10px] text-[#E05A47] capitalize font-medium">
                  {eventSettings.event_status}
                </div>
              </div>
              <button
                onClick={handleToggleEventStatus}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                  eventSettings.event_status === 'active'
                    ? 'bg-[#E05A47] hover:bg-[#C44633]'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {eventSettings.event_status === 'active' ? 'Pause Event' : 'Resume Event'}
              </button>
            </div>

            {/* Registration Enabled Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Registration</div>
                <div className="text-[10px] text-[#0B3B3D]/70">
                  {eventSettings.registration_enabled ? 'Open to New Attendees' : 'Closed'}
                </div>
              </div>
              <button
                onClick={handleToggleRegistration}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  eventSettings.registration_enabled
                    ? 'bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/30'
                    : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle Registration"
              >
                {eventSettings.registration_enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>

            {/* Bingo Game Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
              <div>
                <div className="text-xs font-semibold text-[#0B3B3D]">Bingo Gameplay</div>
                <div className="text-[10px] text-[#0B3B3D]/70">
                  {eventSettings.bingo_enabled ? 'Active' : 'Locked'}
                </div>
              </div>
              <button
                onClick={handleToggleBingo}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  eventSettings.bingo_enabled
                    ? 'bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/30'
                    : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle Bingo"
              >
                {eventSettings.bingo_enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Management & Bingo Monitoring Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E05A47]" />
            <h3 className="font-serif text-lg font-medium text-[#0B3B3D]">
              Participant Directory & Bingo Monitoring
            </h3>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A3C4CB]" />
            <input
              type="text"
              placeholder="Search by name, mobile, instagram..."
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
                  <th className="py-3 px-4">Mobile (Admin Only)</th>
                  <th className="py-3 px-4">Instagram</th>
                  <th className="py-3 px-4 text-center">Questionnaire</th>
                  <th className="py-3 px-4 text-center">Letters Met</th>
                  <th className="py-3 px-4 text-center">Lines</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3C4CB]/20">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#0B3B3D]/60">
                      {searchQuery ? 'No participants match your search.' : 'No registered participants yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map(({ participant, completedLettersCount, completedLinesCount, isBoardComplete }) => (
                    <tr key={participant.id} className="hover:bg-[#F4F8F9]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B3B3D]">{participant.full_name}</div>
                        <div className="text-[10px] text-[#0B3B3D]/50">
                          Joined {new Date(participant.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#E05A47]">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#A3C4CB]" />
                          <span>+91 {participant.mobile_number}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[#0B3B3D]/80">
                          <svg className="w-3.5 h-3.5 text-[#E05A47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                          </svg>
                          <span>{participant.instagram_id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {participant.questionnaire_completed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDF2F0] text-[#E05A47] font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-[#0B3B3D]">
                          {completedLettersCount}
                        </span>
                        <span className="text-[#0B3B3D]/50"> / 25</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#F4F8F9] text-[#E05A47] font-bold text-[11px] border border-[#A3C4CB]/30">
                          {completedLinesCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isBoardComplete ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#E05A47] text-white font-bold text-[10px] shadow-2xs">
                            Full Board!
                          </span>
                        ) : completedLettersCount > 0 ? (
                          <span className="text-[#E05A47] font-medium text-[11px]">
                            In Progress
                          </span>
                        ) : (
                          <span className="text-[#A3C4CB] text-[11px]">
                            Not Started
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
