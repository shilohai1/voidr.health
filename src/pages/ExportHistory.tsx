
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useUserContent } from '@/hooks/useUserContent';

const ExportHistory = () => {
  const { content, loading, error } = useUserContent();
  
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      <div className="lg:ml-16 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Export History</h1>
              <p className="text-base text-black">Track all your exported files and downloads</p>
            </div>
            
            {loading && <div className="text-black">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exported At</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exports.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-black">{item.title}</td>
                      <td className="px-4 py-4 text-sm capitalize text-black">{item.type}</td>
                      <td className="px-4 py-4 text-sm text-black">{item.service}</td>
                      <td className="px-4 py-4 text-sm text-black">{item.exportedAt ? new Date(item.exportedAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-4 text-sm text-black">{item.format}</td>
                      <td className="px-4 py-4 text-sm text-black">{item.size || '-'}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {exports.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400">No export history found.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportHistory;
