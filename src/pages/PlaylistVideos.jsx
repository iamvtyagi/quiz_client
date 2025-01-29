import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiYoutube, FiClock, FiCalendar, FiPlay } from 'react-icons/fi';
import axios from 'axios';
import QuizComponent from '../components/Quiz';

const VideoPlayer = ({ videoId }) => {
  if (!videoId) return null;
  
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const VideoCard = ({ video, onVideoSelect, isActive }) => {
  if (!video?.snippet) return null;
  
  const { title, description, thumbnails, publishedAt } = video.snippet;

  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer
        ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onVideoSelect(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative group">
        <img 
          src={thumbnails?.high?.url || thumbnails?.default?.url}
          alt={title}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FiPlay className="text-white text-6xl" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h4>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        
        {/* Metadata */}
        <div className="flex items-center text-xs text-gray-400 gap-4">
          <div className="flex items-center gap-1">
            <FiCalendar />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaylistVideos = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlist-videos`, {
          params: { playlistId }
        });
        
        const { playlist: playlistData, items: videoData } = response.data;
        
        setPlaylist(playlistData);
        setVideos(videoData || []);
        if (videoData?.length > 0) {
          setSelectedVideo(videoData[0]);
        }
        
      } catch (error) {
        console.error('Error fetching playlist data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  const handleVideoSelect = async (video) => {
    setSelectedVideo(video);
    setShowQuiz(false);
    setTranscript('');

    try {
      // Fetch transcript when video is selected
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transcript`, {
        params: { videoId: video.contentDetails.videoId }
      });
      setTranscript(response.data.transcript);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  const handleQuizClick = async () => {
    if (!selectedVideo) return;

    setLoadingTranscript(true);
    try {
      // Using a sample transcript for now since the actual transcript endpoint is not available
      const sampleTranscript = `This is a sample transcript for video ${selectedVideo.contentDetails.videoId}.
        The video covers important topics and concepts related to the subject matter.
        Key points discussed include:
        - Introduction to the topic
        - Main concepts and theories
        - Practical examples and applications
        - Summary and conclusions`;
      
      // Navigate to quiz page with the transcript
      navigate(`/quiz/${selectedVideo.contentDetails.videoId}`, {
        state: { transcript: sampleTranscript }
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to prepare quiz. Please try again.');
    } finally {
      setLoadingTranscript(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/playlists')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">No videos found in this playlist.</p>
        <button 
          onClick={() => navigate('/playlists')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {playlist?.snippet?.title || 'Learning Playlist'}
          </h1>
          <p className="text-gray-600 mt-2">
            {playlist?.snippet?.channelTitle} • {videos.length} videos
          </p>
        </div>
        <button 
          onClick={() => navigate('/playlists')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Video Player and Info */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVideo && (
            <>
              <VideoPlayer videoId={selectedVideo.contentDetails?.videoId} />
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedVideo.snippet.title}
                  </h2>
                  <button
                    onClick={handleQuizClick}
                    disabled={loadingTranscript}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      loadingTranscript 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loadingTranscript ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Loading...
                      </div>
                    ) : 'Take Quiz'}
                  </button>
                </div>
                <p className="text-gray-600">
                  {selectedVideo.snippet.description}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Playlist Videos</h3>
            <p className="text-sm text-gray-500">{videos.length} videos</p>
          </div>
          
          {/* Video List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {Array.isArray(videos) && videos.map((video, index) => (
              <VideoCard
                key={`${video.contentDetails?.videoId}-${index}`}
                video={video}
                onVideoSelect={handleVideoSelect}
                isActive={selectedVideo?.contentDetails?.videoId === video.contentDetails?.videoId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistVideos;