"use client";

import { Brand, Media } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { queryClient } from "../layout";
import Image from "next/image";


type BrandWithMedia = Brand & { media: Media };
export const columns: ColumnDef<BrandWithMedia>[] = [
    {
        accessorKey: 'mediaId',
        header: 'Media',
        cell: ({ row }) => {
            if (!row.original.media) {
                return (
                    <p className="text-muted-foreground text-xs">No media</p>
                )
            } else {
                return (
                    <Image src={row.original.media.url} width={80} height={80} alt="Brand Media" className="rounded-lg" />
                )
            }
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "created",
        header: "Created",
        cell: ({ row }) => {
            const createdAt = new Date(row.original.created);
            return isNaN(createdAt.getTime())
                ? "Invalid Date"
                : format(createdAt, "dd/MM/yyyy");
        },
    },
    {
        accessorKey: "updated",
        header: "Updated",
        cell: ({ row }) => {
            const updatedAt = new Date(row.original.updated);
            return isNaN(updatedAt.getTime())
                ? "Invalid Date"
                : format(updatedAt, "dd/MM/yyyy");
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter();
            const mutation = useMutation({
                mutationKey: ["brands"],
                mutationFn: async () => {
                    await api.delete(`/brands/${row.original.id}`);
                },
                onMutate: async () => {
                    toast.loading("Deleting brand...", { id: "delete-brand" });
                },
                onSuccess: () => {
                    toast.success("Brand deleted successfully", { id: "delete-brand" });
                },
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: ["brands"] });
                    toast.dismiss("delete-brand");
                },
            });


            return (
                <div className="flex items-center justify-end mr-3 gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/brands/${row.original.id}`)}>
                        <Edit />
                        Edit
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the brand and associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => mutation.mutate()}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];
