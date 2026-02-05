import { SpaceBackground } from '../components/game/SpaceBackground';
import { LevelSelector } from '../components/navigation/LevelSelector';
import { StarCount } from '../components/ui/StarRating';
import { useUserStore } from '../stores/userStore';

export function LevelSelectScreen() {
  const { getCurrentUser } = useUserStore();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen relative flex flex-col">
      <SpaceBackground />

      {/* Header avec avatar et étoiles */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{user?.avatar}</span>
          <span className="text-xl font-bold text-white">{user?.name}</span>
        </div>
        <StarCount count={user?.totalStars || 0} />
      </div>

      {/* Sélecteur de niveau */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <LevelSelector />
      </div>
    </div>
  );
}
