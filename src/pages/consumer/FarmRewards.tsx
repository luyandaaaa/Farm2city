import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import { ConsumerLayout } from '@/components/layouts/ConsumerLayout';

// Inline styles for FarmRewards page
const styles: { [key: string]: CSSProperties } = {
  root: {
    backgroundColor: '#F1F8E9',
    color: '#1B5E20',
    lineHeight: 1.6,
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    minHeight: '100vh',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 20,
  },
  header: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: 16,
    marginBottom: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  h1: {
    fontSize: 28,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
  },
  h3: {
    fontSize: 22,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    color: '#1B5E20',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 24,
  },
  statItem: { textAlign: 'center' },
  statValue: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 14, opacity: 0.9 },
  section: {
    background: '#FFFFFF',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    border: '1px solid #C8E6C9',
    padding: 24,
    marginBottom: 24,
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24,
    alignItems: 'stretch',
  },
  gameCard: {
    background: 'linear-gradient(135deg, #fff 0%, #F1F8E9 100%)',
    borderRadius: 16,
    border: '2px solid #C8E6C9',
    padding: 24,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    minHeight: 240,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  gameCardCompleted: {
    opacity: 0.7,
    filter: 'saturate(0.8)',
    cursor: 'not-allowed',
  },
  gameIcon: { fontSize: 32, marginBottom: 8, textAlign: 'center' },
  gameTitle: { fontWeight: 600, color: '#1B5E20', marginBottom: 8, textAlign: 'center' },
  gameDesc: { fontSize: 14, color: '#2E7D32', marginBottom: 16, textAlign: 'center' },
  gameMeta: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 },
  gameMetaLabel: { color: '#2E7D32' },
  gameMetaValue: { fontWeight: 500 },
  difficultyEasy: { color: '#4CAF50' },
  difficultyMedium: { color: '#FFC107' },
  difficultyHard: { color: '#F44336' },
  gameButton: {
    width: '100%',
    background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
    color: 'white',
    padding: '12px 0',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    marginTop: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  gameButtonHover: {
    background: 'linear-gradient(90deg, #388E3C 0%, #4CAF50 100%)',
  },
  gameButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, zIndex: 2,
  },
  completedBadge: {
    background: '#4CAF50', color: 'white', padding: '4px 12px', borderRadius: 20, fontWeight: 600,
  },
  // ...more styles for badges, leaderboard, modal, etc. would be added here...
};

// Data Types
type Game = {
  id: string;
  icon: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  xpReward: number;
  discount: string;
};

type Question = {
  question: string;
  options: string[];
  answer: number;
  xp: number;
};

