'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from "react";


export const queryClient = new QueryClient();

export default function AdminLayout(
    { children }: { children: React.ReactNode }
) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className='flex items-start justify-start h-screen w-screen bg-sidebar'>
                <Sidebar />
                <div className='flex-1 w-full flex flex-col items-start justify-start'>
                    <Navbar />
                    <div className='flex-1 px-10 py-5 w-full'>
                        {children}
                    </div>
                </div>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}