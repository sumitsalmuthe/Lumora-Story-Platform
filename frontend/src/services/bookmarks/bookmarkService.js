import apiClient from "../api/apiClient";

const bookmarkService = {
  getBookmarks: async () => (await apiClient.get("/bookmarks")).data,
  checkBookmark: async (storyId) => (await apiClient.get(`/bookmarks/check/${storyId}`)).data,
  addBookmark: async (storyId) => (await apiClient.post(`/bookmarks/${storyId}`)).data,
  removeBookmark: async (storyId) => (await apiClient.delete(`/bookmarks/${storyId}`)).data,
};

export default bookmarkService;
