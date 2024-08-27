import { useFetch } from "@mantine/hooks";
import useApi from "../core/requests/useApi";
import dayjs from "dayjs";

export default function useFetchMeetingEventsApi() {
    const api = useApi({ feature: 'FetchMeetingEvents' })

    function get(weekDate: Date) {
        return api.axiosInstance.get(`${dayjs(weekDate).format('YYYY-MM-DD')}`).then(r => r.data)
    }

    return {
        get
    }
}