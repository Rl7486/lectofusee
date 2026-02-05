import { useState } from 'react';
import { motion } from 'framer-motion';
import { SpaceBackground } from '../components/game/SpaceBackground';
import { Button } from '../components/ui/Button';
import { useGameStore } from '../stores/gameStore';
import { useUserStore } from '../stores/userStore';
import { useStatsStore } from '../stores/statsStore';
import { formatSessionTime } from '../utils/scoreCalculator';

type Tab = 'stats' | 'words' | 'settings';

export function ParentScreen() {
  const { setScreen } = useGameStore();
  const { users, settings, updateSettings } = useUserStore();
  const { getUserStats, getTotalPracticeTime, getProblematicWords } = useStatsStore();

  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || '');

  const userStats = getUserStats(selectedUser);
  const practiceTime = getTotalPracticeTime(selectedUser);
  const problematicWords = getProblematicWords(selectedUser, 1, 10);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stats', label: 'Statistiques', icon: '📊' },
    { id: 'words', label: 'Mots', icon: '📝' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setScreen('home')}>
            ← Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">Mode Parent</h1>
          <div className="w-20" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sélecteur d'utilisateur */}
        {activeTab !== 'settings' && (
          <div className="flex gap-2 mb-6">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
                  ${selectedUser === user.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }
                `}
              >
                <span>{user.avatar}</span>
                {user.name}
              </button>
            ))}
          </div>
        )}

        {/* Contenu */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
        >
          {activeTab === 'stats' && (
            <StatsTab
              userStats={userStats}
              practiceTime={practiceTime}
              users={users}
              selectedUser={selectedUser}
            />
          )}
          {activeTab === 'words' && (
            <WordsTab
              userStats={userStats}
              problematicWords={problematicWords}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} updateSettings={updateSettings} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Onglet Statistiques
function StatsTab({
  userStats,
  practiceTime,
  users,
  selectedUser,
}: {
  userStats: any[];
  practiceTime: number;
  users: any[];
  selectedUser: string;
}) {
  const user = users.find((u) => u.id === selectedUser);
  const totalAttempts = userStats.reduce((sum, s) => sum + s.attempts, 0);
  const totalSuccesses = userStats.reduce((sum, s) => sum + s.successes, 0);
  const successRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        Statistiques de {user?.name}
      </h2>

      {/* Cartes de stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Niveau actuel"
          value={user?.currentLevel || 1}
          icon="📈"
        />
        <StatCard
          label="Étoiles totales"
          value={user?.totalStars || 0}
          icon="⭐"
        />
        <StatCard
          label="Mots pratiqués"
          value={userStats.length}
          icon="📚"
        />
        <StatCard
          label="Taux de réussite"
          value={`${successRate}%`}
          icon="🎯"
        />
      </div>

      {/* Temps de pratique */}
      <div className="bg-white/5 rounded-xl p-4">
        <p className="text-white/60 text-sm">Temps total de pratique</p>
        <p className="text-2xl font-bold text-white">
          {formatSessionTime(practiceTime)}
        </p>
      </div>

      {/* Top 5 meilleurs mots */}
      {userStats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Meilleurs mots (les plus rapides)
          </h3>
          <div className="space-y-2">
            {userStats
              .filter((s) => s.bestTime < Infinity)
              .sort((a, b) => a.bestTime - b.bestTime)
              .slice(0, 5)
              .map((stat, i) => (
                <div
                  key={stat.word}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/40">{i + 1}.</span>
                    <span className="text-white font-medium">{stat.word}</span>
                  </div>
                  <span className="text-green-400">
                    {(stat.bestTime / 1000).toFixed(1)}s
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant carte de stat
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-white/60 text-xs">{label}</p>
    </div>
  );
}

// Onglet Mots
function WordsTab({
  userStats,
  problematicWords,
}: {
  userStats: any[];
  problematicWords: string[];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Gestion des mots</h2>

      {/* Mots à travailler */}
      {problematicWords.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
            <span>⚠️</span>
            Mots à travailler
          </h3>
          <div className="flex flex-wrap gap-2">
            {problematicWords.map((word) => (
              <span
                key={word}
                className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Liste des mots pratiqués */}
      {userStats.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Historique ({userStats.length} mots)
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {userStats.map((stat) => {
              const rate = stat.attempts > 0
                ? Math.round((stat.successes / stat.attempts) * 100)
                : 0;
              return (
                <div
                  key={stat.word}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                >
                  <div>
                    <span className="text-white font-medium">{stat.word}</span>
                    <span className="text-white/40 text-xs ml-2">
                      Niveau {stat.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/60">
                      {stat.attempts} essais
                    </span>
                    <span
                      className={
                        rate >= 80
                          ? 'text-green-400'
                          : rate >= 50
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }
                    >
                      {rate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-white/60 text-center py-8">
          Aucun mot pratiqué pour le moment.
        </p>
      )}
    </div>
  );
}

// Onglet Paramètres
function SettingsTab({
  settings,
  updateSettings,
}: {
  settings: any;
  updateSettings: (s: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Paramètres</h2>

      {/* Durée de session */}
      <div className="space-y-2">
        <label className="text-white/80 text-sm">
          Durée de session (minutes)
        </label>
        <input
          type="range"
          min="5"
          max="20"
          value={settings.sessionDuration}
          onChange={(e) =>
            updateSettings({ sessionDuration: parseInt(e.target.value) })
          }
          className="w-full accent-purple-500"
        />
        <p className="text-white text-right">{settings.sessionDuration} min</p>
      </div>

      {/* Sons */}
      <div className="flex items-center justify-between">
        <span className="text-white/80">Sons activés</span>
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`
            w-14 h-8 rounded-full transition-colors relative
            ${settings.soundEnabled ? 'bg-purple-500' : 'bg-white/20'}
          `}
        >
          <span
            className={`
              absolute top-1 w-6 h-6 rounded-full bg-white transition-transform
              ${settings.soundEnabled ? 'left-7' : 'left-1'}
            `}
          />
        </button>
      </div>

      {/* Sensibilité vocale */}
      <div className="space-y-2">
        <label className="text-white/80 text-sm">
          Sensibilité de reconnaissance vocale
        </label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.1"
          value={settings.voiceSensitivity}
          onChange={(e) =>
            updateSettings({ voiceSensitivity: parseFloat(e.target.value) })
          }
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-white/60 text-xs">
          <span>Plus tolérant</span>
          <span>Plus strict</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white/5 rounded-xl p-4 text-white/60 text-sm">
        <p>💡 Code PIN parent : 1234</p>
        <p className="mt-2">
          Les données sont sauvegardées localement sur cet appareil.
        </p>
      </div>
    </div>
  );
}
