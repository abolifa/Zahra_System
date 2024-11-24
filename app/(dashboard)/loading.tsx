import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
    return (
        <div className='flex flex-col items-start w-full gap-4'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col items-start justify-start gap-1.5'>
                    <Skeleton className='w-28 h-8' />
                    <Skeleton className='w-64 h-5' />
                </div>
                <Skeleton className='w-32 h-10' />
            </div>
            <Separator />
            <Skeleton className='w-full h-8' />
            <Skeleton className='w-full h-8' />
            <Skeleton className='w-full h-8' />
            <Skeleton className='w-full h-8' />
        </div>
    )
}

export default loading