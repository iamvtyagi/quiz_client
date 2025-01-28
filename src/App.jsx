import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
// import Register from './compo/Register'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </>
  )
}

export default App