import React from 'react'
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
import { Separator } from '@/components/ui/separator'
import { ChevronRight, ArrowRight, ThumbsUp, Download, File } from 'lucide-react'

function Home() {
  return (
    <div className='flex flex-col gap-10 p-5'>

      {/* Modlists Section */}
      <section>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-2xl font-semibold'>
            Jump back into your modlists
          </h2>

          <Link to="/modlists">
            <Button variant='outline'>
              View All <ArrowRight />
            </Button>
          </Link>
        </div>

        <Separator className='my-3 bg-primary' />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

          <Link to="/modlists">
            <Card className='flex flex-col gap-3 p-0 overflow-hidden hover:bg-accent transition-colors'>
              <div className='flex items-center gap-3 p-3'>
                <img
                  src="https://thumb.wikimedia.org/wikipedia/en/thumb/0/0c/Witcher_3_cover_art.jpg/250px-Witcher_3_cover_art.jpg"
                  alt="The Witcher 3"
                  className='size-14 rounded-md object-cover'
                />

                <div className='flex flex-col'>
                  <span className='font-medium'>
                    The Witcher 3: Wild Hunt
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    2 modlists
                  </span>
                </div>
              </div>

              <CardContent className='flex flex-col gap-2 px-3 pb-3'>
                <div className='flex items-center justify-between p-3 rounded-md border'>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>
                      Graphics Enhance Modpack
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      20 mods
                    </span>
                  </div>
                  <ChevronRight className='size-4 text-muted-foreground' />
                </div>

                <div className='flex items-center justify-between p-3 rounded-md border'>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>
                      Gameplay Overhaul Modpack
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      10 mods
                    </span>
                  </div>
                  <ChevronRight className='size-4 text-muted-foreground' />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* Mods Section */}
      <section>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-2xl font-semibold'>
            Explore mods
          </h2>

          <Link to="/mods">
            <Button variant='outline'>
              View All <ArrowRight />
            </Button>
          </Link>
        </div>

        <Separator className='my-3 bg-primary' />

        <div className='grid grid-cols-[repeat(auto-fill,300px)] justify-center md:justify-start gap-6'>

          <Link to="/mods/witcher-3/1021">
            <Card className='flex flex-col gap-2 p-0 border h-100 hover:bg-accent transition-colors'>
              <img
                src="https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg"
                alt="Mod preview"
                className='w-full h-50 object-contain bg-muted'
              />

              <CardHeader>
                <CardTitle>
                  The Witcher 3 HD Reworked Project
                </CardTitle>
                <CardDescription>
                  Witcher 3 - Models and Textures
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p>
                  A visual improvement mod for The Witcher 3.
                </p>
              </CardContent>

              <CardFooter className='flex items-center justify-between mt-auto'>
                <div className='flex items-center text-xs'>
                  <ThumbsUp size={15} className='mx-2' />
                  124k
                  <Download size={15} className='mx-2' />
                  5.8m
                  <File size={15} className='mx-2' />
                  9.3GB
                </div>
              </CardFooter>
            </Card>
          </Link>

        </div>
      </section>

    </div>
  )
}

export default Home