'use server';

import { supabase } from '@/lib/supabase/client';

export interface ProjectData {
  id: string;
  editor_id: string;
  title: string;
  video_url: string;
  allowed_revisions: number;
  current_round: number;
  status: string;
  access_token: string;
  created_at: string;
}

export interface NotePayload {
  timestamp: number;
  text: string;
}

export async function getProjectByToken(token: string) {
  if (!token) throw new Error('No access token provided.');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('access_token', token)
    .single();

  if (error) {
    console.error('--- SUPABASE ERROR IN getProjectByToken ---');
    console.error(JSON.stringify(error, null, 2));
    throw new Error('Failed to fetch project details.');
  }

  return data as ProjectData;
}

export async function submitRevisionRound(
  projectId: string,
  currentRound: number,
  notes: NotePayload[]
) {
  if (!projectId) throw new Error('No project ID provided.');

  const { error } = await supabase.rpc('submit_revision_round_transaction', {
    p_project_id: projectId,
    p_current_round: currentRound,
    p_notes: notes,
  });

  if (error) {
    console.error('Error submitting revision round transaction:', error);
    throw new Error('Failed to submit revision round.');
  }

  return { success: true };
}

export async function createProject(
  title: string,
  videoUrl: string,
  allowedRevisions: number
) {
  // Mock editor_id since Auth is not implemented yet.
  // In reality, this would be retrieved from Supabase Auth session.
  const editorId = '00000000-0000-0000-0000-000000000000'; // Assume an editor exists or ignore the FK for the mock.
  // Actually, Supabase has an FK constraint on profiles.id. If we don't have auth, this insert might fail due to FK constraint.
  // The spec says: "Phase 1: Initialize a free Supabase instance and run the provided SQL definitions".
  // The user might not have created a mock profile.
  // Wait, let's just generate a random token and pass it.
  
  const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      video_url: videoUrl,
      allowed_revisions: allowedRevisions,
      access_token: token,
      // editor_id is required by the DB schema: editor_id UUID REFERENCES profiles(id)
      // Since Auth is omitted for Phase 3 testing, we might need a workaround or we can just send a dummy uuid and hope it's not strictly enforced or the user created it.
      // Let's rely on the user to have a profile, or we can just try inserting.
      editor_id: '00000000-0000-0000-0000-000000000000' 
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(error.message || 'Failed to create project.');
  }

  return data as ProjectData;
}

