import React from 'react'
import { ArrowRight, BookOpen, Gamepad2, Library } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function Home() {
  return (
    <div className='flex flex-col gap-10 max-w-6xl mx-auto px-5 py-10 md:py-16'>

      {/* welcome */}
      <div className='flex flex-col items-center gap-3 text-center'>
        <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
          Welcome to <span className='text-blue-500 group-hover:text-blue-500/80'>S</span>ave<span className='text-red-500 group-hover:text-red-500/80'>P</span>oint
        </h1>

        <p className='text-lg md:text-2xl text-muted-foreground'>
          Your personal playthrough journal and timeline tracker
        </p>
      </div>

      {/* browse */}
      <Card className='lg:flex-row lg:items-center bg-linear-to-br from-blue-900/30 via-background to-background'>
        <div className='flex flex-col gap-6 flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-3xl md:text-4xl'>
              <Gamepad2 className='text-blue-500' />
              Browse games
            </CardTitle>

            <CardDescription className='text-base md:text-lg'>
              Search games from an extensive collection of over 90000 games from RAWG.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button size='lg' className='bg-blue-900 hover:bg-blue-900/80' render={<Link to='/games' />}>
              Go to games
              <ArrowRight />
            </Button>
          </CardFooter>
        </div>

        <CardContent className='flex-1'>
          <img
            src='/browse.png'
            alt='Browsing the games collection'
            className='w-full h-auto rounded-lg border'
          />
        </CardContent>
      </Card>

      {/* library */}
      <Card className='lg:flex-row-reverse lg:items-center bg-linear-to-br from-blue-900/30 via-background to-background'>
        <div className='flex flex-col gap-6 flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-3xl md:text-4xl'>
              <Library className='text-blue-500' />
              Save to Library
            </CardTitle>

            <CardDescription className='text-base md:text-lg'>
              Save games to the library to start tracking.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button size='lg' className='bg-blue-900 hover:bg-blue-900/80' render={<Link to='/library' />}>
              Go to library
              <ArrowRight />
            </Button>
          </CardFooter>
        </div>

        <CardContent className='flex-1'>
          <img
            src='/library.png'
            alt='Your saved games library'
            className='w-full h-auto rounded-lg border'
          />
        </CardContent>
      </Card>

      {/* journal */}
      <Card className='lg:flex-row lg:items-center bg-linear-to-br from-blue-900/30 via-background to-background'>
        <div className='flex flex-col gap-6 flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-3xl md:text-4xl'>
              <BookOpen className='text-blue-500' />
              Track in journal
            </CardTitle>

            <CardDescription className='text-base md:text-lg'>
              Create timelines to record and personalize each playthrough for an experience you will never forget.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button size='lg' className='bg-blue-900 hover:bg-blue-900/80' render={<Link to='/journal' />}>
              Go to journal
              <ArrowRight />
            </Button>
          </CardFooter>
        </div>

        <CardContent className='flex-1'>
          <img
            src='/journal.png'
            alt='Journal timelines for your playthroughs'
            className='w-full h-auto rounded-lg border'
          />
        </CardContent>
      </Card>

    </div>
  )
}

export default Home