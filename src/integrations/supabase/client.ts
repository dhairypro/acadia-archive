import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkctsntlucqdqdunuxlc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprY3RzbnRsdWNxZHFkdW51eGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDg5NjIsImV4cCI6MjA3NjE4NDk2Mn0.MWpxQRQ1SO3z6egJId-UaRv6cYn0A4-dBOThDrLOlOw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
