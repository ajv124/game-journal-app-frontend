import React, { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Eye,
  Flag,
  Heart,
  Hourglass,
  CircleCheck,
  Image,
  Pencil,
  Plus,
  Skull,
  Star,
  StickyNote,
  Trash2,
  Trophy,
  Swords
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import { Link, useSearchParams } from 'react-router-dom'

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

// placeholder data, replace with api calls
const game = {
  gameId: 1,
  name: "Elden Ring",
  coverImage: "https://placehold.co/1200x500",
  status: "tracking"
}

const entries = [
  {
    _id: "1",
    type: "boss",
    title: "Finally beat Margit",
    content: "Took 14 attempts. Learned to stay close and punish the delayed swings.",
    images: ["https://placehold.co/600x400"],
    entryDate: "2026-11-14",
    attempts: 14
  },
  {
    _id: "2",
    type: "memory",
    title: "Riding Torrent at sunset",
    content: "Stopped for a while just to look around. The sky was incredible.",
    images: ["https://placehold.co/600x800"],
    entryDate: "2026-11-10"
  },
  {
    _id: "3",
    type: "milestone",
    title: "Reached Liurnia",
    content: "Left Limgrave behind and the world opened up.",
    images: [],
    entryDate: "2026-11-05"
  },
  {
    _id: "4",
    type: "note",
    title: "Remember to upgrade the flask",
    content: "Golden seeds are hidden near the great trees. Check the map before leaving an area.",
    images: [],
    entryDate: "2026-10-28"
  },
  {
    _id: "5",
    type: "achievement",
    title: "Elden Ring unlocked",
    content: "Got the first great rune.",
    images: ["https://placehold.co/600x600"],
    entryDate: "2026-10-20"
  },
  {
    _id: "6",
    type: "review",
    title: "First impressions",
    content: "Challenging but fair. The exploration is what keeps pulling me back in.",
    images: [],
    entryDate: "2026-10-15",
    rating: 9
  }
]

function JournalDetails() {

  const [status, setStatus] = useState(game.status)
  const [newType, setNewType] = useState("note")
  const [selectedEntry, setSelectedEntry] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get("type") || "all"

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
  )

  const groupedEntries = Object.groupBy(sortedEntries, (entry) =>
    new Date(entry.entryDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  )

  const filteredEntries = sortedEntries.filter((entry) => {
    if (typeFilter === "all") return true
    if (typeFilter === "images") return entry.images.length > 0
    return entry.type === typeFilter
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
            <BreadcrumbLink render={<Link to={'/journal'} />}>
              Journal
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{game.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='gap-0 p-0 overflow-hidden mx-5 my-4 bg-background'>
        <img
          src={game.coverImage}
          alt={game.name}
          className="w-full h-48 md:h-64 object-cover"
        />

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 p-4 bg-background">
          <div>
            <h1 className='text-2xl font-bold'>
              {game.name}
            </h1>

            <p className='text-sm text-muted-foreground'>
              {entries.length} entries in your journal
            </p>
          </div>

          <div className='flex items-center gap-2 md:gap-3'>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-40 capitalize bg-background'>
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

            <Dialog>
              <DialogTrigger render={<Button className='bg-blue-900 hover:bg-blue-900/80' />}>
                <Plus />
                <span className='hidden sm:inline'>Add entry</span>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New entry</DialogTitle>
                  <DialogDescription>
                    Add a memory to your journal
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
                    <Input id="title" placeholder="Give this entry a title" />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>

                  {newType === "review" && (
                    <div className='grid gap-2'>
                      <Label htmlFor="rating">Rating (1-10)</Label>
                      <Input id="rating" type="number" min="1" max="10" />
                    </div>
                  )}

                  {newType === "boss" && (
                    <div className='grid gap-2'>
                      <Label htmlFor="attempts">Attempts</Label>
                      <Input id="attempts" type="number" min="1" />
                    </div>
                  )}

                  <div className='grid gap-2'>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Write about it..." />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor="images">Images</Label>
                    <Input id="images" type="file" accept="image/*" multiple />
                  </div>
                </div>

                <DialogFooter>
                  <Button className='bg-blue-900 hover:bg-blue-900/80'>
                    Save entry
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>

      <div className='mx-5 mb-5'>
        <Tabs defaultValue="timeline">
          <TabsList className='w-full bg-background'>
            <TabsTrigger value="timeline">
              <Swords />
              Timeline
            </TabsTrigger>

            <TabsTrigger value="all">
              <BookOpen />
              All entries ({entries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            {sortedEntries.length > 0 ?
              <div className='ml-3 mt-5 border-l'>
                {Object.entries(groupedEntries).map(([month, monthEntries]) => (
                  <div key={month}>
                    <h2 className='flex items-center gap-2 -ml-3 mb-4 text-lg font-bold'>
                      <Calendar size='20' className='bg-background' />
                      {month}
                    </h2>

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
                                <h3 className='font-semibold truncate'>
                                  {entry.title}
                                </h3>

                                <span className='text-xs text-muted-foreground'>
                                  {new Date(entry.entryDate).toLocaleDateString()}
                                </span>
                              </div>

                              <div className='flex items-center gap-2'>
                                {entry.images.length > 0 && <Image size='16' className='text-muted-foreground' />}
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
                    No entries yet
                  </EmptyTitle>

                  <EmptyDescription className='text-xl'>
                    Add your first memory to start the timeline
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            }
          </TabsContent>

          <TabsContent value="all">
            <div className='flex items-center gap-2 md:gap-3 mt-5'>
              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  setSearchParams(value === "all" ? {} : { type: value })
                }
              >
                <SelectTrigger className='w-full sm:w-60 bg-background'>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All entries</SelectItem>
                    <SelectItem value="images">
                      <Image />
                      Images
                    </SelectItem>
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

            <Separator className='my-4' />

            {filteredEntries.length > 0 ?
              <div className='columns-[300px]'>
                {filteredEntries.map((entry) => {
                  const { icon: Icon, text, border, label } = entryTypes[entry.type]

                  return (
                    <Card
                      key={entry._id}
                      className={`gap-0 p-0 overflow-hidden my-5 bg-background border-l-4 cursor-pointer hover:bg-accent ${border}`}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      {entry.images.length > 0 && (
                        <img
                          src={entry.images[0]}
                          alt={entry.title}
                          className="w-full h-auto object-contain"
                        />
                      )}

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
                    <BookOpen size={50} />
                  </EmptyMedia>

                  <EmptyTitle className='text-3xl'>
                    No entries found
                  </EmptyTitle>

                  <EmptyDescription className='text-xl'>
                    Nothing matches this filter
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            }
          </TabsContent>
        </Tabs>
      </div>

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

              {selectedEntry.images.map((image) => (
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

export default JournalDetails