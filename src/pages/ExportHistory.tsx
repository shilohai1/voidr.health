
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { Download, Video, FileText, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserContent } from '@/hooks/useUserContent';

const ExportHistory = () => {
  const { content, loading, error } = useUserContent();
  // Combine all exported items (assuming both videos and summaries can be exported)
  const exports = [
    ...(content?.videos || []).filter(v => v.exported_at).map((video) => ({
      id: video.id,
      type: 'video',
      title: video.title,
      service: 'StudyWithAI',
      exportedAt: video.exported_at,
      format: video.format || 'MP4',
      size: video.size,
      status: video.status || 'completed',
    })),
    ...(content?.summaries || []).filter(s => s.exported_at).map((summary) => ({
      id: summary.id,
      type: 'note',
      title: summary.title,
      service: 'ClinicBot',
      exportedAt: summary.exported_at,
      format: summary.format || 'PDF',
      size: summary.size,
      status: summary.status || 'completed',
    })),
  ];

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      <div className="lg:ml-16 p-4 sm:p-6 md:p-8 pt-16 lg:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Export History</h1>
            <p className="text-black">Track all your exported files and downloads</p>
          </div>
          {loading && <div className="text-black">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-black">Title</th>
                  <th className="px-4 py-2 text-left text-black">Type</th>
                  <th className="px-4 py-2 text-left text-black">Service</th>
                  <th className="px-4 py-2 text-left text-black">Exported At</th>
                  <th className="px-4 py-2 text-left text-black">Format</th>
                  <th className="px-4 py-2 text-left text-black">Size</th>
                  <th className="px-4 py-2 text-left text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {exports.map((item) => (
                  <tr key={item.id} className="border-b last:border-none">
                    <td className="px-4 py-2 text-black">{item.title}</td>
                    <td className="px-4 py-2 capitalize text-black">{item.type}</td>
                    <td className="px-4 py-2 text-black">{item.service}</td>
                    <td className="px-4 py-2 text-black">{item.exportedAt ? new Date(item.exportedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-black">{item.format}</td>
                    <td className="px-4 py-2 text-black">{item.size || '-'}</td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {exports.length === 0 && !loading && <div className="text-gray-400 p-4">No export history found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportHistory;
