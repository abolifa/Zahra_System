"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Brand } from "@prisma/client"
import FormHeading from "@/components/FormHeading"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import toast from "react-hot-toast"
import ImageUploader from "@/components/ImageUploader"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50),
    mediaId: z.string().nullable(),
})

const page = () => {
    const params = useParams<{ id: string }>();
    const [data, setData] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            mediaId: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (params.id === "new") {
                setLoading(false);
                return;
            }

            loading === false ? setLoading(true) : null;
            try {
                const res = await api.get(`/brands/${params.id}`);
                setData(res.data);
                form.reset(res.data);
            } catch (error) {
                console.error("Failed to fetch brand data:", error);
                toast.error("Failed to load brand details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                name: values.name,
                slug: values.slug,
                mediaId: values.mediaId,
            };

            if (data) {
                await api.put(`/brands/${params.id}`, payload);
                toast.success("Brand updated successfully.");
                router.push("/brands");
            } else {
                await api.post("/brands", payload);
                toast.success("Brand created successfully.");
                router.push("/brands");
            }
        } catch (error) {
            console.error("Error in form submission:", error);
            toast.error("Failed to save brand.");
        }
    };

    const handleImageUploadSuccess = (id: string | null) => {
        form.setValue("mediaId", id);
    };

    return (
        <div className="space-y-5">
            <FormHeading title="Brand" subTitle="Create a new brand" action="brands" id={params.id} />
            <Separator />
            <div className="p-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 max-w-xl">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input  {...field} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input  {...field} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <ImageUploader onUploadSuccess={handleImageUploadSuccess} existingImage={data?.mediaId} />
                        </div>
                        <Button disabled={loading} type="submit">Save</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page