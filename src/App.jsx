import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
// import Register from './compo/Register'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 fixed h-full bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">QuizPlay</h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/playlists" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Playlists
              </a>
            </li>
            <li>
              <a href="/rewards" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Rewards
              </a>
            </li>
            <li>
              <a href="/leaderboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64"> {/* Add margin-left equal to sidebar width */}
        <Navbar />
        <div className="pt-16"> {/* Keep padding top for navbar */}
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
    </div>
  )
}

export default App