import { createClient } from '@supabase/supabase-js';

const URL = 'https://iqwidupwdfzmjwqpeoar.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxd2lkdXB3ZGZ6bWp3cXBlb2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDI5NjgsImV4cCI6MjA3MTU3ODk2OH0.fhsJQCVISKEP_2c5P3YbuLULPJ2Xlc4aRAjXQXLtneA';

export const supabase = createClient(URL, API_KEY);
