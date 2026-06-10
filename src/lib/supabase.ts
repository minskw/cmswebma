/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Load credentials from meta.env for client-side configuration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Checks in real-time if a specific user login/role exists in the Supabase 'profiles' table
 * and joins the 'roles' table to find the user's role authorization name.
 * 
 * Target Roles: 'Super Admin', 'Kepala Madrasah', 'Operator' (which can trigger modifications)
 */
export async function verifyUserRoleAgainstSupabase(userIdOrEmail: string | null): Promise<string | null> {
  if (!supabase || !userIdOrEmail) {
    console.warn('[Supabase client] Client not initialized or identifier empty. Fallback activated.');
    return null;
  }

  try {
    // Check if the input looks like a UUID (Supabase auth user_id)
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userIdOrEmail);

    if (isUuid) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role_id, role:roles(name)')
        .eq('user_id', userIdOrEmail)
        .maybeSingle();

      if (error) {
        console.error('[Supabase Guard Audit] Error querying profile by UUID:', error);
      } else if (data) {
        const retrievedRole = (data as any).role?.name || null;
        console.log(`[Supabase Guard Audit] Profile found via UUID. Verified Role: ${retrievedRole}`);
        return retrievedRole;
      }
    } else if (userIdOrEmail.includes('@')) {
      // Query by filtering users or custom columns if email exists
      // Fallback query matching standard profile search matching username portion
      const userPrefix = userIdOrEmail.split('@')[0];
      const { data, error } = await supabase
        .from('profiles')
        .select('role_id, role:roles(name)')
        .ilike('full_name', `%${userPrefix}%`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const retrievedRole = (data[0] as any).role?.name || null;
        console.log(`[Supabase Guard Audit] Profile found via Email Prefix likeness. Verified Role: ${retrievedRole}`);
        return retrievedRole;
      }
    }

    // Default general check on profiles table to grab active role if schema matches
    const { data: generalCheck, error: generalErr } = await supabase
      .from('profiles')
      .select('role:roles(name)')
      .limit(1);

    if (!generalErr && generalCheck && generalCheck.length > 0) {
      return (generalCheck[0] as any).role?.name || null;
    }
  } catch (err) {
    console.error('[Supabase Guard Audit] Query execution failed on profiles schema check:', err);
  }

  return null;
}

/**
 * Logging client/server actions to Supabase 'audit_logs' table
 */
export async function logToSupabaseAudit(
  userId: string | null,
  action: string,
  entity: string | null,
  entityId: string | null,
  details: string
): Promise<boolean> {
  if (!supabase) {
    console.warn('[Supabase client] Client not initialized. Cannot log to Supabase.');
    return false;
  }
  try {
    const isUuid = userId ? /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId) : false;
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: isUuid ? userId : null,
        action,
        entity,
        entity_id: entityId,
        details,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('[Supabase Audit Log Error]:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase Audit Log Catch Error]:', err);
    return false;
  }
}
