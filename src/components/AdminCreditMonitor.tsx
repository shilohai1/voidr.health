import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface CreditData {
  total_granted: number;
  total_used: number;
  remaining: number;
  current_month_usage: number;
  usage_percentage: number;
}

const AdminCreditMonitor: React.FC = () => {
  const { user } = useAuth();
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Only show for admin user - admin id is stored in local env for client-side gating
  const adminUserId = import.meta.env.VITE_ADMIN_USER_ID as string | undefined;
  if (!user || !adminUserId || user.id !== adminUserId) {
    return null;
  }

  const checkCredits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-openai-credits');
      
      if (error) throw error;
      
      if (data?.success) {
        setCreditData(data.credits);
        setLastChecked(new Date());
      } else {
        // Show a friendly, specific message from the function
        const details = data?.details ? ` (${String(data.details).slice(0, 160)}...)` : '';
        throw new Error(data?.error ? `${data.error}${details}` : 'Failed to fetch credit data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCredits();
  }, []);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageVariant = (percentage: number) => {
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'secondary';
    if (percentage >= 50) return 'default';
    return 'default';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OpenAI Credit Monitor</h1>
            <p className="text-gray-600">Admin-only view of your API usage and remaining credits</p>
          </div>
          <Button 
            onClick={checkCredits} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {creditData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Credits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Total Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${creditData.total_granted.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Granted this month</p>
              </CardContent>
            </Card>

            {/* Used Credits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Used Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${creditData.total_used.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Total usage</p>
              </CardContent>
            </Card>

            {/* Remaining Credits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${getUsageColor(creditData.usage_percentage)}`}>
                  ${creditData.remaining.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Available balance</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Progress */}
        {creditData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Usage Progress</span>
                <Badge variant={getUsageVariant(creditData.usage_percentage)}>
                  {creditData.usage_percentage.toFixed(1)}% Used
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={creditData.usage_percentage} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${creditData.current_month_usage.toFixed(2)} used this month</span>
                  <span>${creditData.total_granted.toFixed(2)} total limit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Month Usage */}
        {creditData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Month Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${creditData.current_month_usage.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">
                Spent in {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        {lastChecked && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: {lastChecked.toLocaleString()}
          </div>
        )}

        {/* Warning Messages */}
        {creditData && creditData.usage_percentage >= 75 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="font-medium">
                    {creditData.usage_percentage >= 90 
                      ? '⚠️ CRITICAL: You are running low on credits!' 
                      : '⚠️ WARNING: You are approaching your credit limit'
                    }
                  </p>
                  <p className="text-sm">
                    {creditData.usage_percentage >= 90 
                      ? `Only $${creditData.remaining.toFixed(2)} remaining. Consider adding more credits soon.`
                      : `You've used ${creditData.usage_percentage.toFixed(1)}% of your monthly credits.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCreditMonitor;
