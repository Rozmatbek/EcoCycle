/**
 * Supabase Backend Service for EcoCycle
 * Handles:
 * - Tracking every visitor / user who enters the application
 * - Saving user registration and profile data
 * - Recording questions and feedback sent to dasturlash85@gmail.com
 */

// Supabase Project Credentials from Environment Variables (or fallback for demo/setup)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export interface VisitorInfo {
  visitor_id: string;
  full_name?: string;
  phone?: string;
  role?: string;
  region?: string;
  district?: string;
  user_agent?: string;
  device?: string;
  current_page?: string;
  is_authenticated?: boolean;
  last_seen_at?: string;
}

export interface FeedbackData {
  user_name: string;
  phone?: string;
  message: string;
  region?: string;
  district?: string;
  sent_to_email?: string;
}

export interface SupabaseUserData {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  district: string;
  mahalla?: string;
  street?: string;
  role: string;
  created_at?: string;
}

/**
 * Get or create a unique persistent visitor ID
 */
export const getVisitorId = (): string => {
  let id = localStorage.getItem('ecocycle_visitor_uuid');
  if (!id) {
    id = 'vis_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem('ecocycle_visitor_uuid', id);
  }
  return id;
};

/**
 * Detect Device Type
 */
const detectDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) return 'Mobile';
  return 'Desktop';
};

/**
 * Generic Supabase REST API requester
 */
const supabaseRequest = async (table: string, payload: any, method: 'POST' | 'GET' | 'PATCH' = 'POST') => {
  // If user hasn't configured real Supabase credentials yet, save locally to queue
  if (!SUPABASE_URL || SUPABASE_URL.includes('xyzcompany')) {
    const queue = JSON.parse(localStorage.getItem(`ecocycle_supabase_${table}_queue`) || '[]');
    queue.push({ ...payload, _queued_at: new Date().toISOString() });
    localStorage.setItem(`ecocycle_supabase_${table}_queue`, JSON.stringify(queue.slice(-50)));
    return { success: true, mocked: true };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    return { success: response.ok, status: response.status };
  } catch (error) {
    console.warn(`Supabase ${table} sync error:`, error);
    return { success: false, error };
  }
};

/**
 * Track Every Visitor who enters the application
 * Automatically called on page mount or user activity
 */
export const trackVisitor = async (user?: any) => {
  const visitorId = getVisitorId();
  const visitorData: VisitorInfo = {
    visitor_id: visitorId,
    full_name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Mehmon (Guest)',
    phone: user?.phone || undefined,
    role: user?.role || 'user',
    region: user?.region || undefined,
    district: user?.district || undefined,
    user_agent: navigator.userAgent,
    device: detectDeviceType(),
    current_page: window.location.pathname + window.location.search,
    is_authenticated: Boolean(user),
    last_seen_at: new Date().toISOString()
  };

  // Keep last visitor state in local storage
  localStorage.setItem('ecocycle_last_visitor_data', JSON.stringify(visitorData));

  return supabaseRequest('visitors', visitorData);
};

/**
 * Save user profile to Supabase
 */
export const saveUserToSupabase = async (user: SupabaseUserData) => {
  return supabaseRequest('users', {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    region: user.region,
    district: user.district,
    mahalla: user.mahalla || '',
    street: user.street || '',
    role: user.role,
    created_at: user.created_at || new Date().toISOString()
  });
};

/**
 * Record feedback / comment to Supabase
 */
export const recordFeedbackToSupabase = async (feedback: FeedbackData) => {
  return supabaseRequest('feedbacks', {
    user_name: feedback.user_name,
    phone: feedback.phone || '',
    message: feedback.message,
    region: feedback.region || '',
    district: feedback.district || '',
    sent_to_email: feedback.sent_to_email || 'dasturlash85@gmail.com',
    created_at: new Date().toISOString()
  });
};
