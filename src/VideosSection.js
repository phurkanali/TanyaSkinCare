import React, { useEffect, useState, useRef } from "react";

export default function VideosSection() {
  const [videos, setVideos] = useState([]);         // Videos with statistics
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadedIds = useRef(new Set());

  const API_KEY = process.env.REACT_APP_YT_API_KEY;
  const CHANNEL_ID = "UCDWCeTKGu34VwsPMHWndBYw";
  const MAX_RESULTS = 6;

  // Fetch videos and their stats
  const fetchVideos = async (pageToken = "") => {
    setLoading(true);
    try {
      // 1. Fetch list of videos
      const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=${MAX_RESULTS}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      // Filter unique video IDs
      const newVideoIds = [];
      (data.items || []).forEach(item => {
        if (item.id.videoId && !loadedIds.current.has(item.id.videoId)) {
          newVideoIds.push(item.id.videoId);
          loadedIds.current.add(item.id.videoId);
        }
      });

      if (newVideoIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch statistics for these videos
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${newVideoIds.join(",")}&part=snippet,statistics`;
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();

      // 3. Append new videos with stats to state
      setVideos(prev => [...prev, ...statsData.items]);
      setNextPageToken(data.nextPageToken || null);
      setError(null);
    } catch (err) {
      setError("Failed to load videos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
    loadedIds.current = new Set();
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    if (nextPageToken && !loading) {
      fetchVideos(nextPageToken);
    }
  };

  // Calculate total views (as a number)
  const totalViews = videos.reduce((acc, video) => {
    return acc + (parseInt(video.statistics.viewCount, 10) || 0);
  }, 0);

  // Format total views to readable string (e.g. 1,234,567)
  const formattedTotalViews = totalViews.toLocaleString();

  return (
    <section id="videos" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-gray-900 mb-2">
          Most Viewed Videos
        </h3>

        {/* Show total views here */}
        <p className="text-sm text-gray-600 mb-6">
          Total Views: <strong>{formattedTotalViews}</strong>
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-pink-50 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900">{video.snippet.title}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {parseInt(video.statistics.viewCount).toLocaleString()} views
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                >
                  Watch Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {loading && <div className="mt-6 text-center text-pink-400">Loading…</div>}
        {nextPageToken && !loading && (
          <div className="flex mt-8 justify-center">
            <button
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 shadow"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
