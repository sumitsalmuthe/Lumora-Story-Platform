import apiClient from "../api/apiClient";

const uploadService = {
  uploadImage: async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default uploadService;
