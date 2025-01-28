import React from 'react'
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import UserProtectedWrapper from './pages/UserProtectedWrapper'

// Placeholder components for routes that haven't been created yet
const PlaylistsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Playlists</h1>
    <p className="text-gray-600">Your learning playlists will appear here.</p>
  </div>
);

const RewardsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Rewards</h1>
    <p className="text-gray-600">Track your achievements and rewards here.</p>
  </div>
);

const LeaderboardPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h1>
    <p className="text-gray-600">See how you rank among other learners.</p>
  </div>
);

const ProfilePage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
    <p className="text-gray-600">Manage your profile and settings here.</p>
  </div>
);

const App = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

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
              <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/playlists" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Playlists
              </Link>
            </li>
            <li>
              <Link to="/rewards" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Rewards
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/*" element={<UserProtectedWrapper><Dashboard /></UserProtectedWrapper>} />
            <Route path="/playlists" element={<UserProtectedWrapper><PlaylistsPage /></UserProtectedWrapper>} />
            <Route path="/rewards" element={<UserProtectedWrapper><RewardsPage /></UserProtectedWrapper>} />
            <Route path="/leaderboard" element={<UserProtectedWrapper><LeaderboardPage /></UserProtectedWrapper>} />
            <Route path="/profile" element={<UserProtectedWrapper><ProfilePage /></UserProtectedWrapper>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App