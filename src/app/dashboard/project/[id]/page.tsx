'use client';

import { useEffect, useState, useRef, use } from 'react';
import { getProjectById, getProjectNotes, ProjectData, NoteData } from '@/app/actions/projectActions';
import SmartPlayer, { SmartPlayerRef } from '@/components/SmartPlayer';
import { Clock, Copy, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function EditorProjectView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  const playerRef = useRef<SmartPlayerRef>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fetchedProject = await getProjectById(id);
        const fetchedNotes = await getProjectNotes(id);
        setProject(fetchedProject);
        setNotes(fetchedNotes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const copyToClipboard = () => {
    if (project) {
      const link = `${window.location.origin}/review/${project.access_token}`;
      navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const jumpToTime = async (seconds: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(seconds);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="p-8">Loading project details...</div>;
  if (!project) return <div className="p-8">Project not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              {project.current_round > project.allowed_revisions ? (
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Completed
                </span>
              ) : (
                <span>Round {project.current_round} of {project.allowed_revisions}</span>
              )}
              <span>• Status: <span className="font-medium text-slate-700">{project.status}</span></span>
            </div>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors min-w-[170px] justify-center"
        >
          {isCopied ? (
            <><Check size={16} /> Copied!</>
          ) : (
            <><Copy size={16} /> Copy Client Link</>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
        <div className="flex-1 relative flex items-center justify-center p-6 bg-slate-100">
          <div className="w-full max-w-5xl aspect-video bg-black shadow-lg rounded-xl overflow-hidden border border-slate-200">
            <SmartPlayer ref={playerRef} url={project.video_url} />
          </div>
        </div>

        <div className="w-full lg:w-[450px] bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Client Feedback</h2>
            <p className="text-sm text-slate-500">Timestamped notes for all rounds.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notes.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">
                <p>No feedback received yet.</p>
                <p className="text-sm mt-2">Share the review link with your client.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <button 
                      onClick={() => jumpToTime(note.timestamp_in_seconds)}
                      className="flex items-center gap-1 text-xs font-mono text-indigo-700 hover:text-indigo-600 bg-indigo-100 px-2 py-1 rounded"
                    >
                      <Clock size={12} /> {formatTime(note.timestamp_in_seconds)}
                    </button>
                    <span className="text-xs font-medium text-slate-400">Round {note.round_number}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{note.comment_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
