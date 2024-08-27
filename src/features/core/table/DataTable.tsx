import { ActionIcon, Button, Table as MTable, Popover } from "@mantine/core";
import { IconCaretUpDown, IconCaretUpDownFilled, IconFilterFilled, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { flexRender, Table } from "@tanstack/react-table";
import clsx from 'clsx';


export interface DataTableProps<T> {
    table: Table<T>
}

export default function DataTable<T>(props: DataTableProps<T>) {

    const headerGroups = props.table.getHeaderGroups()
        .map(tr => <MTable.Tr key={tr.id}>
            {tr.headers.map(th => <MTable.Th
                className="select-none"
                colSpan={th.colSpan}
                key={th.id}
            >
                <div className="flex gap-2 items-center"
                >
                    {flexRender(th.column.columnDef.header, th.getContext())}
                    {th.column.getCanSort() && <IconCaretUpDownFilled
                        size={18}
                        onClick={() => th.column.toggleSorting()}
                        className={clsx(' cursor-pointer fill-gray-200 dark:fill-gray-500', {
                            '[&>*:nth-child(1)]:fill-primary-600 dark:[&>*:nth-child(1)]:fill-primary-400':
                                th.column.getIsSorted() == 'asc',
                            '[&>*:nth-child(2)]:fill-primary-600 dark:[&>*:nth-child(2)]:fill-primary-400':
                                th.column.getIsSorted() == 'desc'
                        })} />}

                    {th.column.getCanFilter() && <Popover withArrow shadow="lg">
                        <Popover.Target>
                            <IconFilterFilled
                                size={18}
                                className={clsx(' cursor-pointer fill-gray-200 dark:fill-gray-500', {
                                    'fill-primary-600 dark:fill-primary-400': th.column.getIsFiltered()
                                })}
                            />
                        </Popover.Target>
                        <Popover.Dropdown className="bg-gray-200 dark:bg-gray-200">
                                aasd
                        </Popover.Dropdown>
                    </Popover>}
                </div>
            </MTable.Th>)}
        </MTable.Tr>)

    const rows = props.table.getRowModel().rows
        .map(row => <MTable.Tr key={row.id}>
            {row.getVisibleCells().map(cell =>
                <MTable.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</MTable.Td>
            )}
        </MTable.Tr>)

    return <MTable>
        <MTable.Thead>
            {headerGroups}
        </MTable.Thead>
        <MTable.Tbody>
            {rows}
        </MTable.Tbody >
    </MTable >

}