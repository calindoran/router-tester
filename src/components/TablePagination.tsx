import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TablePaginationProps = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  onPageIndexChange: (nextPageIndex: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
  pageSizeOptions?: number[];
};

function TablePagination({
  pageIndex,
  pageCount,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: TablePaginationProps) {
  const rowsPerPageId = React.useId();
  const safePageCount = Math.max(1, pageCount);
  const safePageIndex = Math.min(Math.max(0, pageIndex), safePageCount - 1);

  return (
    <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => onPageIndexChange(Math.max(0, safePageIndex - 1))}
          disabled={safePageIndex === 0}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => onPageIndexChange(Math.min(safePageCount - 1, safePageIndex + 1))}
          disabled={safePageIndex + 1 >= safePageCount}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
        <Badge variant="outline" className="ml-1 sm:ml-3">
          Page {safePageIndex + 1} of {safePageCount}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground" htmlFor={rowsPerPageId}>
          Rows:
        </label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            const nextPageSize = Number(value);
            onPageSizeChange(nextPageSize);
            onPageIndexChange(0);
          }}
        >
          <SelectTrigger id={rowsPerPageId} className="w-20">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default TablePagination;