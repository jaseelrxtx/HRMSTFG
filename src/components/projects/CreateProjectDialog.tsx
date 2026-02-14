import { useState } from "react";
import { useCreateProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployee"; // Reusing existing hook
import { useToast } from "@/hooks/use-toast";
import { ProjectStatus } from "@/types/projects";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
    const { toast } = useToast();
    const { mutate: createProject, isPending } = useCreateProject();
    const { data: employees } = useEmployees();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        project_head_id: "",
        client_name: "",
        start_date: "",
        end_date: "",
        status: "not_started" as ProjectStatus,
        initial_notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast({ variant: "destructive", title: "Project name is required" });
            return;
        }

        createProject(
            {
                ...formData,
                // Convert empty strings to null for optional fields if needed, 
                // but Supabase usually handles empty string as empty string.
                // For IDs, we must ensure empty string refers to null if not selected.
                project_head_id: formData.project_head_id || null,
            },
            {
                onSuccess: () => {
                    toast({ title: "Project created successfully" });
                    onOpenChange(false);
                    setFormData({
                        name: "",
                        description: "",
                        category: "",
                        project_head_id: "",
                        client_name: "",
                        start_date: "",
                        end_date: "",
                        status: "not_started",
                        initial_notes: "",
                    });
                },
                onError: (error) => {
                    toast({ variant: "destructive", title: "Error creating project", description: error.message });
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Add a new project to track milestones and deliverables.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Mobile App Redesign"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Branding">Branding</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Internal">Internal</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                                placeholder="Brief project description..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project_head">Project Head</Label>
                            <Select
                                value={formData.project_head_id}
                                onValueChange={(v) => setFormData((p) => ({ ...p, project_head_id: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign a lead" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees?.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.profiles?.first_name} {emp.profiles?.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input
                                id="client_name"
                                value={formData.client_name}
                                onChange={(e) => setFormData((p) => ({ ...p, client_name: e.target.value }))}
                                placeholder="Optional"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Expected End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Initial Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData((p) => ({ ...p, status: v as ProjectStatus }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_started">Not Started</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="initial_notes">Initial Notes</Label>
                        <Textarea
                            id="initial_notes"
                            value={formData.initial_notes}
                            onChange={(e) => setFormData((p) => ({ ...p, initial_notes: e.target.value }))}
                            placeholder="Any starting notes..."
                            rows={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
