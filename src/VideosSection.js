import React, { useEffect, useState, useRef } from "react";

export default function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadedIds = useRef(new Set());

  const API_KEY = process.env.REACT_APP_YT_API_KEY;
  const CHANNEL_ID = "UCDWCeTKGu34VwsPMHWndBYw";
  const MAX_RESULTS = 6;

  const mockVideos = [
    {
      id: "Ea9GUgqgLfc",
      snippet: {
        title: "✨Dr. Upasana’s DIY DarkSpot, Redness & Skin Whitening Remedy – Get Glowing Skin at Home!#shorts#yt",
        publishedAt: "2025-02-20T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/Ea9GUgqgLfc/hqdefault.jpg" } }
      },
      statistics: { viewCount: "8135681" }
    },
    {
      id: "5bBjq2680G0",
      snippet: {
        title: "Durefishan’s Favorite DIY Home Remedies for Glowing & Whitening Skin!#durefishansaleem#short#diy",
        publishedAt: "2025-02-09T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/5bBjq2680G0/hqdefault.jpg" } }
      },
      statistics: { viewCount: "7489898" }
    },
    {
      id: "ube_GJWFjEg",
      snippet: {
        title: "Dr. Upasana’s Fast Hair Growth Challenge – Easy DIY Homemade Remedy!#haircare#drupasana#shorts#yt",
        publishedAt: "2025-02-24T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/ube_GJWFjEg/hqdefault.jpg" } }
      },
      statistics: { viewCount: "5047663" }
    },
    {
      id: "BBMx8bh9HMg",
      snippet: {
        title: "Dr. Upasana’s Effective Hair Growth Tips for Thick, Healthy Hair!#drupasana#haircare#shorts#ytshort",
        publishedAt: "2025-02-06T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/BBMx8bh9HMg/hqdefault.jpg" } }
      },
      statistics: { viewCount: "3744585" }
    },
    {
      id: "yUyo0W6wfj4",
      snippet: {
        title: "बालों को घना और लंबा बनाने के 100% असरदार घरेलू उपाय |Dr. Upasana’s Hair Growth Remedy!#shorts#hair",
        publishedAt: "2025-05-11T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/yUyo0W6wfj4/hqdefault.jpg" } }
      },
      statistics: { viewCount: "6179991" }
    },
    {
      id: "xgmuJWUPlNE",
      snippet: {
        title: "Homemade Facial Hair Removal – Easy & Natural Tips!#shorts#ytshort#facial#skincare",
        publishedAt: "2025-02-17T00:00:00Z",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/xgmuJWUPlNE/hqdefault.jpg" } }
      },
      statistics: { viewCount: "2223496" }
    }
  ];

  const fetchVideos = async (pageToken = "") => {
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("Missing API key");

      // 1. Fetch list of videos
      const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=${MAX_RESULTS}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("YouTube API request failed");
      const data = await res.json();

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

      // 2. Fetch statistics
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${newVideoIds.join(",")}&part=snippet,statistics`;
      const statsRes = await fetch(statsUrl);
      if (!statsRes.ok) throw new Error("YouTube Stats API failed");
      const statsData = await statsRes.json();

      setVideos(prev => [...prev, ...statsData.items]);
      setNextPageToken(data.nextPageToken || null);
      setError(null);
    } catch (err) {
      console.warn("Falling back to mock videos:", err.message);
      setVideos(mockVideos);
      setIsFallback(true);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset before fetching to prevent duplicate calls
    loadedIds.current = new Set();
    fetchVideos();
    // eslint-disable-next-line
  }, []);

  const totalViews = videos.reduce((acc, video) => acc + (parseInt(video.statistics.viewCount, 10) || 0), 0);
  const formattedTotalViews = totalViews.toLocaleString();

  return (
    <section id="videos" className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Most Viewed Videos</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Total Views: <strong>{formattedTotalViews}</strong></p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-pink-50 rounded-lg shadow hover:shadow-lg active:shadow-xl transition-shadow overflow-hidden">
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" className="block">
                <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} className="w-full h-40 sm:h-48 object-cover" />
              </a>
              <div className="p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{video.snippet.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{parseInt(video.statistics.viewCount).toLocaleString()} views</p>
                <p className="text-xs text-gray-600">{new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" className="inline-block mt-2 sm:mt-3 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg text-xs sm:text-sm hover:bg-pink-600 active:bg-pink-700 transition-colors">Watch Now</a>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {loading && <div className="mt-6 text-center text-pink-400">Loading…</div>}
        
        {nextPageToken && !loading && !isFallback && (
          <div className="flex mt-6 sm:mt-8 justify-center">
            <button
              className="px-5 sm:px-6 py-2 sm:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 active:bg-pink-700 shadow text-sm sm:text-base transition-colors"
              onClick={() => fetchVideos(nextPageToken)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
