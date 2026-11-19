import { useState, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation, 
  useSearchParams 
} from 'react-router-dom';
import type { AppStage, BingoBoard, BingoConnection, Participant } from './types';
import { AppDataStore } from './lib/store';
import { Header } from './components/common/Header';
import { WelcomePage } from './components/screens/WelcomePage';
import { RegistrationPage } from './components/screens/RegistrationPage';
import { QuestionnairePage } from './components/screens/QuestionnairePage';
import { QuestionnaireCompletion } from './components/screens/QuestionnaireCompletion';
import { HumanBingoPage } from './components/screens/HumanBingoPage';
import { MyConnectionsPage } from './components/screens/MyConnectionsPage';
import { CompletionPage } from './components/screens/CompletionPage';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [board, setBoard] = useState<BingoBoard | null>(null);
  const [connections, setConnections] = useState<BingoConnection[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [eventPausedNotice, setEventPausedNotice] = useState(false);

  // Map current route to AppStage for Header
  const getStageFromPath = (path: string): AppStage => {
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/connections')) return 'connections';
    if (path.startsWith('/completed')) return 'board_completed';
    if (path.startsWith('/bingo')) return 'bingo';
    if (path.startsWith('/questionnaire/complete')) return 'questionnaire_complete';
    if (path.startsWith('/questionnaire')) return 'questionnaire';
    if (path.startsWith('/register')) return 'registration';
    return 'welcome';
  };

  const stage = getStageFromPath(location.pathname);

  // Initialize and restore session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // Handle reset query (?reset=1)
        if (searchParams.get('reset') === '1' || searchParams.get('reset') === 'true') {
          AppDataStore.clearSession();
          setParticipant(null);
          setBoard(null);
          setConnections([]);
          setIsLoadingSession(false);
          navigate('/welcome', { replace: true });
          return;
        }

        const [current, settings] = await Promise.all([
          AppDataStore.getCurrentParticipant(),
          AppDataStore.getEventSettings(),
        ]);

        if (settings?.event_status === 'paused') {
          setEventPausedNotice(true);
        }

        if (current && isMounted) {
          setParticipant(current);

          const [userBoard, userConnections] = await Promise.all([
            AppDataStore.getOrCreateBingoBoard(current.id),
            AppDataStore.getParticipantConnections(current.id),
          ]);

          setBoard(userBoard);
          setConnections(userConnections);

          // Route initial landing if on root "/"
          if (location.pathname === '/') {
            if (!current.questionnaire_completed) {
              navigate('/questionnaire', { replace: true });
            } else if (userBoard.completed_letters && userBoard.completed_letters.length >= 25) {
              navigate('/completed', { replace: true });
            } else {
              navigate('/bingo', { replace: true });
            }
          }
        }
      } catch (err) {
        console.warn('Session init error:', err);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // When a new participant registers
  const handleRegistered = (newParticipant: Participant) => {
    setParticipant(newParticipant);
    navigate('/questionnaire');
  };

  // When a participant resumes with mobile
  const handleLoginSuccess = async (resumedParticipant: Participant) => {
    setParticipant(resumedParticipant);
    const [userBoard, userConnections] = await Promise.all([
      AppDataStore.getOrCreateBingoBoard(resumedParticipant.id),
      AppDataStore.getParticipantConnections(resumedParticipant.id),
    ]);
    setBoard(userBoard);
    setConnections(userConnections);

    if (!resumedParticipant.questionnaire_completed) {
      navigate('/questionnaire');
    } else if (userBoard.completed_letters && userBoard.completed_letters.length >= 25) {
      navigate('/completed');
    } else {
      navigate('/bingo');
    }
  };

  // When 9 questionnaire questions are done
  const handleQuestionnaireFinished = async () => {
    if (participant) {
      const userBoard = await AppDataStore.getOrCreateBingoBoard(participant.id);
      setBoard(userBoard);
      navigate('/questionnaire/complete');
    }
  };

  // When starting Bingo from questionnaire completion transition
  const handleStartBingo = () => {
    navigate('/bingo');
  };

  // When board state updates (after completing a letter)
  const handleBoardUpdated = (updatedBoard: BingoBoard, updatedConnections: BingoConnection[]) => {
    setBoard(updatedBoard);
    setConnections(updatedConnections);
  };

  // Navigation from Header
  const handleHeaderNavigate = (targetStage: AppStage) => {
    switch (targetStage) {
      case 'welcome':
        navigate('/welcome');
        break;
      case 'registration':
        navigate('/register');
        break;
      case 'questionnaire':
        navigate('/questionnaire');
        break;
      case 'questionnaire_complete':
        navigate('/questionnaire/complete');
        break;
      case 'bingo':
        navigate('/bingo');
        break;
      case 'connections':
        navigate('/connections');
        break;
      case 'board_completed':
        navigate('/completed');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/welcome');
    }
  };

  // Sign out / exit
  const handleSignOut = () => {
    AppDataStore.clearSession();
    setParticipant(null);
    setBoard(null);
    setConnections([]);
    navigate('/welcome');
  };

  // Loading Screen
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-[#E05A47] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 
          className="text-2xl font-medium text-[#0B3B3D]"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Two of Us
        </h2>
        <p className="text-xs text-[#0B3B3D]/70 font-sans mt-1">
          Loading live event experience...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0B3B3D] antialiased selection:bg-[#A3C4CB]/30 selection:text-[#0B3B3D]">
      {/* Navigation Header */}
      <Header
        stage={stage}
        participant={participant}
        connectionsCount={connections.length}
        onNavigate={handleHeaderNavigate}
        onOpenAdmin={() => navigate(stage === 'admin' ? (participant ? '/bingo' : '/welcome') : '/admin')}
        onSignOut={handleSignOut}
      />

      {/* Event Paused Alert if organizer set status to paused */}
      {eventPausedNotice && stage !== 'admin' && (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-1.5 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>The live event game is currently paused by the organizers. Gameplay will resume shortly.</span>
        </div>
      )}

      {/* Main Content with URL Routes */}
      <main className="flex-1 flex flex-col justify-start w-full">
        <Routes>
          {/* Welcome Screen */}
          <Route
            path="/"
            element={
              participant ? (
                participant.questionnaire_completed ? (
                  <Navigate to="/bingo" replace />
                ) : (
                  <Navigate to="/questionnaire" replace />
                )
              ) : (
                <WelcomePage
                  onStartRegistration={() => navigate('/register')}
                  onLoginSuccess={handleLoginSuccess}
                />
              )
            }
          />
          <Route
            path="/welcome"
            element={
              <WelcomePage
                onStartRegistration={() => navigate('/register')}
                onLoginSuccess={handleLoginSuccess}
              />
            }
          />

          {/* Registration Screen */}
          <Route
            path="/register"
            element={
              <RegistrationPage
                onBack={() => navigate('/welcome')}
                onRegistered={handleRegistered}
              />
            }
          />

          {/* Personality Questionnaire */}
          <Route
            path="/questionnaire"
            element={
              participant ? (
                <QuestionnairePage
                  participant={participant}
                  onComplete={handleQuestionnaireFinished}
                />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />

          {/* Questionnaire Transition Screen */}
          <Route
            path="/questionnaire/complete"
            element={<QuestionnaireCompletion onStartBingo={handleStartBingo} />}
          />

          {/* Human Bingo Board */}
          <Route
            path="/bingo"
            element={
              participant && board ? (
                <HumanBingoPage
                  participant={participant}
                  board={board}
                  connections={connections}
                  onBoardUpdated={handleBoardUpdated}
                  onViewConnections={() => navigate('/connections')}
                  onFullBoardCompleted={() => navigate('/completed')}
                />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />

          {/* My Connections Screen */}
          <Route
            path="/connections"
            element={
              participant ? (
                <MyConnectionsPage
                  participant={participant}
                  connections={connections}
                  onBackToBingo={() => navigate('/bingo')}
                />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />

          {/* Completion Celebration */}
          <Route
            path="/completed"
            element={
              board ? (
                <CompletionPage
                  board={board}
                  onViewConnections={() => navigate('/connections')}
                />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />

          {/* Organizer Command Center / Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminDashboard
                onBackToApp={() => {
                  if (participant) {
                    navigate(participant.questionnaire_completed ? '/bingo' : '/questionnaire');
                  } else {
                    navigate('/welcome');
                  }
                }}
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
