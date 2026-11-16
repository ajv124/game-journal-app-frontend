import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from '@/components/ui/toast'
import {
  getSingleGameAPI,
  getScreenshotsAPI,
  getSavedGamesAPI,
  removeGameAPI,
  saveGameAPI
} from '@/services/allAPI'
import { Bookmark } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function GameDetails() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [game, setGame] = useState({})
  const [screenshots, setScreenshots] = useState([])
  const [savedGames, setSavedGames] = useState([])

  const { loggedIn, authLoading } = useAuth()

  const isSaved = savedGames.includes(Number(id))

  useEffect(() => {
    getGameDetails()
  }, [id])

  useEffect(() => {
    if (authLoading) return

    if (loggedIn) {
      getSavedGames()
    } else {
      setSavedGames([])
    }
  }, [loggedIn, authLoading])

  const getGameDetails = async () => {
    try {
      setLoading(true)

      const [gameResponse, screenshotResponse] = await Promise.all([
        getSingleGameAPI(id),
        getScreenshotsAPI(id)
      ])

      setGame(gameResponse)
      setScreenshots(screenshotResponse.results)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: "Failed to get game details",
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSavedGames = async () => {
    try {
      const response = await getSavedGamesAPI()
      setSavedGames(response.map((game)=>Number(game.gameId)))
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to get saved games',
        type: 'error'
      })
    }
  }

  const handleBookmark = async () => {
    if (!loggedIn) {
      toast.add({
        title: 'Not logged in',
        description: 'You must login to save games',
        type: 'warning'
      })
      return
    }

    try {
      if (isSaved) {
        await removeGameAPI(Number(id))

        setSavedGames((prev) =>
          prev.filter((item) => item !== Number(id))
        )

        toast.add({
          title: 'Success',
          description: `${game.name} removed from Library`,
          type: 'success'
        })
      } else {
        await saveGameAPI(Number(id), {
          name: game.name,
          coverImage: game.background_image
        })

        setSavedGames((prev) => [...prev, Number(id)])

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
            <BreadcrumbPage>{game.name || "Game Details"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <div className='mx-5 my-4 flex flex-col md:flex-row gap-5'>
          <Card className='md:w-1/2 bg-background'>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>

          <Card className='md:w-1/2 bg-background'>
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className='mx-5 my-4 flex flex-col gap-5'>
          <div className='flex flex-col md:flex-row gap-5'>
            {/* card */}
            <Card className='md:w-1/2 self-start bg-background'>
              <CardContent className='flex flex-col gap-4'>
                {game.background_image ? (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-auto object-contain rounded-md"
                  />
                ) : (
                  <div className='aspect-video w-full flex items-center justify-center rounded-md bg-muted text-muted-foreground'>
                    No image available
                  </div>
                )}

                <Button
                  onClick={handleBookmark}
                  disabled={authLoading}
                  className={isSaved ? 'bg-red-900 hover:bg-red-900/80' : 'bg-blue-900 hover:bg-blue-900/80'}
                >
                  <Bookmark className={isSaved ? 'fill-current' : ''} />
                  {isSaved ? 'Remove from Library' : 'Add to Library'}
                </Button>

                <div className='flex flex-col gap-2 text-sm'>
                  <p>
                    <span className='text-muted-foreground'>Name: </span>
                    {game.name || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Developers: </span>
                    {game.developers?.map((dev) => dev.name).join(", ") || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Release Date: </span>
                    {game.released || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Genres: </span>
                    {game.genres?.map((genre) => genre.name).join(", ") || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Metacritic: </span>
                    {game.metacritic || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Rating: </span>
                    {game.rating ? `${game.rating} (${game.ratings_count})` : "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>ESRB Rating: </span>
                    {game.esrb_rating?.name || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Added: </span>
                    {game.added || "N/A"}
                  </p>

                  <p>
                    <span className='text-muted-foreground'>Platforms: </span>
                    {game.parent_platforms?.map((item) => item.platform.name).join(", ") || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className='md:w-1/2 self-start bg-background'>
              <CardHeader>
                <CardTitle className='text-2xl'>{game.name || "Game"}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className='text-sm whitespace-pre-line'>
                  {game.description_raw || "No description available"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Screenshots */}
          <Card className='bg-background'>
            <CardHeader>
              <CardTitle className='text-2xl'>Screenshots</CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {game.clip?.clip && (
                <video
                  src={game.clip.clip}
                  controls
                  className='w-full rounded-md'
                />
              )}

              {screenshots.map((screenshot) => (
                <img
                  key={screenshot.id}
                  src={screenshot.image}
                  alt="Screenshot"
                  className='w-full h-auto object-contain rounded-md'
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default GameDetails