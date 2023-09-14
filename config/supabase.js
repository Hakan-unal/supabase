import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
dotenv.config();

export const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);