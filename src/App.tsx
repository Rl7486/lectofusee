import { useGameStore } from './stores/gameStore';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { ParentScreen } from './screens/ParentScreen';

function App() {
  const { currentScreen } = useGameStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'levelSelect':
        return <LevelSelectScreen />;
      case 'game':
        return <GameScreen />;
      case 'result':
        return <ResultScreen />;
      case 'parent':
        return <ParentScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderScreen()}
    </div>
  );
}

export default App;
