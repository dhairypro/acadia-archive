import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  badges: string[];
  profiles: {
    full_name: string;
  };
}

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchLeaderboard();
    }
  }, [user, loading, navigate]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('total_points', { ascending: false })
        .limit(50);

      if (error) throw error;

      setLeaderboard(data || []);
      
      // Find user's rank
      const rank = data?.findIndex(entry => entry.user_id === user?.id);
      setUserRank(rank !== undefined && rank !== -1 ? rank + 1 : null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-orange-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Top performers in Graph Educations</p>
        </div>

        {/* User's Rank Card */}
        {userRank && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Your Rank</p>
                  <p className="text-3xl font-bold">#{userRank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total Points</p>
                <p className="text-3xl font-bold">
                  {leaderboard.find(e => e.user_id === user?.id)?.total_points || 0}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard List */}
        <div className="space-y-4">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.user_id === user?.id;

            return (
              <Card
                key={entry.user_id}
                className={`p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800 ${
                  isCurrentUser ? 'ring-2 ring-purple-500' : ''
                } hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className={`h-14 w-14 bg-gradient-to-br ${getRankColor(rank)}`}>
                    <AvatarFallback className="text-white font-bold text-lg">
                      {entry.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {entry.profiles?.full_name || 'Unknown User'}
                      </h3>
                      {isCurrentUser && (
                        <Badge variant="secondary">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Level {entry.level}
                      </span>
                      {entry.badges && entry.badges.length > 0 && (
                        <span>{entry.badges.length} badges</span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {entry.total_points}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">points</p>
                  </div>
                </div>
              </Card>
            );
          })}

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No leaderboard data yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
