import { Stack, TextInput } from "@mantine/core";
import AdminLayout from "../core/layouts/AdminLayout";
import ServerDataForm from "../core/form/ServerDataForm";
import usePublishersApi, { Publisher } from "./usePublishersApi";
import renderFieldErrors from "../core/form/renderFieldErrors";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function PublishersSavePage() {
    const { t } = useTranslation()
    const api = usePublishersApi()
    const id = 3
    const query = useQuery({
        queryKey: ['publishers', id],
        queryFn: () => api.read({ filter: 'Id eq 3' })
    })
    const mutation = useMutation({
        mutationFn: (item: Partial<Publisher>) => api.update(item, id)
    })


    return <AdminLayout>
        <ServerDataForm<Publisher>
            query={query}
            mutation={mutation}
        >
            {(form) => <Stack>
                <form.Field
                    name="Name"
                    defaultValue=""
                    validators={{
                        onChange: z
                            .string()
                            .min(1, t("validation.required"))
                            .max(200, t('validation.maxLength', { value: 200 }))
                    }}
                >
                    {field => <TextInput
                        label={t('model.name')}
                        value={field.state.value ?? ''}
                        error={renderFieldErrors(field.state.meta.errors)}
                        onChange={(e) => field.handleChange(e.target.value)}
                    />}
                </form.Field>

                <form.Field
                    name="Name"
                    defaultValue=""
                    validators={{
                        onChange: z
                            .string()
                            .min(1, t("validation.required"))
                            .max(200, t('validation.maxLength', { value: 200 }))
                    }}
                >
                    {field => <TextInput
                        label={t('model.name')}
                        value={field.state.value ?? ''}
                        error={renderFieldErrors(field.state.meta.errors)}
                        onChange={(e) => field.handleChange(e.target.value)}
                    />}
                </form.Field>

            </Stack>}
        </ServerDataForm>
    </AdminLayout>
}