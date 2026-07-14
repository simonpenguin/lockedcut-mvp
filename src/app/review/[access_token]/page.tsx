import { getProjectByToken } from '@/app/actions/projectActions';
import ReviewClient from './ReviewClient';
import { Lock } from 'lucide-react';

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ access_token: string }>;
}) {
  try {
    const resolvedParams = await params;
    const project = await getProjectByToken(resolvedParams.access_token);

    const isLocked = project.current_round > project.allowed_revisions;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 shrink-0 flex items-center justify-between">
          <h1 className="text-xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-4">
            {!isLocked && (
              <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                Round {project.current_round} of {project.allowed_revisions}
              </span>
            )}
            {isLocked && (
              <span className="text-sm px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full font-medium flex items-center gap-1">
                <Lock size={14} /> Locked
              </span>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        {isLocked ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-lg text-center shadow-xl">
              <div className="mx-auto bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Revision Limit Reached</h2>
              <p className="text-slate-600 mb-6">
                The contracted rounds for this project have been exhausted. Please reach out to your editor to authorize an overage invoice to unlock further revisions.
              </p>
            </div>
          </div>
        ) : (
          <ReviewClient project={project} />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Project Not Found</h2>
          <p className="text-slate-600">The access token provided is invalid or has expired.</p>
        </div>
      </div>
    );
  }
}
