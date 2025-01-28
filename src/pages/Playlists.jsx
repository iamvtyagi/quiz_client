import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoChevronDownOutline } from 'react-icons/io5';

const PlaylistCard = ({ title, category, videoCount, progress, status }) => {
  const progressWidth = `${(progress.completed / progress.total) * 100}%`;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Playlist Thumbnail */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <h3 className="text-xl text-gray-400 font-medium">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 mb-2">
          {category}
        </span>
        <p className="text-sm text-gray-500 mb-2">{videoCount} videos</p>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.completed}/{progress.total} completed</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          {status === 'not-started' ? 'Start Learning' : 'Continue Learning'}
        </button>
      </div>
    </div>
  );
};

const Playlists = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Technology', 'Science', 'Business', 'Design'];
  
  const playlists = [
    {
      title: 'JavaScript Fundamentals',
      category: 'Technology',
      videoCount: 10,
      progress: { completed: 3, total: 10 },
      status: 'in-progress'
    },
    {
      title: 'React Basics',
      category: 'Technology',
      videoCount: 8,
      progress: { completed: 0, total: 8 },
      status: 'not-started'
    },
    {
      title: 'Python for Beginners',
      category: 'Technology',
      videoCount: 12,
      progress: { completed: 6, total: 12 },
      status: 'in-progress'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search playlists..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Science</option>
                <option>Business</option>
                <option>Design</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500">
                <option>Sort By</option>
                <option>Latest</option>
                <option>Popular</option>
                <option>Progress</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist, index) => (
          <PlaylistCard key={index} {...playlist} />
        ))}
      </div>
    </div>
  );
};

export default Playlists;
