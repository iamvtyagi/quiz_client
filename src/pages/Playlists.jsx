import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoChevronDownOutline } from 'react-icons/io5';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist, onStartLearning }) => {
  const progressWidth = playlist.progress ? `${(playlist.progress.completed / playlist.progress.total) * 100}%` : '0%';
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Playlist Thumbnail */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {playlist.thumbnail ? (
          <img 
            src={playlist.thumbnail} 
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h3 className="text-xl text-gray-400 font-medium">{playlist.title}</h3>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 mb-2">
          {playlist.category || 'YouTube Playlist'}
        </span>
        <p className="text-sm text-gray-500 mb-2">{playlist.videoCount || 0} videos</p>
        <h4 className="font-semibold text-gray-800 mb-2">{playlist.title}</h4>
        
        {playlist.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{playlist.progress.completed}/{playlist.progress.total} completed</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={() => onStartLearning(playlist)}
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {playlist.progress?.completed > 0 ? 'Continue Learning' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
};

const Playlists = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const categories = ['All', 'Technology', 'Science', 'Business', 'Design'];

  // Function to fetch playlists
  const fetchPlaylists = async (query) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlist-videos`, {
        params: { query },
        withCredentials: true
      });
      
      if (response.data.playlists) {
        const formattedResults = response.data.playlists.map(playlist => ({
          id: playlist.id.playlistId,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          thumbnail: playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.default?.url,
          videoCount: 'N/A',
          category: 'Technology',
          videos: []
        }));
        setSearchResults(formattedResults);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  // Fetch React playlists on component mount
  useEffect(() => {
    fetchPlaylists('react tutorial playlist');
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);
    
    try {
      let params = {};
      
      // Check if input is a URL
      if (searchQuery.includes('youtube.com')) {
        try {
          const url = new URL(searchQuery);
          const playlistId = url.searchParams.get('list');
          if (playlistId) {
            params.playlistId = playlistId;
          } else {
            throw new Error('Invalid YouTube playlist URL');
          }
        } catch (err) {
          throw new Error('Invalid YouTube URL');
        }
      } 
      // Check if input looks like a playlist ID
      else if (/^(PL|UU|LL|FL|RD|OL)[a-zA-Z0-9_-]{16,}$/.test(searchQuery)) {
        params.playlistId = searchQuery;
      }
      // Otherwise, treat as search query
      else {
        params.query = searchQuery;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlist-videos`, {
        params,
        withCredentials: true
      });

      if (params.playlistId && response.data) {
        // Single playlist response
        setSearchResults([{
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          thumbnail: response.data.thumbnail,
          videoCount: response.data.videoCount,
          videos: response.data.videos,
          category: 'Technology'
        }]);
      } else if (response.data.playlists) {
        // Search results
        setSearchResults(response.data.playlists.map(playlist => ({
          id: playlist.id.playlistId,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          thumbnail: playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.default?.url,
          videoCount: 'N/A',
          category: 'Technology'
        })));
      }

      if (searchResults.length === 0) {
        setError('No playlists found for your search');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (playlist) => {
    if (!playlist.id) {
      setError('Invalid playlist ID');
      return;
    }
    navigate(`/playlist/${playlist.id}`);
  };

  const displayedPlaylists = searchResults.length > 0 ? searchResults : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter YouTube playlist URL or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPlaylists
          .filter(playlist => selectedCategory === 'All' || playlist.category === selectedCategory)
          .map((playlist, index) => (
            <PlaylistCard 
              key={playlist.id || index} 
              playlist={playlist}
              onStartLearning={handleStartLearning}
            />
          ))}
      </div>

      {displayedPlaylists.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No playlists found. Try searching for a YouTube playlist!
        </div>
      )}
    </div>
  );
};

export default Playlists;
