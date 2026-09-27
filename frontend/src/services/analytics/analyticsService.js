import apiClient from "../api/apiClient";

const analyticsService = {
  // Writer dashboard analytics
  getDashboardSummary: async () => {
    const response = await apiClient.get(
      "/analytics/dashboard"
    );

    return response.data;
  },

  // Analytics for one story
  getStoryAnalytics: async (storyId) => {
    const response = await apiClient.get(
      `/analytics/story/${storyId}`
    );

    return response.data;
  },

  // Writer followers
  getFollowersAnalytics: async () => {
    const response = await apiClient.get(
      "/analytics/followers"
    );

    return response.data;
  },

  // Reviews received on writer's stories
  getReviewsAnalytics: async () => {
    const response = await apiClient.get(
      "/analytics/reviews"
    );

    return response.data;
  },
};

export default analyticsService;