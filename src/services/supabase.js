import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://upnlqbwoviylknzaewox.supabase.co";
const supabaseKey = "sb_publishable_yTXA_Gwr-WmisJOipN5aqg_6dSHM7vP";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
