import useApi from "../core/requests/useApi";

export interface Publisher {
    Id: number
    Name: string
    Surname: string
}

export default function usePublishersApi() {
    const api = useApi<Publisher>({ feature: 'Publisher' })

    return {
        ...api
    }

}