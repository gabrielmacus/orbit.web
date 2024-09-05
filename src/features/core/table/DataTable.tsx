import { ActionIcon, Button, Table as MTable, Pagination, Popover, Stack, TableProps } from "@mantine/core";
import { IconCaretUpDown, IconCaretUpDownFilled, IconFilterFilled, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { Column, flexRender, RowData, Table } from "@tanstack/react-table";
import clsx from 'clsx';
import classes from './DataTable.module.scss'
import { createContext, useContext, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterContent?: (column: Column<TData, TValue>) =>
            React.ReactNode
    }
}

export interface DataTableProps<T> {
    table: Table<T>
    options?: TableProps
}

export const FilterPopoverContext = createContext<{ close: () => void }>(undefined!)
export function useFilterPopoverContext() {
    const context = useContext(FilterPopoverContext)
    if (!context)
        throw new Error('useFilterPopoverContext must be used within a FilterPopoverContext.Provider')
    return context
}
function FilterPopover<T>(props: { column: Column<T> }) {
    const [opened, setOpened] = useState(false)
    return <FilterPopoverContext.Provider value={{ close: () => setOpened(false) }}>
        <Popover onClose={() => setOpened(false)}
            opened={opened}
            keepMounted
            withArrow
            shadow="lg">
            <Popover.Target>
                <IconFilterFilled
                    onClick={() => setOpened(true)}
                    className={clsx(classes.columnAction, {
                        [classes.active]: props.column.getIsFiltered()
                    })}
                />
            </Popover.Target>
            <Popover.Dropdown className={classes.filterPopoverContent}>
                {props.column.columnDef.meta?.filterContent
                    ?.(props.column)}
            </Popover.Dropdown>
        </Popover>
    </FilterPopoverContext.Provider>
}

export default function DataTable<T>(props: DataTableProps<T>) {
    const headerGroups = props.table.getHeaderGroups()
        .map(tr => <MTable.Tr key={tr.id}>
            {tr.headers.map(th => <MTable.Th
                className="select-none"
                colSpan={th.colSpan}
                key={th.id} >
                <div className={classes.headerContent}
                >
                    {flexRender(th.column.columnDef.header, th.getContext())}
                    {th.column.getCanSort() && <IconCaretUpDownFilled
                        onClick={() => th.column.toggleSorting()}
                        className={clsx(classes.columnAction, {
                            [classes.activeTop]: th.column.getIsSorted() == 'asc',
                            [classes.activeBottom]: th.column.getIsSorted() == 'desc'
                        })} />}
                    {th.column.getCanFilter() &&
                        th.column.columnDef.meta?.filterContent &&
                        <FilterPopover column={th.column} />}
                    {th.column.getCanGroup() &&
                        <Button onClick={() => th.column.toggleGrouping()}>
                            G
                        </Button>}
                </div>
            </MTable.Th>)}
        </MTable.Tr>)

    const rows = props.table.getRowModel().rows
        .map(row => <MTable.Tr key={row.id}>
            {row.getVisibleCells().map(cell =>
                <MTable.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </MTable.Td>
            )}
        </MTable.Tr>)


    return <Stack gap={'md'}>
        <MTable {...props.options}>
            <MTable.Thead>
                {headerGroups}
            </MTable.Thead>
            <MTable.Tbody>
                {rows}
            </MTable.Tbody >
        </MTable>
        <Pagination
            total={props.table.getPageCount()}
            value={props.table.getState().pagination.pageIndex + 1}
            hideWithOnePage
            onChange={(value) => props.table.setPageIndex(value - 1)}
        />
    </Stack>

}