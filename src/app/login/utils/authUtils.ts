import { supabase } from "@/lib/supabaseClient";

export type Account = {
  id: number; // SERIAL → number
  character_name: string;
};

export const login = async (name: string, password: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, character_name")
    .eq("character_name", name)
    .eq("password", password)
    .single<Account>();

  return { data, error };
};

export const createAccount = async (name: string, password: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .insert([{ character_name: name, password }])
    .select("id, character_name")
    .single<Account>();

  return { data, error };
};
