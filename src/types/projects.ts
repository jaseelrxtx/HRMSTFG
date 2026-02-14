export type ProjectStatus = "not_started" | "in_progress" | "completed" | "on_hold";
export type MilestoneStatus = "pending" | "in_progress" | "completed";
export type PaymentStatus = "pending" | "paid" | "overdue";
export type CommunicationType = "meeting" | "changes" | "credentials" | "requirements" | "other";
export type CommunicationVisibility = "public" | "admin_only";

export interface Project {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    project_head_id: string | null;
    client_name: string | null;
    start_date: string | null;
    end_date: string | null;
    status: ProjectStatus;
    initial_notes: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    // Joins
    project_head?: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    } | null;
    // Timeline data (populated by hooks)
    milestones?: ProjectMilestone[];
    communications?: ClientCommunication[];
    payments?: ProjectPayment[];
}

export interface ProjectMilestone {
    id: string;
    project_id: string;
    title: string;
    assigned_to: string | null;
    deadline: string | null;
    status: MilestoneStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Joins
    assignee?: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    } | null;
}

export interface ClientCommunication {
    id: string;
    project_id: string;
    type: CommunicationType;
    title: string;
    description: string | null;
    meeting_date: string | null;
    visibility: CommunicationVisibility;
    created_by: string | null;
    created_at: string;
    // Joins
    author?: {
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    } | null;
}

export interface ProjectPayment {
    id: string;
    project_id: string;
    amount: number;
    due_date: string | null;
    status: PaymentStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectTestimonial {
    id: string;
    project_id: string;
    client_name: string;
    feedback: string | null;
    rating: number | null;
    is_public: boolean;
    created_at: string;
}
