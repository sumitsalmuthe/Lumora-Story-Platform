import apiClient from "../api/apiClient";

const historyService = {
  getHistory: async () => (await apiClient.get("/history")).data,
  updateHistory: async (storyId, lastChapter) => (
    await apiClient.post(`/history/${storyId}`, { lastChapter })
  ).data,
};

export default historyService;
