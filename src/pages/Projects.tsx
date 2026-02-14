import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { KanbanSquare, Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Projects() {
    const { data: projects, isLoading } = useProjects();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const navigate = useNavigate();

    const filteredProjects = projects?.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "default"; // or a custom green variant if available
            case "in_progress": return "default";
            case "not_started": return "secondary";
            case "on_hold": return "destructive";
            default: return "outline";
        }
    };

    const StatusBadge = ({ status }: { status: string }) => (
        <Badge variant={getStatusColor(status) as any}>
            {status.replace("_", " ")}
        </Badge>
    );

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <SidebarTrigger />
                                    <div>
                                        <h1 className="text-3xl font-bold flex items-center gap-2">
                                            <KanbanSquare className="h-8 w-8" />
                                            Projects
                                        </h1>
                                        <p className="text-muted-foreground">
                                            Dashboard overview of all ongoing and past projects.
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={() => setCreateDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Project
                                </Button>
                            </div>

                            {/* Filters and View Toggle */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="not_started">Not Started</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="on_hold">On Hold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
                                    <ToggleGroupItem value="grid" aria-label="Grid view">
                                        <LayoutGrid className="h-4 w-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="list" aria-label="List view">
                                        <List className="h-4 w-4" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                            {/* Project Display */}
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                                    ))}
                                </div>
                            ) : filteredProjects?.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    No projects found matching your filters.
                                </div>
                            ) : viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects?.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <div className="border rounded-lg overflow-hidden bg-card">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Project Name</TableHead>
                                                <TableHead>Client</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Timeline</TableHead>
                                                <TableHead>Head</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProjects?.map((project) => (
                                                <TableRow
                                                    key={project.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => navigate(`/projects/${project.id}`)}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{project.name}</span>
                                                            <span className="text-xs text-muted-foreground">{project.category}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{project.client_name || "-"}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={project.status} />
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {project.end_date ? format(new Date(project.end_date), "MMM d, yyyy") : "TBD"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {project.project_head ? (
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={project.project_head.avatar_url || ""} />
                                                                    <AvatarFallback className="text-[10px]">
                                                                        {project.project_head.first_name[0]}{project.project_head.last_name[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm truncate max-w-[100px]">
                                                                    {project.project_head.first_name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Unassigned</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/projects/${project.id}`);
                                                        }}>
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </SidebarProvider>
    );
}
