import { useState, useEffect } from 'react';
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
  const [stage, setStage] = useState<AppStage>('welcome');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [board, setBoard] = useState<BingoBoard | null>(null);
  const [connections, setConnections] = useState<BingoConnection[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [eventPausedNotice, setEventPausedNotice] = useState(false);

  // Initialize and restore session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const [current, settings] = await Promise.all([
          AppDataStore.getCurrentParticipant(),
          AppDataStore.getEventSettings(),
        ]);

        if (settings?.event_status === 'paused') {
          setEventPausedNotice(true);
        }

        if (current && isMounted) {
          setParticipant(current);

          if (!current.questionnaire_completed) {
            setStage('questionnaire');
          } else {
            // Load their board and connections
            const [userBoard, userConnections] = await Promise.all([
              AppDataStore.getOrCreateBingoBoard(current.id),
              AppDataStore.getParticipantConnections(current.id),
            ]);

            setBoard(userBoard);
            setConnections(userConnections);

            if (userBoard.completed_letters && userBoard.completed_letters.length >= 25) {
              setStage('board_completed');
            } else {
              setStage('bingo');
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
    setStage('questionnaire');
  };

  // When a participant resumes with mobile
  const handleLoginSuccess = async (resumedParticipant: Participant) => {
    setParticipant(resumedParticipant);
    if (!resumedParticipant.questionnaire_completed) {
      setStage('questionnaire');
    } else {
      const [userBoard, userConnections] = await Promise.all([
        AppDataStore.getOrCreateBingoBoard(resumedParticipant.id),
        AppDataStore.getParticipantConnections(resumedParticipant.id),
      ]);
      setBoard(userBoard);
      setConnections(userConnections);
      if (userBoard.completed_letters && userBoard.completed_letters.length >= 25) {
        setStage('board_completed');
      } else {
        setStage('bingo');
      }
    }
  };

  // When 9 questionnaire questions are done
  const handleQuestionnaireFinished = async () => {
    if (participant) {
      const userBoard = await AppDataStore.getOrCreateBingoBoard(participant.id);
      setBoard(userBoard);
      setStage('questionnaire_complete');
    }
  };

  // When starting Bingo from questionnaire completion transition
  const handleStartBingo = () => {
    setStage('bingo');
  };

  // When board state updates (after completing a letter)
  const handleBoardUpdated = (updatedBoard: BingoBoard, updatedConnections: BingoConnection[]) => {
    setBoard(updatedBoard);
    setConnections(updatedConnections);
  };

  // Loading Screen
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-[#088F87] border-t-transparent rounded-full animate-spin mb-4" />
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
        onNavigate={(targetStage) => setStage(targetStage)}
        onOpenAdmin={() => setStage(stage === 'admin' ? (participant ? (participant.questionnaire_completed ? 'bingo' : 'questionnaire') : 'welcome') : 'admin')}
      />

      {/* Event Paused Alert if organizer set status to paused */}
      {eventPausedNotice && stage !== 'admin' && (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-1.5 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>The live event game is currently paused by the organizers. Gameplay will resume shortly.</span>
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1 flex flex-col justify-start w-full">
        {stage === 'welcome' && (
          <WelcomePage
            onStartRegistration={() => setStage('registration')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {stage === 'registration' && (
          <RegistrationPage
            onBack={() => setStage('welcome')}
            onRegistered={handleRegistered}
          />
        )}

        {stage === 'questionnaire' && participant && (
          <QuestionnairePage
            participant={participant}
            onComplete={handleQuestionnaireFinished}
          />
        )}

        {stage === 'questionnaire_complete' && (
          <QuestionnaireCompletion onStartBingo={handleStartBingo} />
        )}

        {stage === 'bingo' && participant && board && (
          <HumanBingoPage
            participant={participant}
            board={board}
            connections={connections}
            onBoardUpdated={handleBoardUpdated}
            onViewConnections={() => setStage('connections')}
            onFullBoardCompleted={() => setStage('board_completed')}
          />
        )}

        {stage === 'connections' && participant && (
          <MyConnectionsPage
            participant={participant}
            connections={connections}
            onBackToBingo={() => setStage('bingo')}
          />
        )}

        {stage === 'board_completed' && board && (
          <CompletionPage
            board={board}
            onViewConnections={() => setStage('connections')}
          />
        )}

        {stage === 'admin' && (
          <AdminDashboard
            onBackToApp={() => {
              if (participant) {
                setStage(participant.questionnaire_completed ? 'bingo' : 'questionnaire');
              } else {
                setStage('welcome');
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
