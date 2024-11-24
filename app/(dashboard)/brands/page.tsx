'use client'

import Heading from '@/components/Heading'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import LoadingComponent from '@/components/LoadingComponent'
import ErrorComponent from '@/components/ErrorComponent'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import api from '@/lib/api'

const Page = () => {
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const response = await api.get('/brands');
            return response.data;
        }
    });

    return (
        <div className='space-y-4'>
            <Heading title='Brands' subTitle='Manage your brands' action='brands' />
            <Separator />
            {isLoading ? (
                <LoadingComponent />
            ) : isError ? (
                <ErrorComponent error={error} />
            ) : (
                <DataTable data={data} columns={columns} />
            )}
        </div>
    )
}

export default Page