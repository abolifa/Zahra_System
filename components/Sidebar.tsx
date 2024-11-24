'use client'

import { Figma, Users } from 'lucide-react'
import React from 'react'
import { Separator } from './ui/separator'
import Link from 'next/link'
import { IoHome, IoLogOut, IoPerson, IoSettings, IoShield } from "react-icons/io5";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'



const pages = [
    {
        title: 'Dashboard',
        href: '/',
        icon: IoHome,
    },
    {
        title: 'Users',
        href: '/test',
        icon: IoPerson,
    },
    {
        title: 'Brands',
        href: '/brands',
        icon: IoShield,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: IoSettings,
    },
    {
        title: 'Logout',
        href: '/logout',
        icon: IoLogOut,
    }
]
const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className='w-[300px] h-full flex relative flex-col px-6 py-5 items-start justify-start gap-5'>
            <div className='flex gap-2 self-center'>
                <Figma />
                <h1 className='text-md font-bold'>ZAHRA DASHBOARD</h1>
            </div>
            <Separator />
            {pages.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.title} href={item.href} className={cn('flex items-center gap-2 p-2 w-full last:absolute last:bottom-5 rounded-xl hover:bg-secondary transition-colors ease-in-out text-muted-foreground hover:text-secondary-foreground',
                        isActive ? 'bg-secondary hover:bg-secondary' : null,
                    )}>
                        <div className='w-8 h-8 flex items-center justify-center bg-primary p-1.5 rounded-xl'>
                            <item.icon className='text-secondary' />
                        </div>
                        <p className={cn('text-sm font-semibold',
                            isActive && 'text-secondary-foreground')}>{item.title}</p>
                    </Link>
                )
            })}
        </div>
    )
}

export default Sidebar