'use server';

import { supabase } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';

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

export interface NoteData {
  id: string;
  project_id: string;
  round_number: number;
  timestamp_in_seconds: number;
  comment_text: string;
  created_at: string;
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

export async function getProjectById(projectId: string) {
  if (!projectId) throw new Error('No project ID provided.');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project by ID:', error);
    throw new Error('Failed to fetch project details.');
  }

  return data as ProjectData;
}

export async function getEditorProjects(userId: string) {
  if (!userId) throw new Error('Not authenticated.');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('editor_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching editor projects:', error);
    throw new Error('Failed to fetch projects.');
  }

  return data as ProjectData[];
}

export async function getProjectNotes(projectId: string) {
  if (!projectId) return [];
  
  const { data, error } = await supabase
    .from('feedback_notes')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project notes:', error);
    return [];
  }

  return data as NoteData[];
}

export async function submitRevisionRound(
  projectId: string,
  currentRound: number,
  notes: NotePayload[]
) {
  if (!projectId) throw new Error('No project ID provided.');

  const adminAuthClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Update the project's current round and status
  const { error: updateError } = await adminAuthClient
    .from('projects')
    .update({ 
      current_round: currentRound + 1,
      status: 'completed' 
    })
    .eq('id', projectId);

  if (updateError) {
    console.error('Error updating project:', updateError);
    throw new Error(updateError.message || 'Failed to update project round.');
  }

  // Insert the notes directly into feedback_notes with the correct project_id
  if (notes.length > 0) {
    const notesToInsert = notes.map(n => ({
      project_id: projectId,
      round_number: currentRound,
      timestamp_in_seconds: n.timestamp,
      comment_text: n.text
    }));

    const { error: insertError } = await adminAuthClient
      .from('feedback_notes')
      .insert(notesToInsert);

    if (insertError) {
      console.error('Error inserting feedback notes:', insertError);
      throw new Error(insertError.message || 'Failed to save notes.');
    }
  }

  return { success: true };
}

export async function createProject(
  title: string,
  videoUrl: string,
  allowedRevisions: number,
  userId: string
) {
  if (!userId) {
    throw new Error('User not authenticated.');
  }
  
  // Gatekeeper Logic: Check if user is Pro
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', userId)
    .single();

  // If the profile fetch fails, we'll assume they aren't pro (or just continue to check limit).
  const isPro = profile?.is_pro ?? false;

  if (!isPro) {
    // Check total active projects
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('editor_id', userId);
      
    if (countError) {
      return { error: 'Failed to verify project limits.' };
    }

    if (count !== null && count >= 3) {
      return { error: 'FREE_LIMIT_REACHED' };
    }
  }

  const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      video_url: videoUrl,
      allowed_revisions: allowedRevisions,
      access_token: token,
      editor_id: userId 
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return { error: error.message || 'Failed to create project.' };
  }

  return data as ProjectData;
}

