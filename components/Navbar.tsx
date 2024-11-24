import React from 'react'
import { ModeToggle } from './ModeToggle'

const Navbar = () => {
    return (
        <div className='w-full h-14 flex items-center justify-between px-10'>
            <p className='text-sm font-normal'>BreadCrumbs / BreadCrumbs </p>
            <ModeToggle />
        </div>
    )
}

export default Navbar