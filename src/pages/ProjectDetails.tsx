import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Copy, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { MilestoneList } from "@/components/projects/MilestoneList";
import { CommunicationList } from "@/components/projects/CommunicationList";
import { PaymentList } from "@/components/projects/PaymentList";
import { TestimonialSection } from "@/components/projects/TestimonialSection";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProjectDetails() {
    const { projectId } = useParams<{ projectId: string }>();
    const { data: project, isLoading } = useProject(projectId || "");
    const { role } = useAuth();
    const isAdmin = role === "admin";

    if (isLoading) {
        return (
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 p-6 space-y-6">
                        <Skeleton className="h-12 w-1/3" />
                        <Skeleton className="h-64 w-full" />
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    if (!project) {
        return (
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 p-6">
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <h2 className="text-2xl font-bold">Project Not Found</h2>
                            <p className="text-muted-foreground">The project you are looking for does not exist or has been deleted.</p>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto bg-muted/5">
                    <div className="p-6 max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger />
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                                        <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'} className="capitalize">
                                            {project.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Briefcase className="h-4 w-4" />
                                        {project.client_name ? project.client_name : "Internal Project"}
                                        <span className="text-border">|</span>
                                        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{project.id.slice(0, 8)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* Action buttons can go here */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Column */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Project Overview */}
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {project.description || "No description provided for this project."}
                                        </p>

                                        {project.initial_notes && (
                                            <div className="mt-4 p-4 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
                                                <h4 className="text-xs font-semibold uppercase text-yellow-600 dark:text-yellow-500 mb-1">Initial Notes</h4>
                                                <p className="text-sm text-muted-foreground">{project.initial_notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Tabs for Milestones, Comms, etc */}
                                <Tabs defaultValue="milestones" className="w-full">
                                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                                        <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3">
                                            Milestones
                                        </TabsTrigger>
                                        <TabsTrigger value="communication" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3">
                                            Communication
                                        </TabsTrigger>
                                        {isAdmin && (
                                            <TabsTrigger value="payments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3">
                                                Payments
                                            </TabsTrigger>
                                        )}
                                        <TabsTrigger value="testimonials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3">
                                            Testimonials
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="mt-6">
                                        <TabsContent value="milestones" className="m-0">
                                            <MilestoneList projectId={project.id} />
                                        </TabsContent>

                                        <TabsContent value="communication" className="m-0">
                                            <CommunicationList projectId={project.id} />
                                        </TabsContent>

                                        {isAdmin && (
                                            <TabsContent value="payments" className="m-0">
                                                <PaymentList projectId={project.id} />
                                            </TabsContent>
                                        )}

                                        <TabsContent value="testimonials" className="m-0">
                                            <TestimonialSection projectId={project.id} />
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-6">
                                {/* Key Details */}
                                <Card>
                                    <CardHeader className="pb-3 border-b">
                                        <CardTitle className="text-base">Project Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 grid gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Category</span>
                                            <Badge variant="outline">{project.category || "General"}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Start Date</span>
                                            <span className="text-sm font-medium">
                                                {project.start_date ? format(new Date(project.start_date), "MMM d, yyyy") : "TBD"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">End Date</span>
                                            <span className="text-sm font-medium">
                                                {project.end_date ? format(new Date(project.end_date), "MMM d, yyyy") : "TBD"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Days Remaining</span>
                                            {/* Simple logic for days remaining - can be improved */}
                                            <span className="text-sm font-medium">
                                                {project.end_date ?
                                                    Math.max(0, Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) + " days"
                                                    : "-"
                                                }
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Team / Project Head */}
                                <Card>
                                    <CardHeader className="pb-3 border-b">
                                        <CardTitle className="text-base">Team</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={project.project_head?.avatar_url || ""} />
                                                <AvatarFallback>
                                                    {project.project_head ? `${project.project_head.first_name[0]}${project.project_head.last_name[0]}` : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {project.project_head
                                                        ? `${project.project_head.first_name} ${project.project_head.last_name}`
                                                        : "Unassigned Lead"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">Project Head</span>
                                            </div>
                                        </div>
                                        {/* Future: Add more team members list here */}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
