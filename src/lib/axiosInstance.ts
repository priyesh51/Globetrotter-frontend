import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

// Add a response interceptor (optional, for response-specific handling)
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * Function to make a GET request
 * @param {string} url - The endpoint to fetch data from (relative to the baseURL)
 * @param {object} [params={}] - Query parameters for the request
 * @param {number} [retries=3] - Number of retry attempts for timeout errors
 * @returns {Promise<any>} - A promise resolving with the response data
 */
export async function get(url: string, params = {}, retries = 3) {
  try {
    const response = await axiosInstance.get(url, {
      params: {
        ...params,
        api_key: process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    return response.data;
  } catch (error: any) {
    // Retry logic for timeout errors
    if (error.code === "ECONNABORTED" && retries > 0) {
      console.warn("Request timed out. Retrying...", { url, params });
      return get(url, params, retries - 1);
    }

    showError(error);
    throw error; // Rethrow the error for further handling if needed
  }
}

/**
 * Function to make a POST request
 * @param {string} url - The endpoint to send data to (relative to the baseURL)
 * @param {object} data - The body of the request to send
 * @param {object} [params={}] - Query parameters for the request
 * @param {number} [retries=3] - Number of retry attempts for timeout errors
 * @returns {Promise<any>} - A promise resolving with the response data
 */
export async function post(
  url: string,
  data: object,
  params = {},
  retries = 3
): Promise<any> {
  try {
    const response = await axiosInstance.post(url, data, {
      params: {
        ...params,
        api_key: process.env.NEXT_PUBLIC_API_KEY, // Adding the API key if needed
      },
    });

    return response.data;
  } catch (error: any) {
    // Retry logic for timeout errors
    if (error.code === "ECONNABORTED" && retries > 0) {
      console.warn("Request timed out. Retrying...", { url, params, data });
      return post(url, data, params, retries - 1);
    }

    // Handle and log error
    showError(error);
    throw error; // Rethrow the error for further handling if needed
  }
}

/**
 * Function to handle and display errors
 * @param {Error} error - The error object
 */
export function showError(error: AxiosError | any) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = (<any>error.response?.data)?.message || error.message;

    console.log(status, error);

    // Handle specific HTTP status codes with toast notifications
    switch (status) {
      case 400:
        console.error("Bad Request: Please check your input.");
        break;
      case 401:
        console.warn("Unauthorized: Please log in again.");
        break;
      case 403:
        console.error(
          "Forbidden: You do not have permission to access this resource."
        );
        break;
      case 404:
        console.info("Not Found: The requested resource could not be found.");
        break;
      case 500:
        console.error(
          "Internal Server Error: Something went wrong on the server."
        );
        break;
      default:
        console.error(`Error: ${message || "Something went wrong!"}`);
    }

    console.error("Axios error details:", {
      status,
      data: error.response?.data,
      headers: error.response?.headers,
      request: error.config,
    });
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response received:", error.request);
    console.warn("No response from the server. Please check your network.");
  } else {
    // Something else happened during request setup
    console.error("Unexpected error:", error.message);
    console.error("An unexpected error occurred. Please try again.");
  }
}