type ChallengeQuestions = {
  [key: string]: Question[];
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

type UserData = {
  totalXP: number;
  gamesPlayed: number;
  completedGames: string[];
  unlockedBadges: Badge[];
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  gamesPlayed?: number;
  isCurrentUser?: boolean;
};

type GameState = {
  timeLeft: number;
  currentQuestion: number;
  score: number;
  gameState: 'playing' | 'completed' | 'paused';
};

// Game Data
const farmingGames: Game[] = [
  { id: 'crop-quiz', icon: '🌽', title: 'Crop Knowledge Quiz', description: 'Test your knowledge about crops, seasons, and farming techniques.', difficulty: 'Easy', timeLimit: 60, xpReward: 100, discount: '5% off on seeds' },
  { id: 'soil-match', icon: '🪴', title: 'Soil Matching', description: 'Match crops with their ideal soil types and conditions.', difficulty: 'Medium', timeLimit: 90, xpReward: 150, discount: '10% off on fertilizers' },
  { id: 'pest-detective', icon: '🐛', title: 'Pest Detective', description: 'Identify pests and diseases affecting crops and their solutions.', difficulty: 'Hard', timeLimit: 120, xpReward: 200, discount: '15% off on pesticides' },
  { id: 'seasonal-challenge', icon: '🌦️', title: 'Seasonal Challenge', description: 'Learn what to plant and when for maximum yield.', difficulty: 'Easy', timeLimit: 80, xpReward: 120, discount: '7% off seasonal crops' },
  { id: 'organic-puzzle', icon: '🥬', title: 'Organic Farming Puzzle', description: 'Build sustainable farming practices and organic solutions.', difficulty: 'Medium', timeLimit: 100, xpReward: 180, discount: '12% off organic products' },
  { id: 'market-sim', icon: '💰', title: 'Market Simulator', description: 'Practice selling your produce at the best prices and timing.', difficulty: 'Hard', timeLimit: 150, xpReward: 250, discount: '20% off on storage' }
];

const challengeQuestions: ChallengeQuestions = {
  "crop-quiz": [
    { question: "What is the best season for planting maize?", options: ["Winter", "Spring", "Summer", "Autumn"], answer: 2, xp: 25 },
    { question: "Which crop is known as 'the king of crops'?", options: ["Wheat", "Rice", "Corn", "Barley"], answer: 1, xp: 30 },
    { question: "What is the ideal pH range for most crops?", options: ["2.0-4.0", "4.5-5.5", "6.0-7.0", "8.0-9.0"], answer: 2, xp: 35 }
  ],
  "soil-match": [
    { question: "Which crop grows best in sandy soil?", options: ["Rice", "Carrots", "Wheat", "Potatoes"], answer: 1, xp: 40 },
    { question: "What type of soil is best for rice cultivation?", options: ["Clay soil", "Loamy soil", "Sandy soil", "Chalky soil"], answer: 0, xp: 45 }
  ],
  "pest-detective": [
    { question: "What pest causes yellowing and curling of tomato leaves?", options: ["Aphids", "Whiteflies", "Cutworms", "Hornworms"], answer: 1, xp: 50 },
    { question: "Which disease causes black spots on rose leaves?", options: ["Powdery mildew", "Black spot", "Rust", "Blight"], answer: 1, xp: 55 },
    { question: "What is the organic solution for aphids?", options: ["Neem oil", "Vinegar", "Baking soda", "Salt water"], answer: 0, xp: 50 }
  ],
  "seasonal-challenge": [
    { question: "Which vegetable is best planted in early spring?", options: ["Tomatoes", "Peppers", "Lettuce", "Eggplant"], answer: 2, xp: 30 },
    { question: "What is a good winter cover crop?", options: ["Clover", "Corn", "Soybeans", "Sunflowers"], answer: 0, xp: 35 }
  ],
  "organic-puzzle": [
    { question: "What is the main benefit of crop rotation?", options: ["Prevents soil depletion", "Reduces water usage", "Increases sunlight", "Speeds up growth"], answer: 0, xp: 40 },
    { question: "Which is a natural fertilizer?", options: ["Compost", "Ammonium nitrate", "Superphosphate", "Potassium chloride"], answer: 0, xp: 45 }
  ],
  "market-sim": [
    { question: "When is the best time to sell tomatoes for highest price?", options: ["Early season", "Mid season", "Late season", "Off season"], answer: 3, xp: 60 },
    { question: "What factor doesn't affect crop prices?", options: ["Weather", "Demand", "Soil type", "Transport costs"], answer: 2, xp: 55 }
  ]
};

const initialUserData: UserData = {
  totalXP: 0,
  gamesPlayed: 0,
  completedGames: [],
  unlockedBadges: [
    { id: 'starter', name: 'Starter Farmer', description: 'Complete your first quiz', icon: '🌱', unlocked: false },
    { id: 'regular', name: 'Regular Farmer', description: 'Complete 3 quizzes', icon: '👨‍🌾', unlocked: false },
    { id: 'expert', name: 'Expert Farmer', description: 'Complete all easy quizzes', icon: '🧑‍🌾', unlocked: false },
    { id: 'master', name: 'Master Farmer', description: 'Earn 3000 Farm Points', icon: '🏆', unlocked: false }
  ]
};

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Thabo M.', xp: 3250, avatar: '🏆', gamesPlayed: 12 },
  { rank: 2, name: 'Nomsa K.', xp: 2890, avatar: '🥈', gamesPlayed: 10 },
  { rank: 3, name: 'You', xp: 2850, avatar: '🥉', isCurrentUser: true, gamesPlayed: 8 },
  { rank: 4, name: 'Mandla S.', xp: 2420, avatar: '👤', gamesPlayed: 9 },
  { rank: 5, name: 'Zanele P.', xp: 2180, avatar: '👤', gamesPlayed: 7 }
];

