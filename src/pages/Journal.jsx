import React, { useEffect, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ArrowDownUp,
  BookOpen,
  CircleCheck,
  Clock,
  Eye,
  Gamepad2,
  History,
  Hourglass,
  SearchIcon,
  SearchX
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from '@/components/ui/toast'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/context/AuthContext'
import { getSavedGamesAPI } from '@/services/allAPI'

const statuses = [
  { value: "tracking", icon: Eye },
  { value: "backlog", icon: Hourglass },
  { value: "completed", icon: CircleCheck }
]

function Journal() {

  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState([])

  const { loggedIn, authLoading } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("search") || ""
  const [searchInput, setSearchInput] = useState(search)
  const sortBy = searchParams.get("sort") || "updated"

  useEffect(() => {
    if (authLoading) return

    if (loggedIn) {
      getJournalGames()
    } else {
      setGames([])
      setLoading(false)
    }
  }, [loggedIn, authLoading])

  useEffect(() => {
    if (searchInput === search) return

    const timer = setTimeout(() => {
      updateSearchParams({
        search: searchInput
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const getJournalGames = async () => {
    try {
      setLoading(true)
      const response = await getSavedGamesAPI()
      setGames(response)
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

  const updateSearchParams = (updates) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)

      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value == undefined || value == "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      return params
    })
  }

  const latestGames = games
    .filter((game) => game.status === "tracking")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4)

  const searchedGames = games.filter((game) =>
    game?.name?.toLowerCase().replace(/[^a-z0-9]/g, "").includes(
      searchInput.toLowerCase().replace(/[^a-z0-9]/g, "")
    )
  ).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "added":
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })

  return (
    <>
      <Breadcrumb className='m-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to={'/'} />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Journal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='mx-5 my-4'>
        <h1 className='flex items-center gap-2 text-2xl font-bold'>
          <History />
          Jump back in
        </h1>

        <p className='text-sm text-muted-foreground'>
          Continue where you left off
        </p>
      </div>

      {loading ?
        <Card className='gap-0 p-0 overflow-hidden mx-12 md:mx-auto md:max-w-3xl my-4 bg-background'>
          <Skeleton className="aspect-video w-full rounded-none" />

          <CardFooter className="justify-center p-3">
            <Skeleton className="h-5 w-1/3" />
          </CardFooter>
        </Card>
        : latestGames.length > 0 ?
          <Carousel opts={{ loop: true }} className='mx-12 md:mx-auto md:max-w-3xl my-4'>
            <CarouselContent>
              {latestGames.map((game) => (
                <CarouselItem key={game.gameId}>
                  <Link to={`/journal/${game.gameId}`}>
                    <Card className='gap-0 p-0 overflow-hidden bg-background'>
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="w-full aspect-video object-cover"
                      />

                      <CardFooter className="justify-center p-3 bg-background">
                        <span className="text-xl text-center truncate">
                          {game.name}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          :
          <Empty className='h-60'>
            <EmptyHeader>
              <EmptyMedia>
                <Gamepad2 size={50} />
              </EmptyMedia>

              <EmptyTitle className='text-3xl'>
                Nothing in progress
              </EmptyTitle>

              <EmptyDescription className='text-xl'>
                Games you are tracking will show up here
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
      }

      <Separator className='my-4' />

      <div className='mx-5 my-4'>
        <h1 className='flex items-center gap-2 text-2xl font-bold'>
          My games
        </h1>
      </div>

      <div className='flex items-center gap-2 md:gap-3 mx-5'>
        <InputGroup className='flex-1 bg-background'>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search games..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>

        <Popover>
          <PopoverTrigger render={<Button variant='outline' />}>
            <ArrowDownUp />
            <span className='hidden sm:inline'>Sort</span>
          </PopoverTrigger>

          <PopoverContent className='w-auto'>
            <PopoverHeader>
              <PopoverTitle>Sort by</PopoverTitle>

              <RadioGroup
                className='my-2'
                value={sortBy}
                onValueChange={(value) =>
                  updateSearchParams({
                    sort: value
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="updated" id="updated" />
                  <Label htmlFor="updated">Latest updated</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="added" id="added" />
                  <Label htmlFor="added">Date added</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="name" id="name" />
                  <Label htmlFor="name">Name</Label>
                </div>
              </RadioGroup>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>

      <div className='mx-5 my-4 mb-5'>
        {!loggedIn ?
          <Empty className='h-100'>
            <EmptyHeader>
              <EmptyMedia>
                <BookOpen size={50} />
              </EmptyMedia>

              <EmptyTitle className='text-3xl'>
                Not logged in
              </EmptyTitle>

              <EmptyDescription className='text-xl'>
                Login to view your journal
              </EmptyDescription>

              <EmptyContent>
                <Button
                  nativeButton={false}
                  render={<Link to={'/login'} />}
                >
                  Login
                </Button>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
          : loading ?
            <div className='grid justify-center grid-cols-[repeat(auto-fill,300px)] gap-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>

                  <CardContent>
                    <Skeleton className="aspect-video w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            :
            <Tabs defaultValue="tracking">
              <TabsList className='w-full bg-background'>
                {statuses.map(({ value, icon: Icon }) => (
                  <TabsTrigger key={value} value={value} className='capitalize'>
                    <Icon />
                    {value} ({searchedGames.filter((game) => game.status === value).length})
                  </TabsTrigger>
                ))}
              </TabsList>

              {statuses.map(({ value }) => (
                <TabsContent key={value} value={value}>
                  {searchedGames.filter((game) => game.status === value).length > 0 ?
                    <div className='columns-[300px]'>
                      {searchedGames
                        .filter((game) => game.status === value)
                        .map((game) => (
                          <Card
                            key={game.gameId}
                            className='gap-0 p-0 overflow-hidden my-5 bg-background'
                          >
                            <img
                              src={game.coverImage}
                              alt={game.name}
                              className="w-full h-auto object-contain"
                            />

                            <CardFooter className="flex flex-col gap-2 p-2 bg-background">
                              <span className="text-base w-full text-center truncate">
                                {game.name}
                              </span>

                              <Button
                                nativeButton={false}
                                render={<Link to={`/journal/${game.gameId}`} />}
                                className='w-full bg-blue-900 hover:bg-blue-900/80'
                              >
                                <BookOpen />
                                Open journal
                              </Button>

                              <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Clock size='12' />
                                Last updated at {new Date(game.updatedAt).toLocaleDateString()}
                              </span>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                    :
                    <Empty className='h-100'>
                      <EmptyHeader>
                        <EmptyMedia>
                          <SearchX size='50' />
                        </EmptyMedia>

                        <EmptyTitle className='text-3xl'>
                          No games found
                        </EmptyTitle>

                        <EmptyDescription className='text-xl'>
                          Nothing in {value} yet
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  }
                </TabsContent>
              ))}
            </Tabs>
        }
      </div>
    </>
  )
}

export default Journal