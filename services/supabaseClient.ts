import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ilhmlruhambjqifivnnh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Yn3D1-8KqW5svrWoghb_Zw_U9R2aHLk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);