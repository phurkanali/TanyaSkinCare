// src/services/socialMediaService.js

// YouTube Stats - Only subs and total views
export const fetchYouTubeStats = async (channelId) => {
  try {
    const response = await fetch(`https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch YouTube data');
    const data = await response.json();
    
    // Extract subscriber count (prefer est_sub for real-time data)
    const subscribers = data.est_sub || data.API_sub || 0;
    
    // Extract total channel views from the table array
    let views = 0;
    if (data.table && Array.isArray(data.table)) {
      const viewsData = data.table.find(item => item.name === "Channel Views");
      views = viewsData ? viewsData.count : 0;
    }
    
    return {
      subscribers: subscribers,    // 158,011
      views: views                // 111,295,555
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    return null;
  }
};

// Instagram Stats (manual for now)
export const fetchInstagramStats = async (username) => {
  return {
    followers: 54000 // Update this manually with your real Instagram count
  };
};

// Combined stats fetcher
export const fetchAllSocialStats = async (youtubeChannelId, instagramUsername) => {
  const [youtubeData, instagramData] = await Promise.allSettled([
    fetchYouTubeStats(youtubeChannelId),
    fetchInstagramStats(instagramUsername)
  ]);

  return {
    youtube: youtubeData.status === 'fulfilled' ? youtubeData.value : null,
    instagram: instagramData.status === 'fulfilled' ? instagramData.value : null
  };
};
