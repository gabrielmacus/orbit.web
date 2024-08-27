import { useState } from "react";
import WeekPickerInput from "../core/form/WeekPickerInput";
import AdminLayout from "../core/layouts/AdminLayout";
import i18n from "../core/i18n/i18n";
import useFetchMeetingEventsApi from "../fetch-meeting-events/useFetchMeetingEventsApi";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function MeetingPage() {
    const { t } = i18n
    const fetchMeetingEventsApi = useFetchMeetingEventsApi()

    const [date, setDate] = useState<Date>()
    
    const meetingEventsQuery = useQuery({
        queryKey: ['meetingEvents', date],
        queryFn: () => fetchMeetingEventsApi.get(date!),
        enabled: !!date
    })




    return <AdminLayout>
        <WeekPickerInput onChange={setDate} valueFormat={t("date.format")} value={date} />
        
    </AdminLayout>
}