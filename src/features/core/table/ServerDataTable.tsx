import { ColumnDef, getCoreRowModel, InitialTableState, TableState, useReactTable } from "@tanstack/react-table"
import DataTable from "./DataTable"
import { useMemo, useState } from "react"
import { GroupResponse, ODataResponse, Query, ReadOperation } from "../requests/useApi"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { TableProps } from "@mantine/core"

export interface ServerDataTableProps<T> {
    columnsDefs: ColumnDef<T>[]
    api: ReadOperation
    initialState?: InitialTableState
    options?: TableProps
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

    const apiQuery: Query = {
        $filter: tableState.columnFilters.map(f => f.value).flat(1) as string[],
        $orderby: tableState.sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`),
        $top: tableState.pagination.pageSize,
        $skip: tableState.pagination.pageIndex * tableState.pagination.pageSize,
        $count: true,
        $apply: tableState.grouping.length > 0 ?
            [`groupby((${tableState.grouping.join(',')}),aggregate($count as $count))`] :
            undefined
    }

    console.log(tableState.grouping)

    const query = useQuery({
        //initialData: { value: [] },
        queryKey: ['publishers', apiQuery],
        queryFn: () => props.api.read<ODataResponse<T[]> | GroupResponse<T>[]>
            (apiQuery),
        placeholderData: keepPreviousData
    })
    
    const data = useMemo(() => {
        if (query.data && 'value' in query.data) return query.data.value
        if(query.data && '$count' in query.data) return query.data
        return []
    }, [query.data])

    const rowCount = useMemo(() => {
        if (query.data && 'value' in query.data) return query.data["@odata.count"]
        return undefined
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