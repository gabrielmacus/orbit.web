import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../core/layouts/AdminLayout";
import usePublishersApi, { Publisher } from "./usePublishersApi";
import { useTranslation } from "react-i18next";
import DataTable from "../core/table/DataTable";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Publisher>()

export default function PublishersListPage() {

    const { t } = useTranslation()
    const api = usePublishersApi()
    const query = useQuery({
        queryKey: ['publishers'],
        queryFn: () => api.read()
    })

    const table = useReactTable({
        columns: [
            columnHelper.accessor('Id',{}),
            columnHelper.accessor('Name', {}),
            columnHelper.accessor('Surname', {})
        ],
        data: query.data?.value ?? [],
        getCoreRowModel: getCoreRowModel()
    })

    return <AdminLayout>
        <DataTable table={table} />
    </AdminLayout>
}