
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { Video, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserContent } from '@/hooks/useUserContent';

const Projects = () => {
  const { content, loading, error } = useUserContent();

  const projects = [
    ...(content?.videos || []).map((video) => ({
      id: video.id,
      type: 'video',
      title: video.title,
      service: 'StudyWithAI',
      createdAt: video.created_at,
      thumbnail: video.thumbnail_url || '/placeholder.svg',
      duration: video.duration,
      isPremium: video.is_premium,
    })),
    ...(content?.summaries || []).map((summary) => ({
      id: summary.id,
      type: 'note',
      title: summary.title,
      service: 'ClinicBot',
      createdAt: summary.created_at,
      pages: summary.pages,
      isPremium: summary.is_premium,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      <div className="lg:ml-16 transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">My Projects</h1>
              <p className="text-sm sm:text-base text-black">All your generated videos, notes, and documents</p>
            </div>
            {loading && <div className="text-black">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <LiquidCard key={project.id} className="p-4 sm:p-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {project.type === 'video' ? (
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-black uppercase tracking-wide">
                            {project.service}
                          </span>
                          {project.isPremium && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    {project.type === 'video' && (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-black mb-1 text-sm sm:text-base">{project.title}</h3>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-black">
                        <span>{project.createdAt}</span>
                        {'duration' in project && project.duration && <span>{project.duration}</span>}
                        {'pages' in project && project.pages && <span>{project.pages} pages</span>}
                      </div>
                    </div>
                  </div>
                </LiquidCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
