// Which database the admin panel uses. Change this ONE line when Supabase is ready:
//   import { supabaseRepo as repo } from "./supabase-repo";
export { localRepo as repo } from "./local-repo";
export type { AdminRepo, OrderFilter } from "./repo";
