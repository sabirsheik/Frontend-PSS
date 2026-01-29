/**
 * ============================================================
 * API Fetch Utility
 * ============================================================
 * 
 * A centralized HTTP client for making API requests.
 * Provides consistent error handling, authentication, and
 * request/response processing across the application.
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Credential handling for authentication cookies
 * - Standardized error responses
 * - TypeScript generics for type-safe responses
 * 
 * @module Hook/api/fetchApi
 */

/** Base URL for all API requests */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Extended fetch options with body typing
 * Body can be any object that will be JSON serialized
 */
interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: object | FormData | null;
}

/**
 * Standard API error response structure
 */
interface ApiError {
  status: "fail" | "error";
  message: string;
}

/**
 * Custom error class for API errors
 * Provides additional context for error handling in components
 */
export class ApiRequestError extends Error {
  public statusCode: number;
  public isNetworkError: boolean;

  constructor(message: string, statusCode: number = 500, isNetworkError = false) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

/**
 * Generic API fetch function with type safety
 * 
 * Makes HTTP requests to the backend API with consistent
 * configuration and error handling. All requests include
 * credentials for cookie-based authentication.
 * 
 * @template T - Expected response data type
 * @param {string} endpoint - API endpoint (starts with /)
 * @param {FetchOptions} options - Fetch configuration options
 * @returns {Promise<T>} Parsed JSON response
 * @throws {ApiRequestError} On request failure
 * 
 * @example
 * // GET request
 * const users = await apiFetch<User[]>("/api/users");
 * 
 * @example
 * // POST request with body
 * const result = await apiFetch<{ message: string }>("/api/auth/login", {
 *   method: "POST",
 *   body: { email: "user@example.com", password: "password" },
 * });
 */
const apiFetch = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  // Construct full URL from base and endpoint
  const url = `${API_BASE_URL}${endpoint}`;

  // Build request configuration
  const config: RequestInit = {
    // Include cookies for authentication
    credentials: "include",
    
    // Set headers with defaults
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    
    // Spread remaining options
    ...options,
  };

  // Serialize body if present and is an object
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    // Execute the request
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      // Special handling for auth check endpoint
      // Returns null instead of throwing for unauthorized
      if (endpoint === "/api/auth/user" && response.status === 401) {
        return null as T;
      }

      // Parse error response
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { status: "error", message: "An unexpected error occurred" };
      }

      throw new ApiRequestError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status
      );
    }

    // Parse and return successful response
    const data = await response.json();
    return data as T;
    
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiRequestError(
        "Unable to connect to the server. Please check your internet connection.",
        0,
        true
      );
    }

    // Re-throw ApiRequestError as-is
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Handle unknown errors
    throw new ApiRequestError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

export default apiFetch;
