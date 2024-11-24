import Link from 'next/link'
import React, { FC } from 'react'
import { buttonVariants } from './ui/button'
import { PlusCircle } from 'lucide-react'

interface HeadingProps {
    title: string
    subTitle: string
    action: string
}


const Heading: FC<HeadingProps> = ({
    title,
    subTitle,
    action
}) => {
    return (
        <div className='w-full flex items-center justify-between'>
            <div className='flex flex-col items-start justify-start gap-1.5'>
                <h1 className='text-2xl font-semibold'>{title}</h1>
                <p className='text-xs text-muted-foreground'>{subTitle}</p>
            </div>

            <Link href={`/${action}/new`} className={buttonVariants()}>
                <PlusCircle />
                Add new
            </Link>
        </div>
    )
}

export default Heading