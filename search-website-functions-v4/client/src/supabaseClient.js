import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bckkjvztrniecvvjamet.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJja2tqdnp0cm5pZWN2dmphbWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwOTA4NDYsImV4cCI6MjAyNzY2Njg0Nn0.4Rlm9p2rbnX0eDsMpeGjKh_DX09jXjadJI6q8GR3FuA'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
