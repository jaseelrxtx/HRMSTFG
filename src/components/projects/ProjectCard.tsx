import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Project } from "@/types/projects";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
    project: Project;
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    not_started: "secondary",
    in_progress: "default",
    completed: "outline",
    on_hold: "destructive",
};

export function ProjectCard({ project }: ProjectCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="group flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4"
            style={{ borderLeftColor: project.status === 'in_progress' ? '#3b82f6' : project.status === 'completed' ? '#22c55e' : 'transparent' }}
            onClick={() => navigate(`/projects/${project.id}`)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs font-normal">
                        {project.category || "General"}
                    </Badge>
                    <Badge variant={STATUS_COLORS[project.status] || "secondary"} className="capitalize">
                        {project.status.replace("_", " ")}
                    </Badge>
                </div>
                <CardTitle className="text-xl font-bold truncate tracking-tight" title={project.name}>
                    {project.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground font-medium">
                    {project.client_name || "Internal Project"}
                </div>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between text-sm mt-auto">
                    {project.project_head ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border ring-1 ring-background">
                                <AvatarImage src={project.project_head.avatar_url || ""} />
                                <AvatarFallback className="text-xs bg-muted">
                                    {project.project_head.first_name[0]}{project.project_head.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Lead</span>
                                <span className="text-xs font-medium truncate max-w-[100px]">
                                    {project.project_head.first_name} {project.project_head.last_name}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 opacity-50">
                            <User className="h-8 w-8 p-1.5 bg-muted rounded-full" />
                            <span className="text-xs">Unassigned</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-2 border-t bg-muted/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                        {project.end_date ? `Due ${format(new Date(project.end_date), "MMM d")}` : "No deadline"}
                    </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
