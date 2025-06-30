import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  id: number;
  name: string;
  coins: number;
  rank: number;
  avatar?: string;
}

const LeaderboardCard: React.FC<{ user: LeaderboardUser; isTop3: boolean }> = ({ user, isTop3 }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`flex items-center p-4 ${isTop3 ? 'bg-white dark:bg-gray-800 rounded-lg shadow-sm' : ''} transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(user.rank)}`}>
        {user.rank <= 3 ? <Trophy size={16} /> : user.rank}
      </div>
      <div className="flex-1 ml-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="ml-3 font-medium text-gray-900 dark:text-white">{user.name}</span>
        </div>
      </div>
      <div className="flex items-center">
        <Medal size={16} className="text-blue-500 mr-2" />
        <span className="font-semibold text-gray-900 dark:text-white">{user.coins}</span>
      </div>
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const users: LeaderboardUser[] = [
    { id: 1, name: '1', coins: 1250, rank: 1 },
    { id: 2, name: '2', coins: 1100, rank: 2 },
    { id: 3, name: '3', coins: 950, rank: 3 },
    { id: 4, name: '4', coins: 800, rank: 4 },
    { id: 5, name: '5', coins: 750, rank: 5 },
    { id: 6, name: '6', coins: 700, rank: 6 },
    { id: 7, name: '7', coins: 650, rank: 7 },
    { id: 8, name: '8', coins: 600, rank: 8 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">อันดับผู้นำ</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top 3</h3>
          <div className="space-y-3">
            {users.slice(0, 3).map(user => (
              <LeaderboardCard key={user.id} user={user} isTop3={true} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rankings</h3>
          <div className="space-y-2">
            {users.slice(3).map(user => (
              <LeaderboardCard key={user.id} user={user} isTop3={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;