import axios, { AxiosError, AxiosInstance } from "axios";
import { serialize } from "object-to-formdata";

export interface BaseModel {
    Id: number
    CreatedAt: Date
    UpdatedAt: Date
}

export interface Query {
    $count?: boolean
    $top?: number
    $skip?: number
    $expand?: string[]
    $orderby?: string[]
    $filter?: string[]
    $apply?: string[]
    $select?: string[]
}

export interface ODataResponse<T> {
    "@odata.count"?: number
    value: T
}

export type GroupResponse<T> = T & {
    $count: number
}

export type CreateOperation<T> = {
    create: (data: T, multipart?: boolean) => Promise<ODataResponse<T>>
}

export interface ReadOperation<T> {
    //read: (query?: Query, extraQs?: string[], path?: string) => Promise<ODataResponse<T[]>>
    read: (query?: Query, extraQs?: string[], path?: string) => Promise<ODataResponse<T[]>>
    readById: (id: number, query?: Query) => Promise<T>
}

export interface UpdateOperation<T> {
    update: (data: Partial<T>, id: number, multipart?: boolean, replace?: boolean) => Promise<void>
}

export interface DeleteOperation {
    deleteById: (id: number) => Promise<void>
}

export interface Api<T> extends CreateOperation<T>, ReadOperation<T>, UpdateOperation<T>, DeleteOperation {
    axiosInstance: AxiosInstance
}

export interface ApiProps {
    feature: string
}

export default function useApi<T>(props: ApiProps): Api<T> {
    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}`,
        withCredentials: true
    })

    const queryToString = (query: Query) => {
        let qs: string[] = [];

        if (query.$count) {
            qs.push("$count=true");
        }
        if (query.$expand && query.$expand.length) {
            qs.push(`$expand=${query.$expand.join(",")}`);
        }
        if (query.$skip) {
            qs.push(`$skip=${query.$skip}`);
        }
        if (query.$top != undefined) {
            qs.push(`$top=${query.$top}`);
        }

        if (query.$orderby != undefined && query.$orderby.length > 0) {
            qs.push(`$orderby=${query.$orderby.join(",")}`);
        }
        /*
        if (!query.$orderby || query.$orderby.length == 0) {
            query.$orderby = ['Id asc'];
        }
        qs.push(`$orderby=${query.$orderby.join(",")}`)*/

        if (query.$filter && query.$filter.length > 0) {
            qs.push(`$filter=${query.$filter.join(" and ")}`);
        }

        if (query.$apply != undefined && query.$apply.length > 0) {
            qs.push(`$apply=${query.$apply.join("/")}`);
        }

        if (query.$select != undefined && query.$select.length > 0) {
            qs.push(`$select=${query.$select.join(",")}`)
        }

        return qs.join("&");
    };

    return {
        axiosInstance,
        create(data: T, multipart?: boolean) {
            let dataToSend = multipart ? serialize(data, { indices: true }) : data
            const contentType = multipart ? 'multipart/form-data' : 'application/json'
            return axiosInstance.post<ODataResponse<T>>(
                `odata/${props.feature}`,
                dataToSend,
                {
                    headers: { 'Content-Type': contentType }
                }).then(r => r.data)
        },
        read<T>(query?: Query, extraQs?: string[], path?: string) {
            let qs = queryToString(query ?? {})
            if (extraQs && extraQs.length) {
                qs += `&${extraQs.join("&")}`
            }
            const url = path ? `odata/${props.feature}/${path}?${qs}` : `odata/${props.feature}?${qs}`
            return axiosInstance.get<T>(url).then(r => r.data)
        },
        readById<T>(id: number, query?: Query) {
            const qs = queryToString(query ?? {})
            const url = `odata/${props.feature}/${id}?${qs}`
            return axiosInstance.get<T>(url).then(r => r.data)
        },
        update(data: Partial<T>, id: number, multipart?: boolean, replace?: boolean) {
            let dataToSend = multipart ? serialize(data, { indices: true }) : data
            const contentType = multipart ? 'multipart/form-data' : 'application/json'
            return axiosInstance(
                `odata/${props.feature}/${id}`,
                {
                    data: dataToSend,
                    method: replace ? 'put' : 'patch',
                    headers: { 'Content-Type': contentType }
                }).then(r => r.data)
        },
        deleteById(id: number) {
            return axiosInstance.delete(`odata/${props.feature}/${id}`).then(r => r.data)

        }
    }
}