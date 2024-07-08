'use client'
import ChessBoard from '@/components/ChessBoard'
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button'
import { useSocket } from '@/hooks/useSocket';
import React from 'react'

const Home = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-slate-950'>
      <Button className='bg-blue-700'>play now</Button>
    </div>
  )
}

export default Home