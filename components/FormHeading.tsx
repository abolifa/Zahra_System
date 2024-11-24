'use client'

import React, { FC } from 'react'
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
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryClient } from '@/app/(dashboard)/layout';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormHeadingProps {
    title: string
    subTitle: string
    action: string
    id?: string
}


const FormHeading: FC<FormHeadingProps> = ({
    title,
    subTitle,
    action,
    id
}) => {
    const router = useRouter();
    const mutation = useMutation({
        mutationKey: [action],
        mutationFn: async () => {
            await api.delete(`/${action}/${id}`);
        },
        onMutate: async () => {
            toast.loading("Deleting record...", { id: "delete-record" });

            await queryClient.cancelQueries({ queryKey: [action] });
            const previousRecord = queryClient.getQueryData([action]);

            queryClient.setQueryData([action], (old: any) =>
                old?.filter((record: { id: string | undefined; }) => record.id !== id)
            );

            return { previousRecord };
        },
        onError: (error, variables, context) => {
            toast.error("Failed to delete record", { id: "delete-record" });

            if (context?.previousRecord) {
                queryClient.setQueryData([action], context.previousRecord);
            }
        },
        onSuccess: () => {
            toast.success("Record deleted successfully", { id: "delete-record" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [action] });
            router.replace(`/${action}`);
        },
    });

    return (
        <div className='w-full flex items-center justify-between'>
            <div className='flex flex-col items-start justify-start gap-1.5'>
                <h1 className='text-2xl font-semibold'>{title}</h1>
                <p className='text-xs text-muted-foreground'>{subTitle}</p>
            </div>
            {id !== 'new' && (
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
                                This action cannot be undone. This will permanently delete the record and associated data.
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
            )}
        </div>
    )
}

export default FormHeading