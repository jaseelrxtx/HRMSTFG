import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MonthlyLeaveTrend {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface DepartmentUsage {
  department: string;
  totalDays: number;
  employeeCount: number;
}

export interface LeaveTypeDistribution {
  name: string;
  code: string;
  totalDays: number;
  percentage: number;
}

export interface BalanceSummary {
  totalEntitled: number;
  totalUsed: number;
  totalAvailable: number;
  utilizationRate: number;
}

export function useLeaveAnalytics() {
  const currentYear = new Date().getFullYear();

  return useQuery({
    queryKey: ["leave-analytics", currentYear],
    queryFn: async () => {
      // Fetch all approved leave applications for the current year
      const { data: applications, error: appError } = await supabase
        .from("leave_applications")
        .select(`
          id,
          days_count,
          start_date,
          status,
          created_at,
          leave_types (
            id,
            name,
            code
          ),
          employees!leave_applications_employee_id_fkey (
            id,
            department_id,
            departments (
              id,
              name
            )
          )
        `)
        .gte("start_date", `${currentYear}-01-01`)
        .lte("start_date", `${currentYear}-12-31`);

      if (appError) throw appError;

      // Fetch leave balances
      const { data: balances, error: balError } = await supabase
        .from("leave_balances")
        .select(`
          entitled_days,
          used_days,
          carried_forward_days,
          adjusted_days
        `)
        .eq("year", currentYear);

      if (balError) throw balError;

      // Calculate monthly trends
      const monthlyData: Record<string, { approved: number; pending: number; rejected: number }> = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((m) => {
        monthlyData[m] = { approved: 0, pending: 0, rejected: 0 };
      });

      applications?.forEach((app) => {
        const month = new Date(app.start_date).getMonth();
        const monthName = months[month];
        const status = app.status as "approved" | "pending" | "rejected";
        if (status in monthlyData[monthName]) {
          monthlyData[monthName][status] += Number(app.days_count);
        }
      });

      const monthlyTrends: MonthlyLeaveTrend[] = months.map((m) => ({
        month: m,
        ...monthlyData[m],
      }));

      // Calculate department usage
      const deptData: Record<string, { totalDays: number; employees: Set<string> }> = {};
      applications
        ?.filter((app) => app.status === "approved")
        .forEach((app) => {
          const employees = app.employees as { department_id: string | null; departments: { name: string } | null } | null;
          const deptName = employees?.departments?.name || "Unassigned";
          const empId = (app.employees as { id: string } | null)?.id;

          if (!deptData[deptName]) {
            deptData[deptName] = { totalDays: 0, employees: new Set() };
          }
          deptData[deptName].totalDays += Number(app.days_count);
          if (empId) deptData[deptName].employees.add(empId);
        });

      const departmentUsage: DepartmentUsage[] = Object.entries(deptData)
        .map(([department, data]) => ({
          department,
          totalDays: Math.round(data.totalDays),
          employeeCount: data.employees.size,
        }))
        .sort((a, b) => b.totalDays - a.totalDays);

      // Calculate leave type distribution
      const typeData: Record<string, { name: string; code: string; totalDays: number }> = {};
      applications
        ?.filter((app) => app.status === "approved")
        .forEach((app) => {
          const leaveType = app.leave_types as { id: string; name: string; code: string } | null;
          const typeId = leaveType?.id || "unknown";
          if (!typeData[typeId]) {
            typeData[typeId] = {
              name: leaveType?.name || "Unknown",
              code: leaveType?.code || "??",
              totalDays: 0,
            };
          }
          typeData[typeId].totalDays += Number(app.days_count);
        });

      const totalApprovedDays = Object.values(typeData).reduce((sum, t) => sum + t.totalDays, 0);
      const leaveTypeDistribution: LeaveTypeDistribution[] = Object.values(typeData)
        .map((t) => ({
          ...t,
          totalDays: Math.round(t.totalDays),
          percentage: totalApprovedDays > 0 ? Math.round((t.totalDays / totalApprovedDays) * 100) : 0,
        }))
        .sort((a, b) => b.totalDays - a.totalDays);

      // Calculate balance summary
      const totalEntitled = balances?.reduce(
        (sum, b) => sum + Number(b.entitled_days) + Number(b.carried_forward_days) + Number(b.adjusted_days),
        0
      ) || 0;
      const totalUsed = balances?.reduce((sum, b) => sum + Number(b.used_days), 0) || 0;

      const balanceSummary: BalanceSummary = {
        totalEntitled: Math.round(totalEntitled),
        totalUsed: Math.round(totalUsed),
        totalAvailable: Math.round(totalEntitled - totalUsed),
        utilizationRate: totalEntitled > 0 ? Math.round((totalUsed / totalEntitled) * 100) : 0,
      };

      return {
        monthlyTrends,
        departmentUsage,
        leaveTypeDistribution,
        balanceSummary,
        totalApplications: applications?.length || 0,
        approvedApplications: applications?.filter((a) => a.status === "approved").length || 0,
      };
    },
  });
}

export interface EmployeeLeaveStats {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  totalEntitled: number;
  totalUsed: number;
  totalBalance: number;
  pendingRequests: number;
  dateOfJoining: string;
  totalWorkingDays: number;
  leaveTaken: number;
  attendancePercentage: number;
}

export function useAllEmployeeLeaveStats() {
  const currentYear = new Date().getFullYear();

  return useQuery({
    queryKey: ["all-employee-leave-stats", currentYear],
    queryFn: async (): Promise<EmployeeLeaveStats[]> => {
      // 1. Fetch all active employees
      const { data: employees, error: empError } = await supabase
        .from("employees")
        .select(`
          id,
          date_of_joining,
          profiles!employees_user_id_profiles_fkey (
            first_name,
            last_name
          ),
          departments (
            name
          )
        `)
        .eq("is_active", true);

      if (empError) throw empError;

      // 2. Fetch leave balances for all employees for the current year
      const { data: balances, error: balError } = await supabase
        .from("leave_balances")
        .select(`
          employee_id,
          entitled_days,
          used_days,
          carried_forward_days,
          adjusted_days
        `)
        .eq("year", currentYear);

      if (balError) throw balError;

      // 3. Fetch pending leave applications
      const { data: pendingApps, error: appError } = await supabase
        .from("leave_applications")
        .select("employee_id")
        .eq("status", "pending");

      if (appError) throw appError;

      // Helper function to calculate working days
      const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
        let count = 0;
        const curDate = new Date(startDate);
        while (curDate <= endDate) {
          const dayOfWeek = curDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          const date = curDate.getDate();

          // Sunday is always off
          if (dayOfWeek === 0) {
            curDate.setDate(curDate.getDate() + 1);
            continue;
          }

          // Saturday check
          if (dayOfWeek === 6) {
            // Check if 2nd or 4th Saturday
            // To find if it's Nth saturday, we can check date ranges?
            // Or simpler: count saturdays in the month?
            // Actually, "2nd Saturday" means it is between 8th and 14th
            // "4th Saturday" means it is between 22nd and 28th
            // Let's verify:
            // 1st Sat: 1-7
            // 2nd Sat: 8-14
            // 3rd Sat: 15-21
            // 4th Sat: 22-28
            // 5th Sat: 29-31

            if ((date >= 8 && date <= 14) || (date >= 22 && date <= 28)) {
              // It is 2nd or 4th Saturday - Leave
              curDate.setDate(curDate.getDate() + 1);
              continue;
            }
          }

          // Otherwise, it's a working day (Mon-Fri, or 1st/3rd/5th Sat)
          count++;
          curDate.setDate(curDate.getDate() + 1);
        }
        return count;
      };

      const yearStart = new Date(currentYear, 0, 1);
      const today = new Date(); // Use today as end date for calculation context
      // If today is in next year (unlikely given hook logic, but safe guard), cap at end of year
      const yearEnd = new Date(currentYear, 11, 31);
      const calculationEndDate = today > yearEnd ? yearEnd : today;

      // 4. Aggregate data
      const statsMap = new Map<string, EmployeeLeaveStats>();

      // Initialize with employee data
      employees?.forEach((emp) => {
        const profile = emp.profiles as { first_name: string; last_name: string } | null;
        const department = emp.departments as { name: string } | null;

        // Determine start date for working days calculation
        // Max(Start of Year, Date of Joining)
        const joinDate = new Date(emp.date_of_joining);
        const effectiveStartDate = joinDate > yearStart ? joinDate : yearStart;

        // If effective start date is after calculation end date (joined in future?), 0 working days
        const workingDays = effectiveStartDate > calculationEndDate
          ? 0
          : calculateWorkingDays(effectiveStartDate, calculationEndDate);

        statsMap.set(emp.id, {
          employeeId: emp.id,
          employeeName: profile ? `${profile.first_name} ${profile.last_name}` : "Unknown",
          departmentName: department?.name || "Unassigned",
          totalEntitled: 0,
          totalUsed: 0,
          totalBalance: 0,
          pendingRequests: 0,
          dateOfJoining: emp.date_of_joining,
          totalWorkingDays: workingDays,
          leaveTaken: 0, // Will be updated from balances
          attendancePercentage: 0, // Will be calculated after balance update
        });
      });

      // Add balance data
      balances?.forEach((bal) => {
        const stats = statsMap.get(bal.employee_id);
        if (stats) {
          const entitled = Number(bal.entitled_days) + Number(bal.carried_forward_days) + Number(bal.adjusted_days);
          const used = Number(bal.used_days);

          stats.totalEntitled += entitled;
          stats.totalUsed += used;
          stats.totalBalance += (entitled - used);
          stats.leaveTaken += used;
        }
      });

      // Add pending request counts
      pendingApps?.forEach((app) => {
        const stats = statsMap.get(app.employee_id);
        if (stats) {
          stats.pendingRequests += 1;
        }
      });

      // Final pass to calculate percentage
      statsMap.forEach((stat) => {
        if (stat.totalWorkingDays > 0) {
          const presentDays = stat.totalWorkingDays - stat.leaveTaken;
          stat.attendancePercentage = (presentDays / stat.totalWorkingDays) * 100;
        } else {
          stat.attendancePercentage = 0; // Or 100? If 0 working days, 0% seems safer or N/A
          // If they just joined today, working days might be 1.
          if (stat.totalWorkingDays === 0) stat.attendancePercentage = 100; // Edge case: joined today, 0 working days passed? No, loop includes start date. 
          // If joined tomorrow, working days = 0.
        }
      });

      return Array.from(statsMap.values());
    },
  });
}
