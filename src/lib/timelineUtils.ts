import { Project, ProjectMilestone } from "@/types/projects";

/**
 * Calculate the horizontal position percentage for a timeline item
 * @param itemDate - The date of the item to position
 * @param projectStart - Project start date
 * @param projectEnd - Project end date
 * @returns Position as percentage (0-100)
 */
export function calculatePosition(
    itemDate: Date,
    projectStart: Date,
    projectEnd: Date
): number {
    const totalDuration = projectEnd.getTime() - projectStart.getTime();

    // Handle edge cases
    if (totalDuration <= 0) return 50; // If no duration, center it

    const itemOffset = itemDate.getTime() - projectStart.getTime();
    const position = (itemOffset / totalDuration) * 100;

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, position));
}

/**
 * Check if a milestone is delayed
 * @param deadline - Milestone deadline
 * @param status - Milestone status
 * @returns True if milestone is overdue
 */
export function isMilestoneDelayed(
    deadline: Date | string,
    status: string
): boolean {
    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    return new Date() > deadlineDate && status !== 'completed';
}

/**
 * Check if a project is delayed
 * @param project - Project object with milestones
 * @returns True if project has any delays
 */
export function isProjectDelayed(project: Project): boolean {
    // Check if any milestone is delayed
    const hasDelayedMilestone = project.milestones?.some(m =>
        isMilestoneDelayed(new Date(m.deadline), m.status)
    ) || false;

    // Check if project is past end date and not completed
    const isPastEndDate =
        project.end_date &&
        new Date() > new Date(project.end_date) &&
        project.status !== 'completed';

    return hasDelayedMilestone || isPastEndDate;
}

/**
 * Get color for milestone based on status and deadline
 * @param milestone - Milestone object
 * @returns Tailwind color class
 */
export function getMilestoneColor(milestone: ProjectMilestone): string {
    if (milestone.status === 'completed') return 'bg-green-500';
    if (isMilestoneDelayed(milestone.deadline, milestone.status)) return 'bg-red-500';
    return 'bg-gray-400';
}

/**
 * Get color for payment based on status
 * @param status - Payment status
 * @returns Tailwind color class
 */
export function getPaymentColor(status: string): string {
    switch (status) {
        case 'paid':
            return 'text-green-500';
        case 'overdue':
            return 'text-red-500';
        case 'pending':
        default:
            return 'text-yellow-500';
    }
}

/**
 * Format date range for display
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} → ${end.toLocaleDateString('en-US', options)}`;
}
