'use client';

import { useState } from 'react';
import { createProject } from '../actions/projectActions';
import { PlusCircle, Link as LinkIcon, Copy } from 'lucide-react';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [revisions, setRevisions] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShareLink('');

    try {
      const project = await createProject(title, videoUrl, revisions);
      const link = `${window.location.origin}/review/${project.access_token}`;
      setShareLink(link);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <PlusCircle className="text-blue-500" /> Editor Dashboard
        </h1>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Create New Project</h2>
          
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Nike Commercial V1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Video URL</label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YouTube, Vimeo, or MP4 link"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Allowed Revision Rounds</label>
              <input
                type="number"
                min="1"
                required
                value={revisions}
                onChange={(e) => setRevisions(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Generate Review Link'}
            </button>
          </form>

          {shareLink && (
            <div className="mt-8 p-4 bg-emerald-900/30 border border-emerald-800 rounded-lg">
              <h3 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> Client Share Link Generated!
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
