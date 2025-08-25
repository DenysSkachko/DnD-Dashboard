import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAccount } from "@/context/AccountContext";

export type CharacterNotion = {
  id: number;
  character_id: number;
  name: string;
  content?: string;
};

export const useCharacterNotions = () => {
  const { account } = useAccount();
  return useQuery({
    queryKey: ["character_notions", account?.id],
    queryFn: async (): Promise<CharacterNotion[]> => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_notions")
        .select("*")
        .eq("character_id", account.id);
      if (error) throw error;
      return data;
    },
    enabled: !!account,
  });
};

export const useCreateCharacterNotion = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newNotion: Omit<CharacterNotion, "id" | "character_id">) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_notions")
        .insert([{ ...newNotion, character_id: account.id }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_notions", account?.id] }),
  });
};

export const useUpdateCharacterNotion = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedNotion: Partial<CharacterNotion> & { id: number }) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_notions")
        .update(updatedNotion)
        .eq("id", updatedNotion.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_notions", account?.id] }),
  });
};

export const useDeleteCharacterNotion = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_notions")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_notions", account?.id] }),
  });
};
