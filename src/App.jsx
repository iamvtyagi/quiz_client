import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
// import Register from './compo/Register'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/activity" element={<div className="p-8">Activity Page (Coming Soon)</div>} />
          <Route path="/classes" element={<div className="p-8">Classes Page (Coming Soon)</div>} />
          <Route path="/flashcards" element={<div className="p-8">Flashcards Page (Coming Soon)</div>} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </div>
  )
}

export default App