import React, { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp, LogOut, Menu, SearchIcon, UserRound, X } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/components/ui/toast'
import { FieldGroup } from './ui/field'

function Header() {
  const [openMenu, setOpenMenu] = useState(false)
  const [search, setSearch] = useState("")
  const { loggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const query = search.trim()
    if (!query) return
    navigate(`/games?search=${encodeURIComponent(query)}`)
    setSearch("")
  }

  return (
    <header className='flex items-center md:justify-between gap-10 bg-background p-3 md:px-6 border-b-2 border-outline'>

      {/* Mobile Drawer */}
      <Drawer swipeDirection="left" open={openMenu} onOpenChange={setOpenMenu}>
        <DrawerTrigger render={<Button variant='ghost' size='icon' className='md:hidden' aria-label='Open menu'><Menu /></Button>} />
        <DrawerContent>
          <DrawerHeader className='border-b-2 border-outline'>
            <DrawerTitle className='flex items-center text-2xl gap-3 px-2 py-5' >
              <DrawerClose render={<Button size='icon' aria-label='Close menu'><X /></Button>} />
              <div><span className='text-blue-500'>S</span>ave<span className='text-red-500'>P</span>oint</div>
            </DrawerTitle>
            <DrawerDescription className='sr-only'>Navigation</DrawerDescription>
          </DrawerHeader>

          {/* nav */}
          <nav className='flex flex-col justify-center gap-5 p-5'>
            <NavLink to='/games' onClick={() => setOpenMenu(false)} className='flex items-center justify-center px-3 py-2 text-lg aria-[current=page]:text-outline'>Games</NavLink>
            <NavLink to='/library' onClick={() => setOpenMenu(false)} className='flex items-center justify-center px-3 py-2 text-lg aria-[current=page]:text-outline'>Library</NavLink>
            <NavLink to='/journal' onClick={() => setOpenMenu(false)} className='flex items-center justify-center px-3 py-2 text-lg aria-[current=page]:text-outline'>Journal</NavLink>
          </nav>

          <DrawerFooter className='border-t-2 border-outline p-2'>
            {!loggedIn && (
              <Button nativeButton={false} variant='ghost' render={<Link to='/login' />} onClick={() => { setOpenMenu(false) }} className='text-lg border-2 border-outline rounded'>Login</Button>
            )}
            {loggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger className='group flex items-center justify-center text-lg p-2'>
                  <ChevronUp className='w-3 transition-transform group-data-popup-open:rotate-180' />
                  <Avatar className='size-10'>
                    <AvatarImage src="" />
                    <AvatarFallback><UserRound /></AvatarFallback>
                  </Avatar>
                  <span className='mx-2'>User</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-auto p-3'>
                  <DropdownMenuItem render={<Link to='/profile' />} onClick={() => setOpenMenu(false)} className='text-base'><UserRound />Profile</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      setOpenMenu(false)
                      toast.add({
                        title: 'Success',
                        description: 'Logged out successfully',
                        type: 'success'
                      })
                      navigate('/')
                    }}
                    className='text-base text-destructive'
                  ><LogOut />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Title */}
      <Link to='/' className='group flex items-center text-2xl md:text-3xl hover:text-muted-foreground'>
        <img className='size-8' src="/logo.svg" alt="" />
        <div><span className='text-blue-500 group-hover:text-blue-500/80'>S</span>ave<span className='text-red-500 group-hover:text-red-500/80'>P</span>oint</div>
      </Link>

      {/* Nav */}

      {/* Nav */}
      <NavigationMenu className='md:flex hidden'>
        <NavigationMenuList className='flex items-center gap-2'>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<NavLink to='/games' />}
              className='text-lg hover:bg-accent hover:text-muted-foreground aria-[current=page]:text-outline'
            >Games</NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              render={<NavLink to='/library' />}
              className='text-lg hover:bg-accent hover:text-muted-foreground aria-[current=page]:text-outline'
            >Library</NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              render={<NavLink to='/journal' />}
              className='text-lg hover:bg-accent hover:text-muted-foreground aria-[current=page]:text-outline'
            >Journal</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>


      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-1 md:flex-none md:w-100"
      >
        <InputGroup>
          <InputGroupInput
            placeholder="Search Games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </form>

      {/* Login */}
      <div className='hidden md:flex items-center text-lg'>
        {!loggedIn && (
          <Button nativeButton={false} variant='ghost' render={<Link to='/login' />} onClick={() => { setOpenMenu(false) }} className='text-lg border-2 border-outline rounded px-10 py-3'>Login</Button>
        )}
        {loggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger className='group flex items-center justify-center'>
              <span className='mx-2'>{user.username}</span>
              <Avatar className='size-10'>
                <AvatarImage src={user.picture} />
                <AvatarFallback><UserRound /></AvatarFallback>
              </Avatar>
              <ChevronDown className='w-3 transition-transform group-data-popup-open:rotate-180' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-auto p-3'>
              <DropdownMenuItem render={<Link to='/profile' />} className='text-base hover:text-muted-foreground data-highlighted:text-muted-foreground'><UserRound />Profile</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  setOpenMenu(false)
                  toast.add({
                    title: 'Success',
                    description: 'Logged out successfully',
                    type: 'success'
                  })
                  navigate('/')
                }}
                className='text-base text-destructive hover:text-destructive/60 data-highlighted:text-destructive/60'
              ><LogOut />Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

export default Header