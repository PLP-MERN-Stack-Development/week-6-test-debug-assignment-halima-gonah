import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);

    // Handle network errors
    if (!error.response) {
      throw new Error("Network error - please check your connection");
    }

    // Handle API errors
    const message = error.response.data?.message || "An error occurred";
    throw new Error(message);
  }
);

export const bugService = {
  // Get all bugs with optional filters
  async getAllBugs(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.order) params.append("order", filters.order);

      const response = await api.get(`/bugs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bugs:", error);
      throw error;
    }
  },

  // Get single bug by ID
  async getBugById(id) {
    try {
      const response = await api.get(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bug:", error);
      throw error;
    }
  },

  // Create new bug
  async createBug(bugData) {
    try {
      const response = await api.post("/bugs", bugData);
      return response.data;
    } catch (error) {
      console.error("Error creating bug:", error);
      throw error;
    }
  },

  // Update existing bug
  async updateBug(id, updateData) {
    try {
      const response = await api.put(`/bugs/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating bug:", error);
      throw error;
    }
  },

  // Delete bug
  async deleteBug(id) {
    try {
      const response = await api.delete(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting bug:", error);
      throw error;
    }
  },
};
