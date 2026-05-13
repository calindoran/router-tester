import { type Cell, type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GenericDataTableProps<TData> = {
  rows: TData[];
  columns: ColumnDef<TData>[];
  emptyMessage: string;
  onRowActivate?: (row: TData) => void;
  getRowAriaLabel?: (row: TData) => string;
  getCellClassName?: (cell: Cell<TData, unknown>) => string | undefined;
  rowClassName?: string;
};

function GenericDataTable<TData>({
  rows,
  columns,
  emptyMessage,
  onRowActivate,
  getRowAriaLabel,
  getCellClassName,
  rowClassName,
}: GenericDataTableProps<TData>) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="border-b border-border">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length}>{emptyMessage}</TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              tabIndex={onRowActivate ? 0 : undefined}
              className={onRowActivate ? `${rowClassName ?? ""} cursor-pointer`.trim() : rowClassName}
              onClick={onRowActivate ? () => onRowActivate(row.original) : undefined}
              onKeyDown={
                onRowActivate
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowActivate(row.original);
                      }
                    }
                  : undefined
              }
              aria-label={getRowAriaLabel ? getRowAriaLabel(row.original) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={getCellClassName?.(cell)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default GenericDataTable;