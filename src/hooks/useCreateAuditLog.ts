import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CreateAuditLogParams {
    action: string;
    table_name: string;
    record_id?: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
}

export function useCreateAuditLog() {
    const { user } = useAuth();
    // We don't necessarily need to invalidate queries immediately for every log, 
    // but if the user is on the audit log page, it would be nice.
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: CreateAuditLogParams) => {
            if (!user) {
                console.warn("Attempted to create audit log without user");
                return;
            }

            const { error } = await supabase.from("audit_logs").insert({
                user_id: user.id,
                action: params.action,
                table_name: params.table_name,
                record_id: params.record_id,
                old_values: params.old_values,
                new_values: params.new_values,
            });

            if (error) {
                console.error("Failed to create audit log:", error);
                // We might not want to throw here to avoid blocking the main action
                // But for debugging it is useful. Let's log it.
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
        },
    });
}
