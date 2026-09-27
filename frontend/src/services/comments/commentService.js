import apiClient from "../api/apiClient";

const commentService = {
  // Get all comments of a story
  getStoryComments: async (storyId) => {
    const response = await apiClient.get(`/comments/${storyId}`);
    return response.data;
  },

  // Add new comment
  createComment: async (storyId, content) => {
    const response = await apiClient.post(`/comments/${storyId}`, {
      content,
    });

    return response.data;
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const response = await apiClient.put(`/comments/${commentId}`, {
      content,
    });

    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Get replies
  getReplies: async (commentId) => {
    const response = await apiClient.get(
      `/comments/replies/${commentId}`
    );

    return response.data;
  },

  // Add reply
  replyToComment: async (commentId, content) => {
    const response = await apiClient.post(
      `/comments/${commentId}/reply`,
      {
        content,
      }
    );

    return response.data;
  },

  // Check comment like
  checkLike: async (commentId) => {
    const response = await apiClient.get(
      `/comments/${commentId}/check-like`
    );

    return response.data;
  },

  // Like comment
  likeComment: async (commentId) => {
    const response = await apiClient.post(
      `/comments/${commentId}/like`
    );

    return response.data;
  },

  // Remove comment like
  removeLike: async (commentId) => {
    const response = await apiClient.delete(
      `/comments/${commentId}/like`
    );

    return response.data;
  },
};

export default commentService;