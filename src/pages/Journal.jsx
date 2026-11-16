
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Gamepad2,
  Image,
  CalendarDays,
  BookMarked,
  ArrowRight,
  CheckCircle2,
  Clock,
  Library
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/context/AuthContext'
import { getSavedGamesAPI } from '@/services/allAPI'
import { toast } from '@/components/ui/toast'

function Journal() {

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)

  const { loggedIn, authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState('tracking')

  const [currentPages, setCurrentPages] = useState({
    tracking: 1,
    completed: 1,
    backlog: 1
  })

  const gamesPerPage = 10

  useEffect(() => {
    if (authLoading) return

    if (loggedIn) {
      getSavedGames()
    } else {
      setGames([])
      setLoading(false)
    }
  }, [loggedIn, authLoading])

  const getSavedGames = async () => {
    try {
      setLoading(true)

      const response = await getSavedGamesAPI()

      setGames(response || [])

    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to get journal games',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Journal Statistics

  const totalGames = games.length

  // Games by Status

  const trackingGames = games.filter(
    (game) => game.status === 'tracking'
  )

  const completedGames = games.filter(
    (game) => game.status === 'completed'
  )

  const backlogGames = games.filter(
    (game) => game.status === 'backlog'
  )

  const statusGames = {
    tracking: trackingGames,
    completed: completedGames,
    backlog: backlogGames
  }

  // Pagination

  const currentGames = statusGames[activeTab]

  const currentPage = currentPages[activeTab]

  const totalPages = Math.ceil(currentGames.length / gamesPerPage)

  const startIndex = (currentPage - 1) * gamesPerPage

  const paginatedGames = currentGames.slice(
    startIndex,
    startIndex + gamesPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPages((prev) => ({
      ...prev,
      [activeTab]: page
    }))
  }

  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      )
    }

    return pages
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Reusable Game Cards

  const renderGameCards = (gamesList) => {

    if (loading) {
      return (
        <div className='columns-[300px] gap-6 px-5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={i}
              className='relative gap-0 p-0 overflow-hidden my-5 break-inside-avoid'
            >
              <Skeleton className='aspect-[3/4] w-full' />

              <CardContent className='p-3'>
                <Skeleton className='h-5 w-3/4' />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    return gamesList.length > 0 ?

      <div className='columns-[300px] gap-6 px-5'>

        {gamesList.map((game) => (

          <Card
            key={game.gameId || game.id}
            className='relative gap-0 p-0 overflow-hidden my-5 break-inside-avoid'
          >

            <Link to={`/journal/${game.gameId || game.id}`}>

              <img
                src={game.coverImage}
                alt={game.name}
                className='w-full h-auto object-contain'
              />

              <CardFooter className='flex flex-col p-3 bg-background'>

                <div className='font-semibold text-base w-full'>
                  {game.name}
                </div>

              </CardFooter>

            </Link>

            <CardFooter className='p-3 pt-0'>

              <Button
                nativeButton={false}
                render={
                  <Link
                    to={`/journal/${game.gameId || game.id}`}
                  />
                }
                variant='outline'
                className='w-full'
              >
                View Journal
                <ArrowRight size={16} />
              </Button>

            </CardFooter>

          </Card>

        ))}

      </div>

      :

      <Empty className='h-80 border rounded-lg my-5'>

        <EmptyHeader>

          <EmptyMedia variant='icon'>
            {activeTab === 'tracking' ?
              <Clock size={32} />
              : activeTab === 'completed' ?
                <CheckCircle2 size={32} />
                :
                <Library size={32} />
            }
          </EmptyMedia>

          <EmptyTitle className='text-2xl'>
            {activeTab === 'tracking' ?
              'Nothing currently tracking'
              : activeTab === 'completed' ?
                'No completed games'
                :
                'Your backlog is empty'
            }
          </EmptyTitle>

          <EmptyDescription>
            {activeTab === 'tracking' ?
              'Games you are currently playing will appear here.'
              : activeTab === 'completed' ?
                'Games you have completed will appear here.'
                :
                'Games you plan to play will appear here.'
            }
          </EmptyDescription>

        </EmptyHeader>

        <EmptyContent>

          <Button
            nativeButton={false}
            render={<Link to='/games' />}
          >
            <Gamepad2 size={16} />
            Browse Games
          </Button>

        </EmptyContent>

      </Empty>
  }

  return (
    <>
      {/* Breadcrumb */}

      <Breadcrumb className='m-2'>

        <BreadcrumbList>

          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to={'/'} />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>My Journal</BreadcrumbPage>
          </BreadcrumbItem>

        </BreadcrumbList>

      </Breadcrumb>

      {/* Page Header */}

      <div className='mx-5 mt-5 mb-4'>

        <div className='flex flex-col gap-2'>

          <h1 className='text-3xl font-bold'>
            My Journal
          </h1>

          <p className='text-muted-foreground max-w-2xl'>
            Your personal gaming diary. Revisit your favorite moments,
            memorable experiences, and adventures from the games you play.
          </p>

        </div>

      </div>

      {/* Journal Statistics */}

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mx-5 my-5'>

        <Card className='gap-2'>
          <CardContent className='flex items-center gap-4 p-4'>

            <div className='p-3 rounded-md bg-primary/10 text-primary'>
              <Gamepad2 size={24} />
            </div>

            <div>
              <p className='text-sm text-muted-foreground'>
                Games Journaled
              </p>

              <p className='text-2xl font-bold'>
                {totalGames}
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardContent className='flex items-center gap-4 p-4'>

            <div className='p-3 rounded-md bg-primary/10 text-primary'>
              <BookOpen size={24} />
            </div>

            <div>
              <p className='text-sm text-muted-foreground'>
                Journal Entries
              </p>

              <p className='text-2xl font-bold'>
                0
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className='gap-2'>
          <CardContent className='flex items-center gap-4 p-4'>

            <div className='p-3 rounded-md bg-primary/10 text-primary'>
              <Image size={24} />
            </div>

            <div>
              <p className='text-sm text-muted-foreground'>
                Screenshots
              </p>

              <p className='text-2xl font-bold'>
                0
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      <Separator className='my-4' />

      {/* Game Journal Collection */}

      <div className='mx-5 mb-5'>

        <div className='flex items-center justify-between gap-2 mb-4'>

          <div>
            <h2 className='text-xl font-bold'>
              Your Games
            </h2>

            <p className='text-sm text-muted-foreground'>
              Games with journal entries
            </p>
          </div>

          <Badge variant='secondary'>
            {totalGames} Games
          </Badge>

        </div>

        {/* Status Tabs */}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className='w-full'
        >

          <TabsList className='w-full sm:w-auto'>

            <TabsTrigger value='tracking'>
              <Clock size={15} />
              Currently Tracking

              <Badge variant='secondary' className='ml-1'>
                {trackingGames.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value='completed'>
              <CheckCircle2 size={15} />
              Completed

              <Badge variant='secondary' className='ml-1'>
                {completedGames.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value='backlog'>
              <Library size={15} />
              Backlog

              <Badge variant='secondary' className='ml-1'>
                {backlogGames.length}
              </Badge>
            </TabsTrigger>

          </TabsList>

          {/* Currently Tracking */}

          <TabsContent value='tracking'>
            {renderGameCards(paginatedGames)}
          </TabsContent>

          {/* Completed */}

          <TabsContent value='completed'>
            {renderGameCards(paginatedGames)}
          </TabsContent>

          {/* Backlog */}

          <TabsContent value='backlog'>
            {renderGameCards(paginatedGames)}
          </TabsContent>

        </Tabs>

        {/* Pagination */}

        {currentGames.length > 0 && totalPages > 1 && (

          <>
            <Separator className='my-4' />

            <div className='flex justify-center items-center'>

              <Pagination className='p-5 w-auto m-0'>

                <PaginationContent>

                  <PaginationItem>
                    <PaginationPrevious
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (

                    <PaginationItem key={index}>

                      {page === '...' ? (

                        <span className='px-3 text-muted-foreground'>
                          ...
                        </span>

                      ) : (

                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>

                      )}

                    </PaginationItem>

                  ))}

                  <PaginationItem>
                    <PaginationNext
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>

                </PaginationContent>

              </Pagination>

            </div>
          </>

        )}

      </div>

    </>
  )
}

export default Journal