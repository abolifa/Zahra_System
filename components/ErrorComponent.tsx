import React from 'react'
import { BiSolidError } from "react-icons/bi";
import { Badge } from './ui/badge';


const ErrorComponent = ({
    error
}: {
    error: any
}) => {
    return (
        <div className='w-full py-10 flex flex-col items-center justify-center gap-2'>
            <BiSolidError size={50} className='text-destructive' />
            <h1 className='text-xl font-bold'>Connection Lost</h1>
            <p className='text-muted-foreground text-xs'>an Error accured while trying to connect to the server</p>
            <p className='text-muted-foreground text-xs'>Please try again later</p>
            <Badge className='mt-5' variant={'destructive'}>{error.message}</Badge>
        </div>
    )
}

export default ErrorComponent