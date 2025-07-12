import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Activity } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserStats {
  currentPlan: string;
  docsSummarized: number;
  symptomsAnalyzed: number;
  simulationsCompleted: number;
  planFeatures: {
    maxSimulations: number;
    maxSummaries: number;
    maxSymptoms: number;
  }
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get user profile to check plan status
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get summaries count
      const { count: summariesCount } = await supabase
        .from('summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get symptoms analyzed count
      const { count: symptomsCount } = await supabase
        .from('symptom_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get case simulations count
      const { count: simulationsCount } = await supabase
        .from('case_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const isPremium = profile?.is_premium || false;
      
      setUserStats({
        currentPlan: isPremium ? "Clinical Pro" : "Free",
        docsSummarized: summariesCount || 0,
        symptomsAnalyzed: symptomsCount || 0,
        simulationsCompleted: simulationsCount || 0,
        planFeatures: isPremium ? {
          maxSimulations: 1000,
          maxSummaries: 1000,
          maxSymptoms: 1000
        } : {
          maxSimulations: 50,
          maxSummaries: 100,
          maxSymptoms: 200
        }
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load user statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Delete all user data
      await Promise.all([
        supabase.from('summaries').delete().eq('user_id', user.id),
        supabase.from('symptom_entries').delete().eq('user_id', user.id),
        supabase.from('case_attempts').delete().eq('user_id', user.id),
        supabase.from('case_wise_stats').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id)
      ]);

      // Delete the user's auth account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      await signOut();
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center"
          style={{
            backgroundColor: "#5fcfb9",
            backgroundImage: "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)"
          }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen"
        style={{
          backgroundColor: "#5fcfb9",
          backgroundImage: "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)"
        }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="space-y-8">
            {/* Current Plan */}
            <LiquidCard className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
                  <div className="text-2xl font-bold text-white mb-2">
                    {userStats?.currentPlan}
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-white border-green-400/20 backdrop-blur-sm px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-sm text-white/70">Simulations</div>
                  <div className="text-lg font-semibold text-white">
                    {userStats?.simulationsCompleted} / {userStats?.planFeatures.maxSimulations}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-400/50 backdrop-blur-sm h-2 rounded-full" 
                      style={{ width: `${((userStats?.simulationsCompleted || 0) / (userStats?.planFeatures.maxSimulations || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-sm text-white/70">Documents Summarized</div>
                  <div className="text-lg font-semibold text-white">
                    {userStats?.docsSummarized} / {userStats?.planFeatures.maxSummaries}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-400/50 backdrop-blur-sm h-2 rounded-full" 
                      style={{ width: `${((userStats?.docsSummarized || 0) / (userStats?.planFeatures.maxSummaries || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-sm text-white/70">Symptoms Analyzed</div>
                  <div className="text-lg font-semibold text-white">
                    {userStats?.symptomsAnalyzed} / {userStats?.planFeatures.maxSymptoms}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-400/50 backdrop-blur-sm h-2 rounded-full" 
                      style={{ width: `${((userStats?.symptomsAnalyzed || 0) / (userStats?.planFeatures.maxSymptoms || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </LiquidCard>

            {/* Usage Statistics */}
            <LiquidCard className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">Usage Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <FileText className="w-8 h-8 text-blue-300" />
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats?.docsSummarized}</div>
                    <div className="text-sm text-white/70">Documents Summarized</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <Activity className="w-8 h-8 text-green-300" />
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats?.symptomsAnalyzed}</div>
                    <div className="text-sm text-white/70">Symptoms Analyzed</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <Brain className="w-8 h-8 text-purple-300" />
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats?.simulationsCompleted}</div>
                    <div className="text-sm text-white/70">Simulations Completed</div>
                  </div>
                </div>
              </div>
            </LiquidCard>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors backdrop-blur-sm border border-red-500/20">
                    Delete Account Forever
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500/20 text-red-300 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/20"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings; 
