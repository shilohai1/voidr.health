import { useSubscription } from '../hooks/useSubscription'
import { checkoutUrls } from '../utils/checkoutRedirect'
import { LiquidCard } from '@/components/ui/liquid-glass-card'
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User, Shield, Settings as SettingsIcon, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Settings = () => {
  const { 
    plan,
    notes_used,
    simulations_used,
    notes_remaining,
    simulations_remaining,
    is_unlimited_notes,
    is_unlimited_simulations,
    pdf_enabled
  } = useSubscription();
  const { user, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete your profile forever? This cannot be undone.')) return;
    setDeleting(true);
    try {
      // Delete user from Supabase auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      // Optionally, delete user data from other tables (if needed)
      // await supabase.from('profiles').delete().eq('id', user.id);
      if (authError) throw authError;
      alert('Your profile has been deleted.');
      await signOut();
      window.location.href = '/';
    } catch (err) {
      alert('Failed to delete profile. Please contact support.');
    } finally {
      setDeleting(false);
    }
  };

  const getPlanDisplayName = (plan: string) => {
    const names: Record<string, string> = {
      'free': 'Free Plan',
      'clinical_starter': 'Clinical Starter',
      'clinical_pro': 'Clinical Pro',
      'wise_starter': 'Wise Starter',
      'wise_pro': 'Wise Pro',
      'launch_bundle': 'Launch Bundle'
    }
    return names[plan] || plan
  }

  const getUpgradeLink = () => {
    switch (plan) {
      case 'free':
        return {
          clinicbot: checkoutUrls.clinical_starter,
          casewise: checkoutUrls.wise_starter
        }
      case 'clinical_starter':
        return {
          clinicbot: checkoutUrls.clinical_pro,
          casewise: checkoutUrls.wise_starter
        }
      case 'wise_starter':
        return {
          clinicbot: checkoutUrls.clinical_starter,
          casewise: checkoutUrls.wise_pro
        }
      default:
        return {
          clinicbot: checkoutUrls.clinical_starter,
          casewise: checkoutUrls.wise_starter
        }
    }
  }

  const upgradeLinks = getUpgradeLink();
  const isHighestPlan = plan === 'clinical_pro' || plan === 'wise_pro' || plan === 'launch_bundle';

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)',
      }}
    >
      {/* Blurred background overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
      
      {/* Main content with entrance animation */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}>
        <div className="w-full max-w-4xl">
          <LiquidCard className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-4 sm:p-8 text-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <SettingsIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-white/10 border border-white/20 p-1 rounded-xl mb-8">
                <TabsTrigger 
                  value="account" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-200 text-xs sm:text-sm px-2 py-2 whitespace-normal leading-tight text-center"
                >
                  <User className="w-4 h-4 mr-2 hidden sm:inline-block" />
                  Account Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="subscription" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-200 text-xs sm:text-sm px-2 py-2 whitespace-normal leading-tight text-center"
                >
                  <Crown className="w-4 h-4 mr-2 hidden sm:inline-block" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-200 text-xs sm:text-sm px-2 py-2 whitespace-normal leading-tight text-center"
                >
                  <Shield className="w-4 h-4 mr-2 hidden sm:inline-block" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Account Settings Tab */}
              <TabsContent value="account" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Account Info */}
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4 text-white">Current Plan</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-white">{getPlanDisplayName(plan)}</span>
                        {!isHighestPlan && (
                          <Button 
                            onClick={handleUpgrade}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                          >
                            Upgrade Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4 text-white">Account Information</h3>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-white/80">Email:</span>
                          <span className="text-white font-medium break-all text-right">{user?.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-white/80">Member Since:</span>
                          <span className="text-white font-medium text-right">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Features */}
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4 text-white">Features</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-white/80">ClinicBot Notes:</span>
                          <div className="flex items-center gap-2">
                            {is_unlimited_notes ? (
                              <>
                                <span className="text-green-400 font-medium">Unlimited</span>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </>
                            ) : (
                              <>
                                <span className="text-white font-medium">{notes_remaining} remaining</span>
                                <span className="text-white/60 text-sm">({notes_used} used)</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-white/80">Case Wise Simulations:</span>
                          <div className="flex items-center gap-2">
                            {is_unlimited_simulations ? (
                              <>
                                <span className="text-green-400 font-medium">Unlimited</span>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </>
                            ) : (
                              <>
                                <span className="text-white font-medium">{simulations_remaining} remaining</span>
                                <span className="text-white/60 text-sm">({simulations_used} used)</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-white/80">PDF Downloads:</span>
                          <div className="flex items-center gap-2">
                            {pdf_enabled ? (
                              <>
                                <span className="text-green-400 font-medium">Available</span>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </>
                            ) : (
                              <>
                                <span className="text-red-400 font-medium">Not Available</span>
                                <XCircle className="w-5 h-5 text-red-400" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold mb-4 text-white">Subscription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-white">Current Plan</h4>
                      <div className="bg-white/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-2">{getPlanDisplayName(plan)}</div>
                        {!isHighestPlan && (
                          <Button 
                            onClick={handleUpgrade}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-3 transition-all duration-200 hover:scale-105"
                          >
                            Upgrade Plan
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-white">Usage This Month</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/80">Notes Used:</span>
                          <span className="text-white font-medium">{notes_used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Simulations Used:</span>
                          <span className="text-white font-medium">{simulations_used}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold mb-4 text-white">Security Settings</h3>
                  <div className="space-y-4">
                    <Button 
                      onClick={signOut}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
                  <p className="text-red-300/80 mb-4 text-sm">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account Forever'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </LiquidCard>
        </div>
      </div>
    </div>
  )
}

export default Settings 
