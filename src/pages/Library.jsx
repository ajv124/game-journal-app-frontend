
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
    EmptyContent,
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
  import {
    getSavedGamesAPI,
    getSingleGameAPI,
    removeGameAPI,
    saveGameAPI
  } from '@/services/allAPI'

  function Library() {

    const [loading, setLoading] = useState(false)
    const [savedGames, setSavedGames] = useState([])
    const [openFilter, setOpenFilter] = useState(false)

    const { loggedIn, authLoading } = useAuth()

    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get("search") || ""
    const [searchInput, setSearchInput] = useState(search)
    const selectedGenres = searchParams.get("genres")?.split(",").filter(Boolean) || []
    const selectedPlatforms = searchParams.get("platforms")?.split(",").filter(Boolean) || []
    const sortBy = searchParams.get("sort") || "default"
    const currentPage = Number(searchParams.get("page") || 1)
    const gamesPerPage = Number(searchParams.get("limit") || 10)

    useEffect(() => {
      if (authLoading) return

      if (loggedIn) {
        getSavedGames()
      } else {
        setSavedGames([])
        setLoading(false)
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
    }, [searchInput])

    useEffect(() => {
      setSearchInput(search)
    }, [search])

    const getSavedGames = async () => {
      try {
        setLoading(true)
        const response = await getSavedGamesAPI()
        const games = await Promise.all(
          response.map((item) => getSingleGame(item.gameId))
        )
        setSavedGames(games.filter(Boolean))
      } catch (error) {
        toast.add({
          title: 'Error',
          description: 'Failed to get library games',
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    const getSingleGame = async (id) => {
      try {
        const response = await getSingleGameAPI(id)
        return response
      } catch (error) {
        toast.add({
          title: 'Error',
          description: `Failed to get game with ID ${id}`,
          type: 'error'
        })
        return null
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

    const searchedGames = savedGames.filter((game) =>
      game?.name?.toLowerCase().replace(/[^a-z0-9]/g, "").includes(
        searchInput.toLowerCase().replace(/[^a-z0-9]/g, "")
      )
    )

    const genres = [
      ...new Set(
        searchedGames.flatMap(
          (game) => game.genres?.map((genre) => genre.name) || []
        )
      )
    ]

    const platforms = [
      ...new Set(
        searchedGames.flatMap(
          (game) => game.platforms?.map((item) => [item.platform.name]) || []
        )
      )
    ]

    const filteredGames = searchedGames.filter((game) => {
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          game.genres?.some((item) => item.name === genre)
        )

      const matchesPlatform =
        selectedPlatforms.length === 0 ||
        selectedPlatforms.some((platform) =>
          game.platforms?.some((item) => item.platform.name === platform)
        )

      return matchesGenre && matchesPlatform
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "latest":
          return new Date(b.released || 0) - new Date(a.released || 0)
        case "popular":
          return (b.added || 0) - (a.added || 0)
        case "ratings":
          return (b.rating || 0) - (a.rating || 0)
        case "metacritic":
          return (b.metacritic || 0) - (a.metacritic || 0)
        default:
          return 0
      }
    })

    const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
    const indexOfLastGame = currentPage * gamesPerPage
    const indexOfFirstGame = indexOfLastGame - gamesPerPage
    const currentGames = filteredGames.slice(
      indexOfFirstGame,
      indexOfLastGame
    )

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
      try {
        const isSaved = savedGames.some(
          (item) => item.id === game.id
        )
        if (isSaved) {
          await removeGameAPI(game.id)
          setSavedGames((prev) =>
            prev.filter(
              (item) => item.id !== game.id
            )
          )
          toast.add({
            title: 'Success',
            description: `${game.name} removed from Library`,
            type: 'success'
          })
        } else {
          const response = await saveGameAPI(game.id, {
            name: game.name,
            coverImage: game.background_image
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
          description: 'Failed to update library',
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
              <BreadcrumbLink render={<Link to={'/games'} />}>
                Games
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Library</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='mx-5 my-4'>
          <h1 className='text-2xl font-bold'>
            {!loading && search ? 'Search Results' : 'Your Library'}
          </h1>

          <p className='text-sm text-muted-foreground'>
            {!loading && search
              ? `${filteredGames.length} results for "${search}"`
              : `Explore ${filteredGames.length} saved games`}
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
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Default</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="name" id="name" />
                    <Label htmlFor="name">Name</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="latest" id="latest" />
                    <Label htmlFor="latest">Latest</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="popular" id="popular" />
                    <Label htmlFor="popular">Popular</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="ratings" id="ratings" />
                    <Label htmlFor="ratings">Ratings</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="metacritic" id="metacritic" />
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
                      {genres.length > 0 ?
                        <FieldGroup className="gap-2">
                          {genres.map((genre) => {
                            const genreCount = searchedGames.filter(
                              (game) =>
                                game.genres?.some(
                                  (item) => item.name === genre
                                )
                            ).length
                            return (
                              <Field key={genre} orientation="horizontal">
                                <FieldLabel className="cursor-pointer">
                                  <Checkbox
                                    checked={selectedGenres.includes(genre)}
                                    onCheckedChange={(checked) => {
                                      const updatedGenres = checked
                                        ? [...selectedGenres, genre]
                                        : selectedGenres.filter(
                                          (item) => item !== genre
                                        )

                                      updateSearchParams({
                                        genres: updatedGenres,
                                        page: 1
                                      })
                                    }}
                                  />

                                  {genre}

                                  <span className="text-muted-foreground text-sm">
                                    ({genreCount})
                                  </span>
                                </FieldLabel>
                              </Field>
                            )
                          })}
                        </FieldGroup>
                        :
                        <p className="text-sm text-muted-foreground">
                          No genres found
                        </p>
                      }
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="platforms">
                  <AccordionTrigger>
                    Platforms
                  </AccordionTrigger>

                  <AccordionContent>
                    <ScrollArea className="h-50">
                      {platforms.length > 0 ?
                        <FieldGroup className="gap-2">
                          {platforms.map((platform) => {
                            const platformCount = searchedGames.filter(
                              (game) =>
                                game.platforms?.some(
                                  (item) => item.platform.name === platform
                                )
                            ).length

                            return (
                              <Field key={platform} orientation="horizontal">
                                <FieldLabel className="cursor-pointer">
                                  <Checkbox
                                    checked={selectedPlatforms.includes(platform)}
                                    onCheckedChange={(checked) => {
                                      const updatedPlatforms = checked
                                        ? [...selectedPlatforms, platform]
                                        : selectedPlatforms.filter(
                                          (item) => item !== platform
                                        )

                                      updateSearchParams({
                                        platforms: updatedPlatforms,
                                        page: 1
                                      })
                                    }}
                                  />

                                  {platform}

                                  <span className="text-muted-foreground text-sm">
                                    ({platformCount})
                                  </span>
                                </FieldLabel>
                              </Field>
                            )
                          })}
                        </FieldGroup>
                        :
                        <p className="text-sm text-muted-foreground">
                          No platforms found
                        </p>
                      }
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          {!loggedIn ?
            <Empty className='h-100'>
              <EmptyHeader>
                <EmptyMedia>
                  <Bookmark size={50} />
                </EmptyMedia>

                <EmptyTitle className='text-3xl'>
                  Not logged in
                </EmptyTitle>

                <EmptyDescription className='text-xl'>
                  Login to view saved games
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
              : filteredGames.length > 0 ?
                <div className={`${openFilter ? 'hidden md:block' : 'block'} flex-1 columns-[300px] px-5`}>
                  {currentGames.map((game) => (
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
                            savedGames.some(
                              (item) => item.id === game.id
                            )
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
                        : "Save games to see them here"}
                    </EmptyDescription>
                  </EmptyHeader>

                  {search ?
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
                    :
                    <Button
                      nativeButton={false}
                      render={<Link to={'/games'} />}
                    >
                      Browse games
                    </Button>
                  }
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
                      disabled={currentPage === 1}
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
                      disabled={currentPage === totalPages}
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

  export default Library