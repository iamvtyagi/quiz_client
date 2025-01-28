import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProtectedWrapper from './pages/UserProtectedWrapper'


function App() {
  return (
    <div className="flex">
      <Routes>
        <Route path='/' element = { <UserProtectedWrapper><h1>home</h1></UserProtectedWrapper> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App