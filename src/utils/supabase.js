import { createClient } from '@supabase/supabase-js';
import { validateAndSanitizeProject } from './security';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Validate if user has configured valid Supabase keys
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project')
  );
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Maps database snake_case row to React project camelCase object
 */
export function mapRowToProject(row) {
  if (!row) return null;
  return validateAndSanitizeProject({
    id: row.id,
    title: row.title,
    author: row.author,
    realName: row.real_name || row.author,
    editPin: row.edit_pin || '',
    studentClass: row.student_class,
    avatar: row.avatar,
    category: row.category,
    categoryLabel: row.category_label,
    status: row.status,
    demoUrl: row.demo_url,
    githubUrl: row.github_url,
    thumbnailUrl: row.thumbnail_url,
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    description: row.description,
    stars: row.stars || 1,
    views: row.views || 1,
    submissionDate: row.submission_date || new Date().toISOString().split('T')[0]
  });
}

/**
 * Maps React project object to database snake_case row
 */
export function mapProjectToRow(project) {
  return {
    id: project.id,
    title: project.title,
    author: project.author,
    real_name: project.realName || project.author,
    edit_pin: project.editPin || null,
    student_class: project.studentClass,
    avatar: project.avatar,
    category: project.category,
    category_label: project.categoryLabel,
    status: project.status,
    demo_url: project.demoUrl,
    github_url: project.githubUrl,
    thumbnail_url: project.thumbnailUrl,
    tech_stack: project.techStack || ['Web'],
    description: project.description,
    stars: project.stars || 1,
    views: project.views || 1,
    submission_date: project.submissionDate || new Date().toISOString().split('T')[0]
  };
}

/**
 * Fetch all projects from Supabase database
 */
export async function fetchProjectsFromSupabase() {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return data.map(mapRowToProject).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch from Supabase:", err);
    return null;
  }
}

/**
 * Insert a new project into Supabase database
 */
export async function insertProjectToSupabase(project) {
  if (!isSupabaseConfigured()) return null;

  try {
    const row = mapProjectToRow(project);
    const { data, error } = await supabase
      .from('projects')
      .insert([row])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    return data?.[0] ? mapRowToProject(data[0]) : project;
  } catch (err) {
    console.error("Failed to insert project to Supabase:", err);
    throw err;
  }
}

/**
 * Update an existing project in Supabase database
 */
export async function updateProjectInSupabase(project) {
  if (!isSupabaseConfigured()) return null;

  try {
    const row = mapProjectToRow(project);
    const { data, error } = await supabase
      .rpc('update_project_with_pin', {
        p_id: project.id,
        p_pin: project.editPin || '',
        p_payload: row
      });

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
    return data ? mapRowToProject(data) : project;
  } catch (err) {
    console.error("Failed to update project in Supabase:", err);
    throw err;
  }
}

/**
 * Delete a project from Supabase database
 */
export async function deleteProjectFromSupabase(projectId, editPin = '') {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .rpc('delete_project_with_pin', {
        p_id: projectId,
        p_pin: editPin
      });

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete project from Supabase:", err);
    throw err;
  }
}

/**
 * Update stars count in Supabase database
 */
export async function updateStarsInSupabase(projectId, _newStarsCount) {
  if (!isSupabaseConfigured()) return false;

  try {
    // Gunakan RPC increment_stars untuk menghindari race condition & error RLS
    const { error } = await supabase
      .rpc('increment_stars', { proj_id: projectId });

    if (error) {
      console.warn("Supabase stars update error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to update stars in Supabase:", err);
    return false;
  }
}

/**
 * Uploads a compressed thumbnail image blob to Supabase Storage ('thumbnails' bucket)
 * Returns the public URL of the uploaded image.
 */
export async function uploadThumbnailToSupabase(blob, projectId) {
  if (!isSupabaseConfigured() || !blob) return null;

  try {
    const cleanId = (projectId || 'proj-' + Date.now()).replace(/[^a-zA-Z0-9-_]/g, '');
    const fileName = `${cleanId}-${Date.now()}.jpg`;

    const { error } = await supabase
      .storage
      .from('thumbnails')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn("Storage upload error (will fallback to compressed base64):", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn("Failed to upload thumbnail to Supabase Storage:", err);
    return null;
  }
}
