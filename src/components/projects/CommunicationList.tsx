import { useState } from "react";
import { useClientCommunications, useCreateCommunication } from "@/hooks/useProjects"; // Ensure useCreateCommunication is exported
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunicationType, CommunicationVisibility } from "@/types/projects";

interface CommunicationListProps {
    projectId: string;
}

export function CommunicationList({ projectId }: CommunicationListProps) {
    const { data: communications, isLoading } = useClientCommunications(projectId);
    const { mutate: createCommunication } = useCreateCommunication();
    const [isOpen, setIsOpen] = useState(false);
    const [newData, setNewData] = useState({
        title: "",
        type: "meeting" as CommunicationType,
        description: "",
        meeting_date: "",
        visibility: "public" as CommunicationVisibility
    });

    const handleCreate = () => {
        createCommunication({
            project_id: projectId,
            ...newData,
            meeting_date: newData.meeting_date || null
        }, {
            onSuccess: () => {
                setIsOpen(false);
                setNewData({ title: "", type: "meeting", description: "", meeting_date: "", visibility: "public" });
            }
        });
    };

    if (isLoading) return <div>Loading communication logs...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Communication</CardTitle>
                <Button size="sm" onClick={() => setIsOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Log
                </Button>
            </CardHeader>
            <CardContent>
                <div className="relative border-l border-muted ml-3 space-y-6">
                    {communications?.length === 0 && <p className="pl-6 text-muted-foreground text-sm">No communication logs recorded.</p>}
                    {communications?.map((comm) => (
                        <div key={comm.id} className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{comm.type}</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{format(new Date(comm.created_at), "MMM d, yyyy")}</span>
                                    {comm.meeting_date && (
                                        <>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-blue-500">Meeting: {format(new Date(comm.meeting_date), "MMM d")}</span>
                                        </>
                                    )}
                                </div>
                                <h4 className="font-semibold text-base">{comm.title}</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comm.description}</p>
                                {/* Logged by info could be here */}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Log Communication</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newData.type} onValueChange={(v) => setNewData({ ...newData, type: v as CommunicationType })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="meeting">Meeting Notes</SelectItem>
                                    <SelectItem value="changes">Changes</SelectItem>
                                    <SelectItem value="credentials">Credentials</SelectItem>
                                    <SelectItem value="requirements">Requirements</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={newData.title} onChange={e => setNewData({ ...newData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={newData.description} onChange={e => setNewData({ ...newData, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Meeting Date (Optional)</Label>
                            <Input type="date" value={newData.meeting_date} onChange={e => setNewData({ ...newData, meeting_date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Visibility</Label>
                            <Select value={newData.visibility} onValueChange={(v) => setNewData({ ...newData, visibility: v as CommunicationVisibility })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public (Internal)</SelectItem>
                                    <SelectItem value="admin_only">Admin Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleCreate} className="w-full">Save Log</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
