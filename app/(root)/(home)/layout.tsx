import React, { ReactNode } from 'react'

const HomeLayout = ({children} : {children: ReactNode}) => {
  return (
    <main className='flex items-center justify-center bg-slate-950'>
        {children}
    </main>
  )
}

export default HomeLayout 