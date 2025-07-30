import { useSubscription } from '../hooks/useSubscription'
import { checkoutUrls } from '../utils/checkoutRedirect'
import { LiquidCard } from '@/components/ui/liquid-glass-card'
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const upgradeLinks = getUpgradeLink()

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-2xl font-bold mb-6 text-white drop-shadow text-center">Settings</h1>
        <LiquidCard className="backdrop-blur-xl bg-white/30 border border-white/30 shadow-xl rounded-2xl p-6 text-white text-center">
          {/* Subscription Information */}
          <h2 className="text-xl font-semibold mb-4 text-white">Subscription</h2>
          <div className="mb-4">
            <p className="text-white">Current Plan</p>
            <p className="text-lg font-medium text-white">{getPlanDisplayName(plan)}</p>
          </div>
          {/* Features */}
          <div className="mb-4">
            <p className="mb-2 text-white">Features</p>
            <ul className="space-y-2">
              <li>
                <span className="font-medium text-white">ClinicBot Notes:</span>
                {is_unlimited_notes ? (
                  ' Unlimited'
                ) : (
                  ` ${notes_remaining} remaining (${notes_used} used this month)`
                )}
              </li>
              <li>
                <span className="font-medium text-white">Case Wise Simulations:</span>
              {is_unlimited_simulations ? (
                ' Unlimited'
              ) : (
                ` ${simulations_remaining} remaining (${simulations_used} used this month)`
              )}
            </li>
            <li>
              <span className="font-medium text-white">PDF Downloads:</span>
              {pdf_enabled ? ' Enabled' : ' Not Available'}
            </li>
          </ul>
          </div>

        {/* Danger Zone */}
        <div className="mt-10">
          <h3 className="text-2xl font- text-red-700 mb-4">Danger Zone!</h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition text-lg w-full"
          >
            {deleting ? 'Deleting...' : 'Delete Forever'}
          </button>
        </div>
      </LiquidCard>
    </div>
  </div>
  )
}

export default Settings 
