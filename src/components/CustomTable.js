import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { useTable, TableHeaderGroup, TableHeader, TableRow, TableCell, PaginationFooter } from '@adsk/alloy-react-table';

const CustomTable = ({ data, columns, pagination, setPagination, totalRecords }) => {
    const columnHelper = createColumnHelper();
    const columnAccessors = columns.map((column) => {
        const accessor = columnHelper.accessor(column, {
            id: column,
            cell: (info) => info.getValue(),
        });
        return accessor;
    });
        
    // const columns = useMemo(() => columnAccessors, [columnAccessors]);
    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({ 
        columns: columnAccessors, 
        data, 
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            pagination
        }, 
        rowCount: totalRecords, // Corresponds to the totalResults
        onPaginationChange: setPagination,
    });

    const { getTableHeaderGroupProps, getTableHeaderProps, getTableRowProps, getTableCellProps } = useTable({ table });

    return (
        <div className="table-container">
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <TableHeaderGroup key={index} {...getTableHeaderGroupProps(headerGroup)}>
                            {headerGroup.headers.map((header, idx) => (
                                <TableHeader key={idx} {...getTableHeaderProps(header)} />
                            ))}
                        </TableHeaderGroup>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel()?.rows.map((row, index) => (
                        <TableRow key={index} {...getTableRowProps(row)}>
                            {row.getVisibleCells().map((cell, idx) => (
                                <TableCell key={idx} {...getTableCellProps(cell)} />
                            ))}
                        </TableRow>
                    ))}
                </tbody>
            </table>
            {data.length > 0 && (
                <PaginationFooter
                    className="pagination-footer"
                    canNextPage={table.getCanNextPage()}
                    canPreviousPage={table.getCanPreviousPage()}
                    setPageIndex={table.setPageIndex}
                    pageIndex={table.getState().pagination.pageIndex}
                    pageSize={table.getState().pagination.pageSize}
                    pageCount={table.getPageCount()}
                    totalDataCount={totalRecords}
                />
            )}
        </div>
    );
};

export default CustomTable;



