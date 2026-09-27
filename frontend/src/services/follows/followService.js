import apiClient from "../api/apiClient";

const followService = {
  // Check whether current user follows this writer
  checkFollowing: async (writerId) => {
    const response = await apiClient.get(
      `/follows/exists/${writerId}`
    );

    return response.data;
  },

  // Follow writer
  followWriter: async (writerId) => {
    const response = await apiClient.post(
      `/follows/${writerId}`
    );

    return response.data;
  },

  // Unfollow writer
  unfollowWriter: async (writerId) => {
    const response = await apiClient.delete(
      `/follows/${writerId}`
    );

    return response.data;
  },

  // Get writer follower count
  getFollowerCount: async (writerId) => {
    const response = await apiClient.get(
      `/follows/${writerId}/followers/count`
    );

    return response.data;
  },
};

export default followService;