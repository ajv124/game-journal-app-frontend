import React, { useEffect, useState } from 'react'
import {
  BookOpen,
  Calendar,
  Eye,
  Flag,
  Gamepad2,
  Heart,
  Hourglass,
  CircleCheck,
  Image,
  Images,
  Pencil,
  Plus,
  Route,
  Skull,
  Star,
  StickyNote,
  Trash2,
  Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardFooter,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/context/AuthContext'
import {
  changeStatusAPI,
  createEntryAPI,
  createTimelineAPI,
  getAllEntriesAPI,
  getTimelineGameAPI,
  getTimelinesAPI
} from '@/services/allAPI'

const entryTypes = {
  milestone: { label: "Milestone", icon: Flag, text: "text-blue-500", border: "border-l-blue-500" },
  note: { label: "Note to remember", icon: StickyNote, text: "text-green-500", border: "border-l-green-500" },
  memory: { label: "Memorable moment", icon: Heart, text: "text-pink-500", border: "border-l-pink-500" },
  review: { label: "Review", icon: Star, text: "text-yellow-500", border: "border-l-yellow-500" },
  achievement: { label: "Achievement", icon: Trophy, text: "text-amber-500", border: "border-l-amber-500" },
  boss: { label: "Boss", icon: Skull, text: "text-red-500", border: "border-l-red-500" }
}

const statuses = [
  { value: "tracking", icon: Eye },
  { value: "backlog", icon: Hourglass },
  { value: "completed", icon: CircleCheck }
]

function Timeline() {

  const [gameLoading, setGameLoading] = useState(false)
  const [timelinesLoading, setTimelinesLoading] = useState(false)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [game, setGame] = useState(null)
  const [timelines, setTimelines] = useState([])
  const [entries, setEntries] = useState([])
  const [newTimelineName, setNewTimelineName] = useState("")
  const [newType, setNewType] = useState("note")
  const [newEntryTitle, setNewEntryTitle] = useState("")
  const [newEntryDate, setNewEntryDate] = useState("")
  const [newEntryContent, setNewEntryContent] = useState("")
  const [newEntryRating, setNewEntryRating] = useState("")
  const [newEntryAttempts, setNewEntryAttempts] = useState("")
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [newTimelineOpen, setNewTimelineOpen] = useState(false)
  const [newEntryOpen, setNewEntryOpen] = useState(false)
  const [view, setView] = useState("timeline")

  const { id } = useParams()
  const { loggedIn, authLoading } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get("type") || "all"
  const timelineId = searchParams.get("timeline") || timelines[0]?._id

  const activeTimeline = timelines.find((timeline) => timeline._id === timelineId) || timelines[0]

  useEffect(() => {
    if (authLoading) return

    if (loggedIn) {
      getGame()
      getTimelines()
    } else {
      setGame(null)
      setTimelines([])
      setGameLoading(false)
      setTimelinesLoading(false)
    }
  }, [loggedIn, authLoading, id])

  useEffect(() => {
    if (!activeTimeline?._id) {
      setEntries([])
      setEntriesLoading(false)
      return
    }

    getEntries(activeTimeline._id)
  }, [activeTimeline?._id])

  const getGame = async () => {
    try {
      setGameLoading(true)
      const response = await getTimelineGameAPI(id)
      setGame(response)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to get game',
        type: 'error'
      })
    } finally {
      setGameLoading(false)
    }
  }

  const getTimelines = async () => {
    try {
      setTimelinesLoading(true)
      const response = await getTimelinesAPI(id)
      setTimelines(response)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to get timelines',
        type: 'error'
      })
    } finally {
      setTimelinesLoading(false)
    }
  }

  const getEntries = async (activeId) => {
    try {
      setEntriesLoading(true)
      const response = await getAllEntriesAPI(activeId)
      console.log(response)
      setEntries(response)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to get entries',
        type: 'error'
      })
    } finally {
      setEntriesLoading(false)
    }
  }

  const changeStatus = async (status) => {
    try {
      await changeStatusAPI(id, status)
      setGame((prev) => ({ ...prev, status }))
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to change status',
        type: 'error'
      })
    }
  }

  const createTimeline = async () => {
    if (!newTimelineName.trim()) {
      toast.add({
        title: 'Error',
        description: 'Timeline name is required',
        type: 'error'
      })
      return
    }

    try {
      await createTimelineAPI(id, newTimelineName.trim())
      setNewTimelineName("")
      setNewTimelineOpen(false)
      toast.add({
        title: 'Success',
        description: 'Timeline created',
        type: 'success'
      })
      getTimelines()
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to create timeline',
        type: 'error'
      })
    }
  }

  const createEntry = async () => {
    if (!newEntryTitle.trim()) {
      toast.add({
        title: 'Error',
        description: 'Entry title is required',
        type: 'error'
      })
      return
    }

    if (!newEntryDate) {
      toast.add({
        title: 'Error',
        description: 'Entry date is required',
        type: 'error'
      })
      return
    }

    if (newType === "review" && (newEntryRating < 1 || newEntryRating > 10)) {
      toast.add({
        title: 'Error',
        description: 'Rating must be between 1 and 10',
        type: 'error'
      })
      return
    }

    if (newType === "boss" && newEntryAttempts < 1) {
      toast.add({
        title: 'Error',
        description: 'Attempts must be at least 1',
        type: 'error'
      })
      return
    }

    const entryData = {
      type: newType,
      title: newEntryTitle.trim(),
      content: newEntryContent.trim(),
      entryDate: newEntryDate,
      images: [], // image upload comes later with cloudinary
      ...(newType === "review" && { rating: Number(newEntryRating) }),
      ...(newType === "boss" && { attempts: Number(newEntryAttempts) })
    }

    try {
      await createEntryAPI(activeTimeline._id, entryData)
      setNewEntryTitle("")
      setNewEntryDate("")
      setNewEntryContent("")
      setNewEntryRating("")
      setNewEntryAttempts("")
      setNewType("note")
      setNewEntryOpen(false)
      toast.add({
        title: 'Success',
        description: 'Entry created',
        type: 'success'
      })
      getEntries(activeTimeline._id)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to create entry',
        type: 'error'
      })
    }
  }

  const updateParam = (key, value, fallback) => {
    const params = new URLSearchParams(searchParams)

    if (value === fallback) params.delete(key)
    else params.set(key, value)

    setSearchParams(params)
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const filteredEntries = sortedEntries.filter((entry) => {
    if (typeFilter === "all") return true
    if (typeFilter === "images") return entry.images?.length > 0
    return entry.type === typeFilter
  })

  const groupedEntries = Object.groupBy(filteredEntries, (entry) =>
    new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  )

  const galleryEntries = filteredEntries.filter((entry) => entry.images?.length > 0)

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
            <BreadcrumbLink render={<Link to={'/journal'} />}>
              Journal
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            {gameLoading || !game ?
              <Skeleton className='h-4 w-24' />
              :
              <BreadcrumbPage>{game.name}</BreadcrumbPage>
            }
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex flex-col lg:flex-row gap-5 mx-5 my-4'>

        {/* sidebar */}
        <aside className='flex flex-col gap-4 lg:w-72 lg:shrink-0 lg:sticky lg:top-4 lg:self-start'>
          <Card className='gap-0 p-0 overflow-hidden bg-linear-to-br from-blue-900/30 via-background to-background'>
            {gameLoading || !game ?
              <>
                <div className='flex items-center gap-3 p-4'>
                  <Skeleton className='size-14 rounded-xl' />

                  <div className='flex flex-col gap-2 flex-1'>
                    <Skeleton className='h-3 w-1/2' />
                    <Skeleton className='h-6 w-3/4' />
                  </div>
                </div>

                <div className='px-4 pb-4'>
                  <Skeleton className='h-9 w-full' />
                </div>
              </>
              :
              <>
                <div className='flex items-center gap-3 p-4'>
                  {game.coverImage ?
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className='size-14 shrink-0 rounded-xl border object-cover'
                    />
                    :
                    <div className='p-3 rounded-xl border bg-background'>
                      <Gamepad2 size='24' className='text-blue-500' />
                    </div>
                  }

                  <div className='min-w-0'>
                    <p className='text-xs uppercase tracking-widest text-muted-foreground'>
                      Game journal
                    </p>

                    <h1 className='text-2xl font-bold leading-tight truncate'>
                      {game.name}
                    </h1>
                  </div>
                </div>

                <div className='px-4 pb-4'>
                  <Select value={game.status} onValueChange={changeStatus}>
                    <SelectTrigger className='w-full capitalize bg-background'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {statuses.map(({ value, icon: Icon }) => (
                          <SelectItem key={value} value={value} className='capitalize'>
                            <Icon />
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            }
          </Card>

          {/* timeline picker, select on mobile */}
          <div className='lg:hidden'>
            {timelinesLoading ?
              <Skeleton className='h-9 w-full' />
              :
              <Select
                value={activeTimeline?._id ?? ""}
                onValueChange={(value) => updateParam("timeline", value, timelines[0]?._id)}
                disabled={timelines.length === 0}
              >
                <SelectTrigger className='w-full bg-background'>
                  <Route />
                  <SelectValue placeholder='No timelines'>{activeTimeline?.name}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {timelines.map((timeline) => (
                      <SelectItem key={timeline._id} value={timeline._id}>
                        {timeline.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            }
          </div>

          {/* timeline picker, list on desktop */}
          <Card className='hidden lg:flex gap-0 p-0 overflow-hidden bg-background'>
            <div className='flex items-center justify-between p-3'>
              <h2 className='flex items-center gap-2 text-sm font-semibold'>
                <Route size='16' />
                Timelines
              </h2>

              <Button size='icon-sm' variant='ghost' onClick={() => setNewTimelineOpen(true)}>
                <Plus />
              </Button>
            </div>

            <Separator />

            <div className='flex flex-col gap-1 p-2'>
              {timelinesLoading ?
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full' />
                ))
                : timelines.length > 0 ?
                  timelines.map((timeline) => {
                    const isActive = timeline._id === activeTimeline?._id

                    return (
                      <button
                        key={timeline._id}
                        onClick={() => updateParam("timeline", timeline._id, timelines[0]._id)}
                        className={`flex items-center justify-between gap-2 w-full rounded-md border-l-4 px-3 py-2 text-left text-sm hover:bg-accent ${isActive ? 'bg-accent font-medium border-l-blue-500' : 'border-l-transparent'}`}
                      >
                        <span className='block truncate'>{timeline.name}</span>

                        <Badge variant='outline'>{timeline.entryCount ?? 0}</Badge>
                      </button>
                    )
                  })
                  :
                  <p className='p-2 text-sm text-muted-foreground'>
                    No timelines yet
                  </p>
              }
            </div>

            <Separator />

            <div className='p-2'>
              <Button variant='ghost' className='w-full justify-start' onClick={() => setNewTimelineOpen(true)}>
                <Plus />
                New timeline
              </Button>
            </div>
          </Card>

          <Button
            variant='outline'
            className='lg:hidden'
            onClick={() => setNewTimelineOpen(true)}
          >
            <Plus />
            New timeline
          </Button>
        </aside>

        {/* main */}
        <main className='flex-1 min-w-0'>
          {!timelinesLoading && !activeTimeline ?
            <Empty className='h-100'>
              <EmptyHeader>
                <EmptyMedia>
                  <Route size={50} />
                </EmptyMedia>

                <EmptyTitle className='text-3xl'>
                  No timelines yet
                </EmptyTitle>

                <EmptyDescription className='text-xl'>
                  Create a timeline to start journaling
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
            :
            <>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  {timelinesLoading || !activeTimeline ?
                    <>
                      <Skeleton className='h-7 w-40 mb-2' />
                      <Skeleton className='h-4 w-24' />
                    </>
                    :
                    <>
                      <h2 className='text-2xl font-bold'>{activeTimeline.name}</h2>
                      <p className='text-sm text-muted-foreground'>
                        {entries.length} entries
                      </p>
                    </>
                  }
                </div>

                <div className='flex items-center gap-2 md:gap-3'>
                  <div className='flex items-center gap-1 p-1 rounded-md border bg-background'>
                    <Button
                      size='sm'
                      variant={view === "timeline" ? "secondary" : "ghost"}
                      onClick={() => setView("timeline")}
                    >
                      <Route />
                      <span className='hidden sm:inline'>Timeline</span>
                    </Button>

                    <Button
                      size='sm'
                      variant={view === "gallery" ? "secondary" : "ghost"}
                      onClick={() => setView("gallery")}
                    >
                      <Images />
                      <span className='hidden sm:inline'>Gallery</span>
                    </Button>
                  </div>

                  <Button
                    className='bg-blue-900 hover:bg-blue-900/80'
                    disabled={!activeTimeline}
                    onClick={() => setNewEntryOpen(true)}
                  >
                    <Plus />
                    <span className='hidden sm:inline'>Add entry</span>
                  </Button>
                </div>
              </div>

              {/* filter chips */}
              <div className='flex items-center gap-2 mt-5 pb-1 overflow-x-auto'>
                <Button
                  size='sm'
                  variant={typeFilter === "all" ? "default" : "outline"}
                  className='rounded-full'
                  onClick={() => updateParam("type", "all", "all")}
                >
                  All
                </Button>

                <Button
                  size='sm'
                  variant={typeFilter === "images" ? "default" : "outline"}
                  className='rounded-full'
                  onClick={() => updateParam("type", "images", "all")}
                >
                  <Image />
                  Images
                </Button>

                {Object.entries(entryTypes).map(([value, { label, icon: Icon, text }]) => (
                  <Button
                    key={value}
                    size='sm'
                    variant={typeFilter === value ? "default" : "outline"}
                    className='rounded-full shrink-0'
                    onClick={() => updateParam("type", value, "all")}
                  >
                    <Icon className={typeFilter === value ? '' : text} />
                    {label}
                  </Button>
                ))}
              </div>

              <Separator className='my-4' />

              {view === "timeline" && (
                entriesLoading ?
                  <div className='ml-3 mt-5 border-l'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className='relative pl-8 pb-6'>
                        <Skeleton className='h-14 w-full' />
                      </div>
                    ))}
                  </div>
                  : filteredEntries.length > 0 ?
                    <div className='ml-3 mt-5 border-l'>
                      {Object.entries(groupedEntries).map(([month, monthEntries]) => (
                        <div key={month}>
                          <h3 className='flex items-center gap-2 -ml-3 mb-4 text-lg font-bold'>
                            <Calendar size='20' className='bg-background' />
                            {month}
                          </h3>

                          {monthEntries.map((entry) => {
                            const { icon: Icon, text, border, label } = entryTypes[entry.type]

                            return (
                              <div key={entry._id} className='relative pl-8 pb-6'>
                                <div className='absolute -left-4 top-3 p-2 rounded-full border bg-background'>
                                  <Icon size='16' className={text} />
                                </div>

                                <Card
                                  className={`p-0 gap-0 overflow-hidden bg-background border-l-4 cursor-pointer hover:bg-accent ${border}`}
                                  onClick={() => setSelectedEntry(entry)}
                                >
                                  <CardFooter className='flex items-center justify-between gap-2 p-3'>
                                    <div className='min-w-0'>
                                      <h4 className='font-semibold truncate'>
                                        {entry.title}
                                      </h4>

                                      <span className='text-xs text-muted-foreground'>
                                        {new Date(entry.date).toLocaleDateString()}
                                      </span>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                      {entry.images?.length > 0 && <Image size='16' className='text-muted-foreground' />}
                                      <Badge variant='outline'>{label}</Badge>
                                    </div>
                                  </CardFooter>
                                </Card>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                    :
                    <Empty className='h-100'>
                      <EmptyHeader>
                        <EmptyMedia>
                          <BookOpen size={50} />
                        </EmptyMedia>

                        <EmptyTitle className='text-3xl'>
                          {entries.length === 0 ? "No entries yet" : "No entries found"}
                        </EmptyTitle>

                        <EmptyDescription className='text-xl'>
                          {entries.length === 0
                            ? "Add your first memory to start this timeline"
                            : "Nothing matches this filter"}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
              )}

              {view === "gallery" && (
                entriesLoading ?
                  <div className='columns-[250px]'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className='h-48 w-full mb-5 break-inside-avoid' />
                    ))}
                  </div>
                  : galleryEntries.length > 0 ?
                    <div className='columns-[250px]'>
                      {galleryEntries.map((entry) => {
                        const { icon: Icon, text, border, label } = entryTypes[entry.type]

                        return (
                          <Card
                            key={entry._id}
                            className={`gap-0 p-0 overflow-hidden mb-5 bg-background border-l-4 cursor-pointer hover:bg-accent break-inside-avoid ${border}`}
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <img
                              src={entry.images[0]}
                              alt={entry.title}
                              className="w-full h-auto object-contain"
                            />

                            <CardFooter className="flex flex-col gap-2 p-3 bg-background">
                              <span className={`flex items-center gap-1 text-sm ${text}`}>
                                <Icon size='14' />
                                {label}
                              </span>

                              <span className="text-base w-full text-center truncate">
                                {entry.title}
                              </span>

                              <span className='text-xs text-muted-foreground'>
                                {new Date(entry.entryDate).toLocaleDateString()}
                              </span>
                            </CardFooter>
                          </Card>
                        )
                      })}
                    </div>
                    :
                    <Empty className='h-100'>
                      <EmptyHeader>
                        <EmptyMedia>
                          <Images size={50} />
                        </EmptyMedia>

                        <EmptyTitle className='text-3xl'>
                          No images yet
                        </EmptyTitle>

                        <EmptyDescription className='text-xl'>
                          Entries with screenshots will show up here
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
              )}
            </>
          }
        </main>
      </div>

      {/* new timeline dialog */}
      <Dialog open={newTimelineOpen} onOpenChange={setNewTimelineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New timeline</DialogTitle>
            <DialogDescription>
              Start a separate run of {game?.name}
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor="timeline-name">Name</Label>
              <Input
                id="timeline-name"
                placeholder="Main run, Blind run, NG+..."
                value={newTimelineName}
                onChange={(e) => setNewTimelineName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button className='bg-blue-900 hover:bg-blue-900/80' onClick={createTimeline}>
              Create timeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* new entry dialog */}
      <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New entry</DialogTitle>
            <DialogDescription>
              Add a memory to {activeTimeline?.name}
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label>Type</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {Object.entries(entryTypes).map(([value, { label, icon: Icon }]) => (
                      <SelectItem key={value} value={value}>
                        <Icon />
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give this entry a title"
                value={newEntryTitle}
                onChange={(e) => setNewEntryTitle(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntryDate}
                onChange={(e) => setNewEntryDate(e.target.value)}
              />
            </div>

            {newType === "review" && (
              <div className='grid gap-2'>
                <Label htmlFor="rating">Rating (1-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="10"
                  value={newEntryRating}
                  onChange={(e) => setNewEntryRating(e.target.value)}
                />
              </div>
            )}

            {newType === "boss" && (
              <div className='grid gap-2'>
                <Label htmlFor="attempts">Attempts</Label>
                <Input
                  id="attempts"
                  type="number"
                  min="1"
                  value={newEntryAttempts}
                  onChange={(e) => setNewEntryAttempts(e.target.value)}
                />
              </div>
            )}

            <div className='grid gap-2'>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write about it..."
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" accept="image/*" multiple />
            </div>
          </div>

          <DialogFooter>
            <Button className='bg-blue-900 hover:bg-blue-900/80' onClick={createEntry}>
              Save entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* entry details dialog */}
      <Dialog
        open={!!selectedEntry}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEntry.title}</DialogTitle>
                <DialogDescription>
                  {entryTypes[selectedEntry.type].label} · {new Date(selectedEntry.entryDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              {selectedEntry.images?.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={selectedEntry.title}
                  className="w-full h-auto rounded-md"
                />
              ))}

              <p className='text-sm'>
                {selectedEntry.content}
              </p>

              {selectedEntry.rating && (
                <span className='flex items-center gap-1'>
                  <Star size='16' className='fill-current text-yellow-500' />
                  {selectedEntry.rating}/10
                </span>
              )}

              {selectedEntry.attempts && (
                <span className='flex items-center gap-1'>
                  <Skull size='16' className='text-red-500' />
                  Defeated in {selectedEntry.attempts} attempts
                </span>
              )}

              <DialogFooter>
                <Button variant='outline'>
                  <Pencil />
                  Edit
                </Button>

                <Button variant='destructive'>
                  <Trash2 />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Timeline