import AdminLayout from "../core/layouts/AdminLayout";
import usePublishersApi, { Publisher } from "./usePublishersApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";
import { z } from 'zod'
import SimpleColumnFilter from "../core/table/SimpleColumnFilter";
import ServerDataTable from "../core/table/ServerDataTable";

const columnHelper = createColumnHelper<Publisher>()
const DEFAULT_PAGE_INDEX = 0
const DEFAULT_PAGE_SIZE = 2

export default function PublishersListPage() {
    const { t } = useTranslation()
    const api = usePublishersApi()
    const columns = useMemo(() => [
        columnHelper.accessor('Id', {
            meta: {
                filterContent: (column) => <SimpleColumnFilter
                    column={column}
                    criteria="equals"
                    inputType="number"
                    prop="Id"
                    placeholder={t("model.id")}
                    validators={{
                        onChange: z.number({
                            required_error: t('validation.required')
                        }).min(1, t('validation.min', { number: 1 }))
                    }}
                />
            }
        }),
        columnHelper.accessor('Name', {
            meta: {
                filterContent: (column) => <SimpleColumnFilter
                    column={column}
                    criteria="startsWith"
                    inputType="string"
                    prop="Name"
                    placeholder={t("model.name")}
                    validators={{
                        onChange: z.string({
                            required_error: t('validation.required')
                        })
                    }}
                />
            }
        }),
        columnHelper.accessor('Surname', {
            meta: {
                filterContent: (column) => <SimpleColumnFilter
                    column={column}
                    criteria="startsWith"
                    inputType="string"
                    prop="Surname"
                    placeholder={t("model.surname")}
                    validators={{
                        onChange: z.string({
                            required_error: t('validation.required')
                        })
                    }}
                />
            }
        })
    ], [])
    
    return <AdminLayout>
        <ServerDataTable
            api={api}
            columnsDefs={columns}
            options={{
                withTableBorder:true, 
                striped: true,
                highlightOnHover: true,
            }}
            initialState={{
                pagination: {
                    pageIndex: DEFAULT_PAGE_INDEX,
                    pageSize: DEFAULT_PAGE_SIZE
                }
            }}
        />
    </AdminLayout>
}