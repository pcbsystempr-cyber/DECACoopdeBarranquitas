/**
 * Supabase Configuration - Mercadeo PCB
 * 
 * CONFIGURATION INSTRUCTIONS:
 * 1. Create a project at supabase.com
 * 2. Go to Settings > API
 * 3. Copy your Project URL and anon/public key
 * 4. Replace the values below
 */

const SUPABASE_CONFIG = {
  // =====================================================
  // REPLACE THESE VALUES WITH YOUR SUPABASE PROJECT
  // =====================================================
  url: 'https://cnybxlfjnejsrorgzhhz.supabase.co',  // e.g., 'https://xyzabc123.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueWJ4bGZqbmVqc3Jvcmd6aGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDQzODMsImV4cCI6MjA4Nzg4MDM4M30.PCTK9GmgD2njM0JmWXgQSy3tOQg1g7UgOAw2WDjfpzM',  // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  
  // =====================================================
  // CONFIGURATION OPTIONS
  // =====================================================
  debug: false,
  autoRefresh: true,
  persistSession: true,
  storage: localStorage,
  storageKey: 'mercadeo-supabase-session',
  
  // Tables
  tables: {
    products: 'products',
    orders: 'orders',
    users: 'users',
    config: 'config',
    favorites: 'favorites',
    notifications: 'notifications'
  }
};

// Supabase Client (lazy loaded)
let supabaseClient = null;

/**
 * Initialize Supabase client
 * @returns {Object} Supabase client instance
 */
function initSupabase() {
  if (supabaseClient) return supabaseClient;
  
  // Check if Supabase is configured (solo bloquear si aún tiene valores de ejemplo)
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    console.warn('⚠️ Supabase not configured. Using localStorage fallback.');
    return null;
  }
  
  // Check if Supabase library is available
  if (typeof supabase === 'undefined') {
    console.warn('⚠️ Supabase library not loaded. Using localStorage fallback.');
    return null;
  }
  
  try {
    supabaseClient = supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        auth: {
          autoRefreshToken: SUPABASE_CONFIG.autoRefresh,
          persistSession: SUPABASE_CONFIG.persistSession,
          storage: SUPABASE_CONFIG.storage,
          storageKey: SUPABASE_CONFIG.storageKey,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        debug: SUPABASE_CONFIG.debug
      }
    );
    
    if (SUPABASE_CONFIG.debug) {
      console.log('✅ Supabase client initialized:', supabaseClient);
    }
    
    return supabaseClient;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    return null;
  }
}

/**
 * Check if Supabase is configured and available
 * @returns {boolean}
 */
function isSupabaseConfigured() {
  return supabaseClient !== null || 
    (!!SUPABASE_CONFIG.url && !!SUPABASE_CONFIG.anonKey);
}

/**
 * Get Supabase client instance
 * @returns {Object|null}
 */
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
});
