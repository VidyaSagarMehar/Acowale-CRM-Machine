import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper } from "@/components/ui/table";
import { formatCategoryLabel, formatDate } from "@/lib/utils";
import type { FeedbackRecord } from "@/types/feedback";

export function FeedbackTable({ items }: { items: FeedbackRecord[] }) {
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Rating</TableHeader>
            <TableHeader>Comment</TableHeader>
            <TableHeader>Created At</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatCategoryLabel(item.category)}</TableCell>
              <TableCell>{item.rating}/5</TableCell>
              <TableCell className="max-w-xs whitespace-normal text-muted-foreground">{item.comment}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
