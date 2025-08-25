import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAccount } from "@/context/AccountContext";

export type CharacterFeature = {
  id: number;
  character_id: number;
  name: string;
  description?: string;
  level_required?: number;
};

export const useCharacterFeatures = () => {
  const { account } = useAccount();
  return useQuery({
    queryKey: ["character_features", account?.id],
    queryFn: async (): Promise<CharacterFeature[]> => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_features")
        .select("*")
        .eq("character_id", account.id);
      if (error) throw error;
      return data;
    },
    enabled: !!account,
  });
};

export const useCreateCharacterFeature = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newFeature: Omit<CharacterFeature, "id" | "character_id">) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_features")
        .insert([{ ...newFeature, character_id: account.id }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_features", account?.id] }),
  });
};

export const useUpdateCharacterFeature = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedFeature: Partial<CharacterFeature> & { id: number }) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_features")
        .update(updatedFeature)
        .eq("id", updatedFeature.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_features", account?.id] }),
  });
};

export const useDeleteCharacterFeature = () => {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!account) throw new Error("Нет аккаунта");
      const { data, error } = await supabase
        .from("character_features")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["character_features", account?.id] }),
  });
};
