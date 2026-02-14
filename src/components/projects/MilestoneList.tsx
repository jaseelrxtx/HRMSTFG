import { useState } from "react";
import { useProjectMilestones, useCreateMilestone, useUpdateMilestone, useDeleteMilestone } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, Clock, Calendar, MoreVertical, Trash, CheckCircle2, Circle } from "lucide-react";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployees } from "@/hooks/useEmployee";

interface MilestoneListProps {
    projectId: string;
}

export function MilestoneList({ projectId }: MilestoneListProps) {
    const { data: milestones, isLoading } = useProjectMilestones(projectId);
    const { mutate: createMilestone } = useCreateMilestone();
    const { mutate: updateMilestone } = useUpdateMilestone();
    const { mutate: deleteMilestone } = useDeleteMilestone();
    const { data: employees } = useEmployees();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newMilestoneData, setNewMilestoneData] = useState({
        title: "",
        assigned_to: "",
        deadline: "",
        notes: ""
    });

    const handleCreate = () => {
        createMilestone({
            project_id: projectId,
            title: newMilestoneData.title,
            assigned_to: newMilestoneData.assigned_to || null,
            deadline: newMilestoneData.deadline || null,
            notes: newMilestoneData.notes,
            status: "pending"
        }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setNewMilestoneData({ title: "", assigned_to: "", deadline: "", notes: "" });
            }
        });
    };

    if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading milestones...</div>;

    const sortedMilestones = milestones ? [...milestones].sort((a, b) => {
        // Sort by status (pending first, completed last) then date
        if (a.status === b.status) {
            return new Date(a.deadline || a.created_at).getTime() - new Date(b.deadline || b.created_at).getTime();
        }
        if (a.status === 'completed') return 1;
        if (b.status === 'completed') return -1;
        return 0;
    }) : [];

    return (
        <Card className="border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                <div>
                    <CardTitle className="text-lg">Project Road Map</CardTitle>
                    <CardDescription>Track key deliverables and deadlines</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {sortedMilestones.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No milestones tracked for this project yet.
                        </div>
                    )}
                    {sortedMilestones.map((milestone) => (
                        <div key={milestone.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors group">
                            {/* Status Indicator */}
                            <div className="mt-1">
                                {milestone.status === 'completed' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className={`font-medium text-sm ${milestone.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}>
                                        {milestone.title}
                                    </h4>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {milestone.status !== 'completed' && (
                                                <DropdownMenuItem onClick={() => updateMilestone({ id: milestone.id, updates: { status: 'completed' } })}>
                                                    <Check className="mr-2 h-4 w-4" /> Mark Complete
                                                </DropdownMenuItem>
                                            )}
                                            {milestone.status === 'completed' && (
                                                <DropdownMenuItem onClick={() => updateMilestone({ id: milestone.id, updates: { status: 'pending' } })}>
                                                    <Clock className="mr-2 h-4 w-4" /> Mark Pending
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-destructive" onClick={() => deleteMilestone(milestone.id)}>
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <p className="text-sm text-muted-foreground mt-0.5 mb-2 line-clamp-2">
                                    {milestone.notes || "No additional notes"}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                    {milestone.assignee && (
                                        <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-full">
                                            <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                                                {milestone.assignee.first_name[0]}
                                            </div>
                                            <span>{milestone.assignee.first_name}</span>
                                        </div>
                                    )}

                                    {milestone.deadline && (
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${isPast(new Date(milestone.deadline)) && milestone.status !== 'completed'
                                                ? "bg-red-50 text-red-600 border-red-200"
                                                : "bg-background border-border"
                                            }`}>
                                            <Calendar className="h-3 w-3" />
                                            <span>{format(new Date(milestone.deadline), "MMM d, yyyy")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Milestone</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="e.g. Initial Design Approval"
                                value={newMilestoneData.title}
                                onChange={e => setNewMilestoneData({ ...newMilestoneData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Assigned To</Label>
                            <Select value={newMilestoneData.assigned_to} onValueChange={v => setNewMilestoneData({ ...newMilestoneData, assigned_to: v })}>
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    {employees?.map(e => (
                                        <SelectItem key={e.id} value={e.id}>{e.profiles?.first_name} {e.profiles?.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Input type="date" value={newMilestoneData.deadline} onChange={e => setNewMilestoneData({ ...newMilestoneData, deadline: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="Describe the milestone requirements..."
                                value={newMilestoneData.notes}
                                onChange={e => setNewMilestoneData({ ...newMilestoneData, notes: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleCreate} className="w-full">Create Milestone</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
