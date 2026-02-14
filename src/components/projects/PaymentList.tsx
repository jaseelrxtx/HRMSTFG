import { useProjectPayments } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PaymentListProps {
    projectId: string;
}

export function PaymentList({ projectId }: PaymentListProps) {
    const { data: payments, isLoading } = useProjectPayments(projectId);

    if (isLoading) return <div>Loading payments...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments (Admin Only)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Notes</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No payment records found.</TableCell>
                            </TableRow>
                        )}
                        {payments?.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.notes || "-"}</TableCell>
                                <TableCell className="font-medium">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.amount)}
                                </TableCell>
                                <TableCell>
                                    {payment.due_date ? format(new Date(payment.due_date), "MMM d, yyyy") : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'overdue' ? 'destructive' : 'secondary'}>
                                        {payment.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