const FarmRewards: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('farmRewardsData');
    return saved ? JSON.parse(saved) : initialUserData;
  });
  const [showGameModal, setShowGameModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>({ timeLeft: 0, currentQuestion: 0, score: 0, gameState: 'playing' });
  const [earnedXP, setEarnedXP] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('farmRewardsData', JSON.stringify(userData));
  }, [userData]);

  // Timer effect
  useEffect(() => {
    if (showGameModal && gameState.gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerRef.current!);
            endGame();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line
  }, [showGameModal, gameState.gameState]);

  // Start a game
  const startGame = (gameId: string) => {
    const game = farmingGames.find(g => g.id === gameId);
    if (!game) return;
    setCurrentGame(game);
    setGameState({ timeLeft: game.timeLimit, currentQuestion: 0, score: 0, gameState: 'playing' });
    setShowGameModal(true);
  };

  // Render current question
  const renderQuestion = () => {
    if (!currentGame) return null;
    const questions = challengeQuestions[currentGame.id] || [];
    const question = questions[gameState.currentQuestion];
    if (!question) return null;
    return (
      <div>
        <div className="mb-2 font-semibold">Question {gameState.currentQuestion + 1}/{questions.length}</div>
        <div className="mb-2 text-lg font-bold">{question.question}</div>
        <div className="mb-2">XP: {question.xp}</div>
        <div className="flex flex-col gap-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className="option px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-left"
              onClick={() => handleAnswer(idx)}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Handle answer selection
  const handleAnswer = (selectedIndex: number) => {
    if (!currentGame) return;
    const questions = challengeQuestions[currentGame.id] || [];
    const question = questions[gameState.currentQuestion];
    const isCorrect = selectedIndex === question.answer;
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + question.xp : prev.score,
      currentQuestion: prev.currentQuestion + 1
    }));
    // If last question, end game after short delay
    if (gameState.currentQuestion + 1 >= questions.length) {
      setTimeout(endGame, 400);
    }
  };

  // End the game
  const endGame = () => {
    if (!currentGame) return;
    clearInterval(timerRef.current!);
    let updatedUser = { ...userData };
    updatedUser.totalXP += gameState.score;
    updatedUser.gamesPlayed++;
    if (!updatedUser.completedGames.includes(currentGame.id)) {
      updatedUser.completedGames.push(currentGame.id);
    }
    // Badge unlocks
    if (updatedUser.gamesPlayed >= 1 && !updatedUser.unlockedBadges[0].unlocked) updatedUser.unlockedBadges[0].unlocked = true;
    if (updatedUser.gamesPlayed >= 3 && !updatedUser.unlockedBadges[1].unlocked) updatedUser.unlockedBadges[1].unlocked = true;
    if (updatedUser.completedGames.length >= 2 && !updatedUser.unlockedBadges[2].unlocked) updatedUser.unlockedBadges[2].unlocked = true;
    if (updatedUser.totalXP >= 3000 && !updatedUser.unlockedBadges[3].unlocked) updatedUser.unlockedBadges[3].unlocked = true;
    setUserData(updatedUser);
    setEarnedXP(gameState.score);
    setShowGameModal(false);
    setShowCompletionModal(true);
  };

  // Pause/Resume
  const togglePause = () => {
    setGameState(prev => {
      if (prev.gameState === 'playing') {
        clearInterval(timerRef.current!);
        return { ...prev, gameState: 'paused' };
      } else {
        timerRef.current = setInterval(() => {
          setGameState(prev2 => {
            if (prev2.timeLeft <= 1) {
              clearInterval(timerRef.current!);
              endGame();
              return { ...prev2, timeLeft: 0 };
            }
            return { ...prev2, timeLeft: prev2.timeLeft - 1 };
          });
        }, 1000);
        return { ...prev, gameState: 'playing' };
      }
    });
  };

  // UI
  return (
    <ConsumerLayout currentPage="FarmRewards">
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.h1}>FarmRewards - Earn Discounts & Offers</h1>
          <p>Play quizzes to earn discounts on farm products and special offers!</p>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue} id="total-xp">{userData.totalXP}</div>
              <div style={styles.statLabel}>Total Farm Points</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue} id="badges-count">{userData.unlockedBadges.filter(b => b.unlocked).length}</div>
              <div style={styles.statLabel}>Badges Earned</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue} id="games-played">{userData.gamesPlayed}</div>
              <div style={styles.statLabel}>Quizzes Played</div>
            </div>
          </div>
        </header>

        <section style={styles.section}>
          <h3 style={styles.h3}><i>🧑‍🌾</i> Farming Quizzes</h3>
          <div style={styles.gamesGrid} id="games-container">
            {farmingGames.map(game => {
              const isCompleted = userData.completedGames.includes(game.id);
              return (
                <div
                  key={game.id}
                  style={{
                    ...styles.gameCard,
                    ...(isCompleted ? styles.gameCardCompleted : {})
                  }}
                  onClick={() => !isCompleted && startGame(game.id)}
                >
                  <div>
                    <div style={styles.gameIcon}>{game.icon}</div>
                    <h4 style={styles.gameTitle}>{game.title}</h4>
                    <p style={styles.gameDesc}>{game.description}</p>
                    <div style={styles.gameMeta}>
                      <span style={styles.gameMetaLabel}>Difficulty:</span>
                      <span style={{
                        ...styles.gameMetaValue,
                        ...(game.difficulty === 'Easy' ? styles.difficultyEasy : game.difficulty === 'Medium' ? styles.difficultyMedium : styles.difficultyHard)
                      }}>{game.difficulty}</span>
                    </div>
                    <div style={styles.gameMeta}>
                      <span style={styles.gameMetaLabel}>Time Limit:</span>
                      <span style={styles.gameMetaValue}>{Math.floor(game.timeLimit / 60)}m {game.timeLimit % 60}s</span>
                    </div>
                    <div style={styles.gameMeta}>
                      <span style={styles.gameMetaLabel}>Farm Points:</span>
                      <span style={styles.gameMetaValue}>{game.xpReward} FP</span>
                    </div>
                  </div>
                  <button
                    style={{
                      ...styles.gameButton,
                      ...(isCompleted ? styles.gameButtonDisabled : {})
                    }}
                    disabled={isCompleted}
                  >
                    Play Now
                  </button>
                  {isCompleted && (
                    <div style={styles.completedOverlay}>
                      <span style={styles.completedBadge}>Completed</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}><i>🏆</i> Your Badges</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }} id="badges-container">
            {userData.unlockedBadges.map(badge => (
              <div
                key={badge.id}
                style={{
                  textAlign: 'center',
                  padding: 16,
                  borderRadius: 16,
                  border: '2px solid #C8E6C9',
                  background: badge.unlocked ? 'linear-gradient(135deg, #fef9c3 0%, #fdba74 100%)' : '#f9fafb',
                  boxShadow: badge.unlocked ? '0 2px 8px 0 rgba(251, 191, 36, 0.08)' : 'none',
                  opacity: badge.unlocked ? 1 : 0.6,
                  borderColor: badge.unlocked ? '#C8E6C9' : '#e5e7eb',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{badge.unlocked ? badge.icon : '🔒'}</div>
                <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{badge.name}</h4>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 0 }}>{badge.description}</p>
                <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500, color: badge.unlocked ? '#4CAF50' : '#9ca3af' }}>{badge.unlocked ? 'Unlocked' : 'Locked'}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}><i>📊</i> Community Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} id="leaderboard-container">
            {leaderboard.map(entry => (
              <div
                key={entry.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderRadius: 12,
                  border: '2px solid ' + (entry.isCurrentUser ? '#bfdbfe' : '#e5e7eb'),
                  background: entry.isCurrentUser ? '#dbeafe' : '#f9fafb',
                  boxShadow: entry.isCurrentUser ? '0 2px 8px 0 rgba(59, 130, 246, 0.08)' : undefined,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    background:
                      entry.rank === 1
                        ? '#fef9c3'
                        : entry.rank === 2
                        ? '#f3f4f6'
                        : entry.rank === 3
                        ? '#fed7aa'
                        : '#dbeafe',
                    color:
                      entry.rank === 1
                        ? '#b45309'
                        : entry.rank === 2
                        ? '#64748b'
                        : entry.rank === 3
                        ? '#b45309'
                        : '#1e40af',
                  }}>
                    {entry.rank <= 3 ? entry.avatar : entry.rank}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{entry.name}</div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>{entry.xp} FP</div>
                    {entry.isCurrentUser && <div style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>Quizzes Played: {userData.gamesPlayed}</div>}
                  </div>
                </div>
                {entry.isCurrentUser && <div style={{ fontSize: 12, background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 8, fontWeight: 500 }}>You</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Game Modal */}
        {showGameModal && currentGame && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
          }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }} id="modal-game-title">{currentGame.title}</div>
                  <div style={styles.gameMeta}>
                    <span id="question-count">Question {gameState.currentQuestion + 1}/{(challengeQuestions[currentGame.id] || []).length}</span>
                    <span id="game-score">Score: {gameState.score} FP</span>
                    <span id="game-time">{Math.floor(gameState.timeLeft/60)}:{(gameState.timeLeft%60).toString().padStart(2,'0')}</span>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#64748b' }} onClick={() => setShowGameModal(false)}>&times;</button>
              </div>
              <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#4CAF50', borderRadius: 4, transition: 'width 0.3s', width: `${((gameState.currentQuestion+1)/((challengeQuestions[currentGame.id]||[]).length||1))*100}%` }}></div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }} id="question-text">{(challengeQuestions[currentGame.id] || [])[gameState.currentQuestion]?.question}</div>
                <div id="options-container">
                  {(() => {
                    const questions = challengeQuestions[currentGame.id] || [];
                    const question = questions[gameState.currentQuestion];
                    if (!question) return null;
                    return question.options.map((option, idx) => (
                      <button
                        key={idx}
                        style={{
                          width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 8, border: '2px solid #e5e7eb', background: 'white', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s', fontWeight: 400
                        }}
                        onClick={() => handleAnswer(idx)}
                      >
                        <span style={{ fontWeight: 600, marginRight: 8 }}>{String.fromCharCode(65 + idx)}.</span> {option}
                      </button>
                    ));
                  })()}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <button style={{ padding: '8px 16px', borderRadius: 8, background: '#E8F5E9', color: '#388E3C', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={togglePause}>{gameState.gameState === 'playing' ? 'Pause' : 'Resume'}</button>
                <div style={{ fontSize: 14, color: '#2E7D32' }}>FP for this question: <span id="question-xp">{(challengeQuestions[currentGame.id] || [])[gameState.currentQuestion]?.xp || 0}</span></div>
              </div>
            </div>
          </div>
        )}
        {/* Completion Modal */}
        {showCompletionModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
          }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16, color: '#4CAF50' }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Quiz Complete!</h3>
              <p style={{ fontSize: 16, marginBottom: 24, color: '#64748b' }}>You earned <span id="earned-xp">{earnedXP}</span> Farm Points!</p>
              <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                <div style={{ fontWeight: 600, color: '#FF8F00', marginBottom: 8 }}>Rewards Earned:</div>
                <div style={{ fontSize: 14, color: '#5D4037', marginBottom: 4 }}>• <span id="earned-xp-2">{earnedXP}</span> Farm Points</div>
                <div style={{ fontSize: 14, color: '#5D4037', marginBottom: 4 }}>• 5% Discount on your next purchase</div>
                <div style={{ fontSize: 14, color: '#5D4037', marginBottom: 4 }}>• Progress towards badges</div>
                <div style={{ fontSize: 14, color: '#5D4037', marginBottom: 4 }}>• Leaderboard points</div>
              </div>
              <button style={{ width: '100%', background: '#4CAF50', color: 'white', padding: 12, borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setShowCompletionModal(false)} id="collect-btn">Collect Rewards</button>
            </div>
          </div>
        )}
      </div>
    </ConsumerLayout>
  );
};

export default FarmRewards;