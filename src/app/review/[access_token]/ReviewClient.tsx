'use client';

import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { ProjectData, submitRevisionRound } from '@/app/actions/projectActions';
import { Send, Clock, Trash2 } from 'lucide-react';

interface ReviewClientProps {
  project: ProjectData;
}

interface DraftNote {
  timestamp: number;
  text: string;
}

export default function ReviewClient({ project }: ReviewClientProps) {
  const playerRef = useRef<any>(null);
  
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleInputFocus = () => {
    if (playerRef.current && activeTimestamp === null) {
      // Capture the exact runtime value when they start typing a new note
      setActiveTimestamp(playerRef.current.getCurrentTime());
      // Optionally pause the video when they start typing
      // Note: ReactPlayer requires playing state to be controlled if we want to pause programmatically, 
      // but for simplicity, just grabbing the timestamp is usually enough.
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    if (activeTimestamp === null && playerRef.current) {
      setActiveTimestamp(playerRef.current.getCurrentTime());
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

  const jumpToTime = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
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

  const Player = ReactPlayer as any;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Submit Complete Revision Round?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure? Once submitted, your editor will be notified and no more changes can be added to this draft. This will consume Round {project.current_round}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
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
      <div className="flex-1 bg-black relative flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-video bg-slate-900 shadow-2xl">
          <Player
            ref={playerRef}
            url={project.video_url}
            width="100%"
            height="100%"
            controls={true}
          />
        </div>
      </div>

      {/* Right Panel: Feedback Notes */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 h-[50vh] lg:h-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <h2 className="font-semibold mb-1">Draft Comments</h2>
          <p className="text-sm text-slate-400">Notes are saved locally until you submit the round.</p>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {draftNotes.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <p>No notes drafted yet.</p>
              <p className="text-sm mt-2">Start typing below to capture the timestamp and add a note.</p>
            </div>
          ) : (
            draftNotes.map((note, idx) => (
              <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 group">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={() => jumpToTime(note.timestamp)}
                    className="flex items-center gap-1 text-xs font-mono text-blue-400 hover:text-blue-300 bg-blue-900/30 px-2 py-1 rounded"
                  >
                    <Clock size={12} /> {formatTime(note.timestamp)}
                  </button>
                  <button 
                    onClick={() => removeNote(idx)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-200">{note.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <form onSubmit={addNote} className="relative">
            {activeTimestamp !== null && (
              <div className="absolute -top-6 left-2 flex items-center gap-1 text-xs font-mono text-blue-400 bg-slate-900 px-2 py-0.5 rounded-t-md border border-b-0 border-slate-700">
                <Clock size={12} /> {formatTime(activeTimestamp)}
              </div>
            )}
            <input
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Type a note at the current timestamp..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
            />
            <button 
              type="submit"
              disabled={!currentInput.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:hover:text-blue-500 bg-slate-800 rounded-md transition-colors"
            >
              <Send size={16} />
            </button>
          </form>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={draftNotes.length === 0}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg"
          >
            Submit Revision Round
          </button>
        </div>
      </div>
    </div>
  );
}
