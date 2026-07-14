'use client';

import { useState, useRef, useEffect } from 'react';
import SmartPlayer, { SmartPlayerRef } from '@/components/SmartPlayer';
import { ProjectData, submitRevisionRound } from '@/app/actions/projectActions';
import { parseVideoUrl } from '@/lib/videoParser';
import { Send, Clock, Trash2 } from 'lucide-react';

interface ReviewClientProps {
  project: ProjectData;
}

interface DraftNote {
  timestamp: number;
  text: string;
}

export default function ReviewClient({ project }: ReviewClientProps) {
  const playerRef = useRef<SmartPlayerRef>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleInputFocus = async () => {
    if (playerRef.current && activeTimestamp === null) {
      const time = await playerRef.current.getCurrentTime();
      setActiveTimestamp(Math.floor(time));
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    if (playerRef.current && activeTimestamp === null) {
      const time = await playerRef.current.getCurrentTime();
      setActiveTimestamp(Math.floor(time));
    }
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    setDraftNotes([...draftNotes, {
      timestamp: activeTimestamp || 0,
      text: currentInput.trim()
    }]);

    setCurrentInput('');
    setActiveTimestamp(null);
  };

  const removeNote = (indexToRemove: number) => {
    setDraftNotes(draftNotes.filter((_, idx) => idx !== indexToRemove));
  };

  const jumpToTime = async (seconds: number) => {
    if (playerRef.current) {
      await playerRef.current.seekTo(seconds);
    }
  };

  const handleSubmitBatch = async () => {
    setIsSubmitting(true);
    try {
      await submitRevisionRound(project.id, project.current_round, draftNotes);
      // Reload to let the server component re-evaluate the lockdown condition
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to submit revision round.');
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };



  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-slate-50">
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-slate-100/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Submit Complete Revision Round?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure? Once submitted, your editor will be notified and no more changes can be added to this draft. This will consume Round {project.current_round}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBatch}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit Round'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel: Video Player */}
      <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-5xl aspect-video bg-black shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <SmartPlayer ref={playerRef} url={project.video_url} />
        </div>
      </div>

      {/* Right Panel: Feedback Notes */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-white border-l border-slate-200 flex flex-col shrink-0 h-[50vh] lg:h-auto">
        <div className="p-5 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="font-semibold text-slate-900 mb-1">Draft Comments</h2>
          <p className="text-sm text-slate-500">Notes are saved locally until you submit the round.</p>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {draftNotes.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p>No notes drafted yet.</p>
              <p className="text-sm mt-2">Start typing below to capture the timestamp and add a note.</p>
            </div>
          ) : (
            draftNotes.map((note, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 group transition-colors hover:border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={() => jumpToTime(note.timestamp)}
                    className="flex items-center gap-1 text-xs font-mono text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
                  >
                    <Clock size={12} /> {formatTime(note.timestamp)}
                  </button>
                  <button 
                    onClick={() => removeNote(idx)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 shrink-0">
          <form onSubmit={addNote} className="relative">
            {activeTimestamp !== null && (
              <div className="absolute -top-6 left-2 flex items-center gap-1 text-xs font-mono text-indigo-600 bg-white px-2 py-0.5 rounded-t-md border border-b-0 border-slate-200 shadow-sm">
                <Clock size={12} /> {formatTime(activeTimestamp)}
              </div>
            )}
            <input
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Type a note at the current timestamp..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 shadow-sm"
            />
            <button 
              type="submit"
              disabled={!currentInput.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </form>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={draftNotes.length === 0}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-xl transition-colors shadow-sm"
          >
            Submit Revision Round
          </button>
        </div>
      </div>
    </div>
  );
}
