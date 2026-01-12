import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SmtpConfig {
  id: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  encryption: "tls" | "ssl" | "none";
  from_name: string;
  from_email: string;
  reply_to?: string;
  enabled: boolean;
}

export function useSmtpConfig() {
  return useQuery({
    queryKey: ["smtp-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("smtp_email_config")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data as SmtpConfig | null;
    },
  });
}

export function useCreateSmtpConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: {
      host: string;
      port: number;
      username: string;
      password: string;
      encryption: "tls" | "ssl" | "none";
      from_name: string;
      from_email: string;
      reply_to?: string;
      enabled: boolean;
    }) => {
      const { data, error } = await supabase
        .from("smtp_email_config")
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] });
    },
  });
}

export function useUpdateSmtpConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { 
      id: string; 
      config: Partial<Omit<SmtpConfig, "id">> 
    }) => {
      const { data, error } = await supabase
        .from("smtp_email_config")
        .update(vars.config)
        .eq("id", vars.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] });
    },
  });
}
