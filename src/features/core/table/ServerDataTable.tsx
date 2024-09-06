import { ColumnDef, getCoreRowModel, InitialTableState, TableState, useReactTable } from "@tanstack/react-table"
import DataTable from "./DataTable"
import { useMemo, useState } from "react"
import { GroupResponse, ODataResponse, ReadOperation } from "../requests/useApi"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { TableProps } from "@mantine/core"
import { QueryOptions } from "odata-query"

export interface ServerDataTableProps<T> {
    columnsDefs: ColumnDef<T>[]
    initialState?: InitialTableState
    options?: TableProps,
    api: ReadOperation<T>
}

export default function ServerDataTable<T>(props: ServerDataTableProps<T>) {
    const table = useReactTable({
        columns: props.columnsDefs,
        data: [],
        getCoreRowModel: getCoreRowModel(),
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        manualGrouping: true,
        debugAll: true,
        initialState: props.initialState
    })

    const [tableState, setTableState] = useState<TableState>({
        ...table.initialState,
    })

    const apiQuery: Partial<QueryOptions<T>> = {
        filter: tableState.columnFilters.map(f => f.value).flat(1) as string[],
        orderBy: tableState.sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`).join(','),
        top: tableState.pagination.pageSize,
        skip: tableState.pagination.pageIndex * tableState.pagination.pageSize,
        count: true,
        transform: tableState.grouping.length > 0 ? {
            groupBy: {
                properties: tableState.grouping,
                transform: {
                    aggregate: {
                        $count: {
                            as: '$count'
                        }
                    }
                }
            }
        } : undefined

        /*
        $filter: tableState.columnFilters.map(f => f.value).flat(1) as string[],
        $orderby: tableState.sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`),
        $top: tableState.pagination.pageSize,
        $skip: tableState.pagination.pageIndex * tableState.pagination.pageSize,
        $count: true,
        $apply: tableState.grouping.length > 0 ?
            [`groupby((${tableState.grouping.join(',')}),aggregate($count as $count))`] :
            undefined*/
    }

    const query = useQuery({
        //initialData: { value: [] },
        queryKey: ['publishers', apiQuery],
        queryFn: () => props.api.read(apiQuery),
        placeholderData: keepPreviousData
    })

    const data = useMemo(() => {
        return query.data?.value ?? []
    }, [query.data])

    const rowCount = useMemo(() => {
        return query.data?.["@odata.count"]
    }, [query.data])

    table.setOptions(prev => ({
        ...prev,
        ...{
            onStateChange: (updater) => {
                const newTableState = updater instanceof Function ?
                    updater(tableState) : updater
                const filtersChanged = newTableState.columnFilters != tableState.columnFilters
                setTableState({
                    ...newTableState,
                    ...{
                        pagination: {
                            ...newTableState.pagination,
                            ...{
                                pageIndex: filtersChanged ? 0 : newTableState.pagination.pageIndex
                            }
                        }
                    }
                })
            },
            data,
            rowCount,
            state: tableState
        }
    }))

    return <DataTable
        options={props.options}
        table={table}
    />
}