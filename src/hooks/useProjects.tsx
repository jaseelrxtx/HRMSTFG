import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectMilestone, ClientCommunication, ProjectPayment, ProjectTestimonial } from "@/types/projects";
import { useCreateAuditLog } from "@/hooks/useCreateAuditLog";

// --- Projects ---

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("projects" as any)
                .select(`
          *,
          project_head:employees!projects_project_head_id_fkey (
            id,
            profiles:profiles!employees_user_id_profiles_fkey (
              first_name,
              last_name,
              avatar_url
            )
          ),
          milestones:project_milestones (
            id,
            title,
            deadline,
            status,
            notes,
            assignee:employees!project_milestones_assigned_to_fkey (
              id,
              profiles:profiles!employees_user_id_profiles_fkey (
                first_name,
                last_name,
                avatar_url
              )
            )
          ),
          communications:client_communications (
            id,
            type,
            title,
            description,
            meeting_date,
            visibility,
            created_at
          ),
          payments:project_payments (
            id,
            amount,
            due_date,
            status,
            notes
          )
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map((p: any) => ({
                ...p,
                project_head: p.project_head ? {
                    id: p.project_head.id,
                    ...p.project_head.profiles
                } : null,
                milestones: p.milestones?.map((m: any) => ({
                    ...m,
                    assignee: m.assignee ? {
                        id: m.assignee.id,
                        ...m.assignee.profiles
                    } : null
                })) || [],
                communications: p.communications || [],
                payments: p.payments || []
            })) as Project[];
        },
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("projects" as any)
                .select(`
          *,
          project_head:employees!projects_project_head_id_fkey (
            id,
            profiles:profiles!employees_user_id_profiles_fkey (
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
                .eq("id", id)
                .single();

            if (error) throw error;

            return {
                ...data,
                project_head: data.project_head ? {
                    id: data.project_head.id,
                    ...data.project_head.profiles
                } : null
            } as Project;
        },
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async (newProject: Partial<Project>) => {
            const { data, error } = await supabase.from("projects" as any).insert(newProject).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            logAudit({
                action: "INSERT",
                tableName: "projects",
                recordId: data.id,
                newValues: data
            });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
            const { data, error } = await supabase.from("projects" as any).update(updates).eq("id", id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.id] });
            logAudit({
                action: "UPDATE",
                tableName: "projects",
                recordId: data.id,
                newValues: data
            });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("projects" as any).delete().eq("id", id);
            if (error) throw error;
            return id;
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            logAudit({
                action: "DELETE",
                tableName: "projects",
                recordId: id,
            });
        },
    });
}

// --- Milestones ---

export function useProjectMilestones(projectId: string) {
    return useQuery({
        queryKey: ["milestones", projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("project_milestones" as any)
                .select(`
          *,
          assignee:employees!project_milestones_assigned_to_fkey (
            id,
            profiles:profiles!employees_user_id_profiles_fkey (
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
                .eq("project_id", projectId)
                .order("deadline", { ascending: true });

            if (error) throw error;

            return data.map((m: any) => ({
                ...m,
                assignee: m.assignee ? {
                    id: m.assignee.id,
                    ...m.assignee.profiles
                } : null
            })) as ProjectMilestone[];
        },
        enabled: !!projectId,
    });
}

export function useCreateMilestone() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async (milestone: Partial<ProjectMilestone>) => {
            const { data, error } = await supabase.from("project_milestones" as any).insert(milestone).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.project_id] });
            logAudit({
                action: "INSERT",
                tableName: "project_milestones",
                recordId: data.id,
                newValues: data
            });
        },
    });
}

export function useUpdateMilestone() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProjectMilestone> }) => {
            const { data, error } = await supabase.from("project_milestones" as any).update(updates).eq("id", id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", data.project_id] });
            logAudit({
                action: "UPDATE",
                tableName: "project_milestones",
                recordId: data.id,
                newValues: data
            });
        },
    });
}

export function useDeleteMilestone() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
            const { error } = await supabase.from("project_milestones" as any).delete().eq("id", id);
            if (error) throw error;
            return { id, projectId };
        },
        onSuccess: ({ id, projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
            logAudit({
                action: "DELETE",
                tableName: "project_milestones",
                recordId: id
            });
        },
    });
}

// --- Communications ---

export function useClientCommunications(projectId: string) {
    return useQuery({
        queryKey: ["communications", projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("client_communications" as any)
                .select("*")
                .eq("project_id", projectId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as ClientCommunication[];
        },
        enabled: !!projectId,
    });
}

export function useCreateCommunication() {
    const queryClient = useQueryClient();
    const { mutate: logAudit } = useCreateAuditLog();

    return useMutation({
        mutationFn: async (comm: Partial<ClientCommunication>) => {
            const { data, error } = await supabase.from("client_communications" as any).insert(comm).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["communications", data.project_id] });
            logAudit({
                action: "INSERT",
                tableName: "client_communications",
                recordId: data.id,
                newValues: data
            });
        },
    });
}

// --- Payments ---

export function useProjectPayments(projectId: string) {
    return useQuery({
        queryKey: ["payments", projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("project_payments" as any)
                .select("*")
                .eq("project_id", projectId)
                .order("due_date", { ascending: true });

            if (error) throw error;
            return data as ProjectPayment[];
        },
        enabled: !!projectId,
    });
}

// --- Testimonials ---

export function useProjectTestimonials(projectId: string) {
    return useQuery({
        queryKey: ["testimonials", projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("project_testimonials" as any)
                .select("*")
                .eq("project_id", projectId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as ProjectTestimonial[];
        },
        enabled: !!projectId,
    });
}
