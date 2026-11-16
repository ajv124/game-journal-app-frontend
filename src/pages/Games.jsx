import React, { useEffect, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ArrowDownUp,
  Bookmark,
  SearchIcon,
  SearchX,
  SlidersHorizontal,
  Star
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from '@/components/ui/toast'
import {
  getAllGamesAPI,
  getGenresAPI,
  getPlatformsAPI,
  getSavedGamesAPI,
  removeGameAPI,
  saveGameAPI
} from '@/services/allAPI'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { useAuth } from '@/context/AuthContext'

function Games() {
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState([])
  const [genres, setGenres] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [savedGames, setSavedGames] = useState([])
  const [openFilter, setOpenFilter] = useState(false)

  const { loggedIn, authLoading } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("search") || ""
  const [searchInput, setSearchInput] = useState(search)
  const selectedGenres = searchParams.get("genres")?.split(",").filter(Boolean) || []
  const selectedPlatforms = searchParams.get("platforms")?.split(",").filter(Boolean) || []
  const sortBy = searchParams.get("sort") || "-added"
  const currentPage = Number(searchParams.get("page") || 1)
  const gamesPerPage = Number(searchParams.get("limit") || 10)

  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  useEffect(() => {
    getGames()
  }, [searchParams])

  useEffect(() => {
    getFilters()
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (loggedIn) {
      getSavedGames()
    } else {
      setSavedGames([])
    }
  }, [loggedIn, authLoading])

  useEffect(() => {
    if (searchInput === search) return

    const timer = setTimeout(() => {
      updateSearchParams({
        search: searchInput,
        page: 1
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, search])

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const getGames = async () => {
    try {
      setLoading(true)

      const response = await getAllGamesAPI(searchParams)

      setGames(response.results)
      setTotalCount(response.count)
      setHasNext(Boolean(response.next))
      setHasPrevious(Boolean(response.previous))
    } catch (error) {
      toast.add({
        title: 'Error',
        description: "Failed to get games",
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getFilters = async () => {
    try {
      const [genreResponse, platformResponse] = await Promise.all([
        getGenresAPI(),
        getPlatformsAPI()
      ])

      setGenres(genreResponse.results)
      setPlatforms(platformResponse.results)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: "Failed to get filters",
        type: 'error'
      })
    }
  }

  const getSavedGames = async () => {
    try {
      const response = await getSavedGamesAPI()
      setSavedGames(response)
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to get saved games",
        type: "error"
      })
    }
  }

  const updateSearchParams = (updates) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)

      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value == undefined || value == "") {
          params.delete(key)
        } else {
          params.set(key, Array.isArray(value) ? value.join(",") : value)
        }
      })

      return params
    })
  }

  const totalPages = Math.ceil(totalCount / gamesPerPage)

  const handlePageChange = (page) => {
    updateSearchParams({ page })
  }

  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }

    return pages
  }

  const handleBookmark = async (game) => {
    if (!loggedIn) {
      toast.add({
        title: 'Not logged in',
        description: 'You must login to save games',
        type: 'warning'
      })
      return
    }

    try {
      const isSaved = savedGames.some(
        (item) => item.gameId === String(game.id)
      )

      if (isSaved) {
        await removeGameAPI(game.id)

        setSavedGames((prev) => prev.filter((item) => item.gameId !== String(game.id)))

        toast.add({
          title: 'Success',
          description: `${game.name} removed from Library`,
          type: 'success'
        })
      } else {
        const response = await saveGameAPI(game.id,{
          name:game.name,
          coverImage:game.background_image
        })
        setSavedGames((prev) => [...prev, response])
        toast.add({
          title: 'Saved',
          description: `${game.name} added to your library`,
          type: 'success'
        })
      }
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to save game',
        type: 'error'
      })
    }
  }

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
            <BreadcrumbPage>Games</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='mx-5 my-4'>
        <h1 className='text-2xl font-bold'>
          {!loading && search ? 'Search Results' : 'Browse Games'}
        </h1>

        <p className='text-sm text-muted-foreground'>
          {!loading && search
            ? `${totalCount} results for "${search}"`
            : `Explore ${totalCount} games`}
        </p>
      </div>

      <div className='flex items-center gap-2 md:gap-3 mx-5'>
        <Button
          variant='outline'
          onClick={() => setOpenFilter(!openFilter)}
        >
          <SlidersHorizontal />
          <span className='hidden sm:inline'>Filters</span>
        </Button>

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
                    sort: value,
                    page: 1
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="name" id="name" />
                  <Label htmlFor="name">Name</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="-released" id="latest" />
                  <Label htmlFor="latest">Latest</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="-added" id="popular" />
                  <Label htmlFor="popular">Popular</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="-rating" id="ratings" />
                  <Label htmlFor="ratings">Ratings</Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="-metacritic" id="metacritic" />
                  <Label htmlFor="metacritic">Metacritic</Label>
                </div>
              </RadioGroup>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className='my-4' />

      <div className='flex mb-5'>
        {openFilter && (
          <Card className="sticky top-10 w-60 m-5 p-4 self-start bg-background">
            <CardTitle>Filters</CardTitle>

            <Separator />

            <Accordion multiple defaultValue={["genres", "platforms"]}>
              <AccordionItem value="genres">
                <AccordionTrigger>
                  Genres
                </AccordionTrigger>

                <AccordionContent>
                  <ScrollArea className="h-50">
                    <FieldGroup className="gap-2">
                      {genres.map((genre) => (
                        <Field key={genre.id} orientation="horizontal">
                          <FieldLabel className="cursor-pointer">
                            <Checkbox
                              checked={selectedGenres.includes(String(genre.id))}
                              onCheckedChange={(checked) => {
                                const updatedGenres = checked
                                  ? [...selectedGenres, String(genre.id)]
                                  : selectedGenres.filter((id) => id !== String(genre.id))

                                updateSearchParams({
                                  genres: updatedGenres,
                                  page: 1
                                })
                              }}
                            />
                            {genre.name}
                          </FieldLabel>
                        </Field>
                      ))}
                    </FieldGroup>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="platforms">
                <AccordionTrigger>
                  Platforms
                </AccordionTrigger>

                <AccordionContent>
                  <ScrollArea className="h-50">
                    <FieldGroup className="gap-2">
                      {platforms.map((platform) => (
                        <Field key={platform.id} orientation="horizontal">
                          <FieldLabel className="cursor-pointer">
                            <Checkbox
                              checked={selectedPlatforms.includes(String(platform.id))}
                              onCheckedChange={(checked) => {
                                const updatedPlatforms = checked
                                  ? [...selectedPlatforms, String(platform.id)]
                                  : selectedPlatforms.filter((id) => id !== String(platform.id))

                                updateSearchParams({
                                  platforms: updatedPlatforms,
                                  page: 1
                                })
                              }}
                            />
                            {platform.name}
                          </FieldLabel>
                        </Field>
                      ))}
                    </FieldGroup>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        {loading ?
          <div className={`${openFilter ? 'hidden md:grid' : 'grid'} flex-1 justify-center grid-cols-[repeat(auto-fill,300px)] gap-6`}>
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
          : totalCount > 0 ?
            <div className={`${openFilter ? 'hidden md:block' : 'block'} flex-1 px-5 columns-[300px]`}>
              {games.map((game) => (
                <Card
                  key={game.id}
                  className='relative gap-0 p-0 overflow-hidden my-5'
                >
                  <Link to={`/games/${game.id}`}>
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-auto object-contain"
                    />

                    <CardFooter className="flex flex-col p-2 bg-background">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <Tooltip>
                          <TooltipTrigger className="text-base flex-1 truncate text-left">
                            {game.name}
                          </TooltipTrigger>

                          <TooltipContent>
                            {game.name}
                          </TooltipContent>
                        </Tooltip>

                        <span className='text-muted-foreground text-sm'>
                          ({game.released?.split("-")[0]})
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-sm">
                        {game.rating}
                        <Star size="12" className='fill-current' />
                        <span className='text-muted-foreground'>
                          ({game.ratings_count})
                        </span>
                      </span>

                      <div className='flex items-center flex-wrap gap-1 w-full mt-1'>
                        {game.genres?.map((genre) => (
                          <Badge key={genre.name}>
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Link>

                  <Button
                    size="icon"
                    aria-label="Bookmark"
                    className='absolute top-2 right-2'
                    onClick={() => handleBookmark(game)}
                  >
                    <Bookmark
                      className={
                        savedGames.some(item => item.gameId === String(game.id))
                          ? "fill-current"
                          : ""
                      }
                    />
                  </Button>
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
                  {search
                    ? `No search result for "${search}"`
                    : `No games found`}
                </EmptyTitle>

                <EmptyDescription className='text-xl'>
                  {search
                    ? "Enter a valid game name"
                    : "Error fetching games"}
                </EmptyDescription>
              </EmptyHeader>

              {search && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchInput("")
                    updateSearchParams({
                      search: "",
                      page: 1
                    })
                  }}
                >
                  Clear search
                </Button>
              )}
            </Empty>
        }
      </div>

      {totalPages > 1 && (
        <>
          <Separator />

          <div className='flex flex-wrap justify-center items-center pt-2'>
            <Field orientation="horizontal" className='w-auto'>
              <FieldLabel htmlFor="select-rows-per-page">
                Rows per page
              </FieldLabel>

              <Select
                value={String(gamesPerPage)}
                onValueChange={(value) => {
                  updateSearchParams({
                    limit: value,
                    page: 1
                  })
                }}
              >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Pagination className="p-5 w-auto m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={!hasPrevious}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
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
                    disabled={!hasNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </>
  )
}

export default Games
