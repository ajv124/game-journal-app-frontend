import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Games from './pages/Games'
import Header from './components/Header'
import Library from './pages/Library'
import Journal from './pages/Journal'
import GameDetails from './pages/GameDetails'
import Timeline from './pages/Timeline'

function App() {

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/games' element={<Games/>}/>
      <Route path='/games/:id' element={<GameDetails/>}/>
      <Route path='/library' element={<Library/>}/>
      <Route path='/journal' element={<Journal/>}/>
      <Route path='/journal/:id' element={<Timeline/>}/>

    </Routes>
    </>
  )
}

export default App
