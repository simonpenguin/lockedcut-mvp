'use client';

import { useState, useEffect } from 'react';
import { createProject, getEditorProjects, ProjectData } from '../actions/projectActions';
import { supabase } from '@/lib/supabase/client';
import { PlusCircle, Link as LinkIcon, Copy, Video, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [revisions, setRevisions] = useState<number | ''>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [limitReached, setLimitReached] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const fetchedProjects = await getEditorProjects(user.id);
          setProjects(fetchedProjects);
        } catch (err) {
          console.error(err);
        }
      }
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShareLink('');
    setLimitReached(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in. Please sign in first.');

      const result = await createProject(title, videoUrl, revisions === '' ? 1 : revisions, user.id);
      
      if (result && 'error' in result) {
        if (result.error === 'FREE_LIMIT_REACHED') {
          setLimitReached(true);
        } else {
          setError(result.error);
        }
        setLoading(false);
        return;
      }

      const project = result as ProjectData;
      const link = `${window.location.origin}/review/${project.access_token}`;
      setShareLink(link);
      
      // Refresh projects list
      const fetchedProjects = await getEditorProjects(user.id);
      setProjects(fetchedProjects);
      setTitle('');
      setVideoUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-2xl mx-auto relative">
        {/* Limit Reached Modal */}
        {limitReached && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-50/80">
             <div className="bg-white p-8 rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Project Limit Reached</h3>
                <p className="text-slate-600 mb-6">
                  You have reached the maximum of 3 active projects on the Free tier. Upgrade to Studio Pro to unlock unlimited projects.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/#pricing" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors text-center block">
                    View Upgrade Options
                  </Link>
                  <button onClick={() => setLimitReached(false)} className="w-full py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-medium transition-colors">
                    Close
                  </button>
                </div>
             </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-slate-900">
          <PlusCircle className="text-indigo-600" /> Editor Dashboard
        </h1>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-900">Create New Project</h2>
          
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Nike Commercial V1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="YouTube, Vimeo, or MP4 link"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Allowed Revision Rounds</label>
              <input
                type="number"
                min="1"
                required
                value={revisions}
                onChange={(e) => setRevisions(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Generate Review Link'}
            </button>
          </form>

          {shareLink && (
            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h3 className="text-emerald-700 font-medium mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> Client Share Link Generated!
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-600 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center w-12"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Projects List */}
        <div className="mt-12 mb-24">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
            <Video className="text-indigo-600" /> Active Projects
          </h2>
          
          {loadingProjects ? (
            <div className="text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
              No active projects. Create one above to get started!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/dashboard/project/${project.id}`}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
                >
                  <h3 className="font-semibold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-sm text-slate-500 mb-4 truncate">
                    {project.video_url}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                        Round {project.current_round} / {project.allowed_revisions}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                        project.status === 'ACTIVE' 
                          ? 'bg-amber-50 text-amber-600' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {project.status === 'ACTIVE' ? 'Pending Client' : 'Feedback Submitted'}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
