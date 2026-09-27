import apiClient from "../api/apiClient";

const storyService = {
  // Get all published public stories
  getStories: async () => {
    const response = await apiClient.get("/stories");
    return response.data;
  },

  // Get logged-in writer's stories
  getMyStories: async () => {
    const response = await apiClient.get("/stories/my");
    return response.data;
  },

  // Get public story
  getStoryById: async (storyId) => {
    const response = await apiClient.get(
      `/stories/${storyId}`
    );
    return response.data;
  },

  // Get writer-owned story for editing
  // Works with Draft / Private stories
  getMyStoryById: async (storyId) => {
    const response = await apiClient.get(
      `/stories/${storyId}/edit`
    );
    return response.data;
  },

  // Create story
  createStory: async (storyData) => {
    const response = await apiClient.post(
      "/stories",
      storyData
    );
    return response.data;
  },

  // Update story
  updateStory: async (storyId, storyData) => {
    const response = await apiClient.put(
      `/stories/${storyId}`,
      storyData
    );
    return response.data;
  },

  // Delete story
  deleteStory: async (storyId) => {
    const response = await apiClient.delete(
      `/stories/${storyId}`
    );
    return response.data;
  },

  // Publish story
  publishStory: async (storyId) => {
    const response = await apiClient.patch(
      `/stories/${storyId}/publish`
    );
    return response.data;
  },

  // Move story to draft
  draftStory: async (storyId) => {
    const response = await apiClient.patch(
      `/stories/${storyId}/draft`
    );
    return response.data;
  },

  // Complete story
  completeStory: async (storyId) => {
    const response = await apiClient.patch(
      `/stories/${storyId}/complete`
    );
    return response.data;
  },

  // Check like
  checkLike: async (storyId) => {
    const response = await apiClient.get(
      `/stories/${storyId}/check-like`
    );
    return response.data;
  },

  // Like story
  likeStory: async (storyId) => {
    const response = await apiClient.post(
      `/stories/${storyId}/like`
    );
    return response.data;
  },

  // Remove like
  removeLike: async (storyId) => {
    const response = await apiClient.delete(
      `/stories/${storyId}/like`
    );
    return response.data;
  },
};

export default storyService;