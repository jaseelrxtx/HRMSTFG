import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAllEmployeeLeaveStats } from "@/hooks/useLeaveAnalytics";
import { useDepartments } from "@/hooks/useDepartments";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ShieldAlert, Search, FileDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaveStatistics() {
    const { role } = useAuth();
    const { data: stats, isLoading: statsLoading } = useAllEmployeeLeaveStats();
    const { data: departments } = useDepartments();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const isAdminOrHR = role === "admin" || role === "hr";

    if (!isAdminOrHR) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                    <ShieldAlert className="mb-6 h-16 w-16 text-muted-foreground/50" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground max-w-md mb-6">
                        You do not have permission to view this page.
                    </p>
                    <Link to="/dashboard">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const filteredStats = stats?.filter((stat) => {
        const matchesSearch = stat.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === "all" || stat.departmentName === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const exportToCSV = () => {
        if (!filteredStats) return;

        const headers = ["Employee Name", "Department", "Total Entitled", "Total Used", "Balance", "Working Days", "Leave Taken", "Attendance %", "Pending Requests"];
        const csvContent = [
            headers.join(","),
            ...filteredStats.map(stat => [
                `"${stat.employeeName}"`,
                `"${stat.departmentName}"`,
                `"${stat.departmentName}"`,
                stat.totalEntitled,
                stat.totalUsed,
                stat.totalBalance,
                stat.totalWorkingDays,
                stat.leaveTaken,
                `${stat.attendancePercentage.toFixed(1)}%`,
                stat.pendingRequests
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `leave_statistics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Leave Statistics</h1>
                        <p className="text-muted-foreground">Comprehensive leave data for all employees</p>
                    </div>
                    <Button onClick={exportToCSV} variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Employee Leave Overview</CardTitle>
                                <CardDescription>
                                    Showing {filteredStats?.length || 0} employees
                                </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search employees..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {departments && (
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger className="w-full sm:w-48">
                                            <SelectValue placeholder="Filter by Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                ))}
                            </div>
                        ) : !filteredStats?.length ? (
                            <div className="py-12 text-center text-muted-foreground">
                                No employees found matching your filters.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead className="text-right">Total Entitled</TableHead>
                                            <TableHead className="text-right">Used</TableHead>
                                            <TableHead className="text-right">Balance</TableHead>
                                            <TableHead className="text-right">Working Days</TableHead>
                                            <TableHead className="text-right">Leave Taken</TableHead>
                                            <TableHead className="text-right">Attendance %</TableHead>
                                            <TableHead className="text-center">Pending Requests</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStats.map((stat) => (
                                            <TableRow key={stat.employeeId}>
                                                <TableCell className="font-medium">{stat.employeeName}</TableCell>
                                                <TableCell>{stat.departmentName}</TableCell>
                                                <TableCell className="text-right">{stat.totalEntitled}</TableCell>
                                                <TableCell className="text-right">{stat.totalUsed}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">{stat.totalBalance}</TableCell>
                                                <TableCell className="text-right">{stat.totalWorkingDays}</TableCell>
                                                <TableCell className="text-right">{stat.leaveTaken}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={stat.attendancePercentage >= 95 ? "default" : stat.attendancePercentage >= 90 ? "secondary" : "destructive"}
                                                        className={cn(
                                                            stat.attendancePercentage >= 95 && "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
                                                            stat.attendancePercentage >= 90 && stat.attendancePercentage < 95 && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
                                                            stat.attendancePercentage < 90 && "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                                                        )}
                                                    >
                                                        {stat.attendancePercentage.toFixed(1)}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {stat.pendingRequests > 0 ? (
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                                                            {stat.pendingRequests} Pending
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
