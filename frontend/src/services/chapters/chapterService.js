import apiClient from "../api/apiClient";

const chapterService = {
  // Get all published chapters of a story
  getChaptersByStory: async (storyId) => {
    const response = await apiClient.get(`/chapters/story/${storyId}`);
    return response.data;
  },

  // Get a single chapter
  getChapterById: async (chapterId) => {
    const response = await apiClient.get(`/chapters/${chapterId}`);
    return response.data;
  },

  // Create a new chapter
  createChapter: async (chapterData) => {
    const response = await apiClient.post("/chapters", chapterData);
    return response.data;
  },

  // Update chapter title/content
  updateChapter: async (chapterId, chapterData) => {
    const response = await apiClient.put(
      `/chapters/${chapterId}`,
      chapterData
    );
    return response.data;
  },

  // Publish chapter
  publishChapter: async (chapterId) => {
    const response = await apiClient.patch(
      `/chapters/${chapterId}/publish`
    );
    return response.data;
  },

  // Move chapter back to draft
  draftChapter: async (chapterId) => {
    const response = await apiClient.patch(
      `/chapters/${chapterId}/draft`
    );
    return response.data;
  },

  // Delete chapter
  deleteChapter: async (chapterId) => {
    const response = await apiClient.delete(`/chapters/${chapterId}`);
    return response.data;
  },
};

export default chapterService;