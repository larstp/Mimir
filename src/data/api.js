// API Configuration
const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "5675182f-6235-417b-9d7e-a958ee20bd00";

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The auth token or null
 */
function getAuthToken() {
  return localStorage.getItem("authToken");
}

/**
 * Gets the username from localStorage
 * @returns {string|null} The username or null
 */
export function getUserName() {
  return localStorage.getItem("userName");
}

/**
 * Saves authentication data to localStorage
 * @param {string} token - The auth token
 * @param {string} name - The username
 */
function saveAuth(token, name) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userName", name);
}

/**
 * Clears auth data from localStorage
 */
function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userName");
}

/**
 * Makes an authenticated API request
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} The API response data
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errors?.[0]?.message || "API request failed");
  }

  // Return empty object for 204 No Content (CoPilot suggested this, not sure if it's needed)
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

// ---------------------------------------------------------------------AUTH ENDPOINTS

/**
 * Registers a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - Username (no punctuation except _)
 * @param {string} userData.email - Email (must be @stud.noroff.no)
 * @param {string} userData.password - Password (min 8 characters)
 * @param {string} [userData.bio] - User bio (max 160 characters)
 * @param {object} [userData.avatar] - Avatar image ---------------------------- remove if unnecessary
 * @param {object} [userData.banner] - Banner image ---------------------------- remove if unnecessary
 * @returns {Promise<object>} The registered user data
 */
export async function register(userData) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return response.data;
}

/**
 * Logs in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} The user data and token
 */
export async function login(email, password) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  saveAuth(response.data.accessToken, response.data.name);

  return response.data;
}

/**
 * Logs out the current user
 */
export function logout() {
  clearAuth();
}

/**
 * Checks if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isLoggedIn() {
  return !!getAuthToken();
}

// ------------------------------------------------------------------------POST ENDPOINTS

/**
 * Gets all posts from the feed
 * @param {object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=12] - Posts per page
 * @param {string} [options.sort] - Field to sort by
 * @param {string} [options.sortOrder] - Sort order (asc or desc to mimic users post being added to top)
 * @param {boolean} [options._author=true] - Include author data
 * @param {boolean} [options._comments=false] - Include comments
 * @param {boolean} [options._reactions=false] - Include reactions
 * @returns {Promise<object>} Posts data with meta information
 */
export async function getAllPosts(options = {}) {
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 12,
    _author: options._author !== false, // -----------------------------------------Default to true
    _comments: options._comments || false,
    _reactions: options._reactions || false,
  });

  if (options.sort) {
    params.append("sort", options.sort);
  }
  if (options.sortOrder) {
    params.append("sortOrder", options.sortOrder);
  }

  const response = await apiRequest(`/social/posts?${params}`);
  return response;
}

/**
 * Gets a single post by ID
 * @param {number} id - The post ID
 * @param {object} options - Query options
 * @returns {Promise<object>} The post data
 */
export async function getPost(id, options = {}) {
  const params = new URLSearchParams({
    _author: options._author !== false,
    _comments: options._comments !== false,
    _reactions: options._reactions || false,
  });

  const response = await apiRequest(`/social/posts/${id}?${params}`);
  return response.data;
}

/**
 * Creates a new post
 * @param {object} postData - Post data
 * @param {string} postData.title - Post title (required)
 * @param {string} [postData.body] - Post body text
 * @param {string[]} [postData.tags] - Post tags
 * @param {object} [postData.media] - Post media (image)
 * @returns {Promise<object>} The created post data
 */
export async function createPost(postData) {
  const response = await apiRequest("/social/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
  return response.data;
}

/**
 * Updates an existing post
 * @param {number} id - The post ID
 * @param {object} postData - Updated post data
 * @returns {Promise<object>} The updated post data
 */
export async function updatePost(id, postData) {
  const response = await apiRequest(`/social/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });
  return response.data;
}

/**
 * Deletes a post
 * @param {number} id - The post ID
 * @returns {Promise<object>} Empty object on success
 */
export async function deletePost(id) {
  return apiRequest(`/social/posts/${id}`, {
    method: "DELETE",
  });
}

/**
 * Reacts to a post (toggles reaction - adds if not present, removes if present)
 * @param {number} id - The post ID
 * @param {string} symbol - The reaction symbol (emoji)
 * @returns {Promise<object>} Updated post reactions
 */
export async function reactToPost(id, symbol = "👍") {
  const response = await apiRequest(`/social/posts/${id}/react/${symbol}`, {
    method: "PUT",
  });
  return response.data;
} // This I have NOT gotten to work. I only get errors from the API when trying to react to a post. I've tried everything I can think of, but I won't have time to figure it out.

/**
 * Searches for posts
 * @param {string} query - Search query
 * @returns {Promise<object>} Search results
 */
export async function searchPosts(query, options = {}) {
  const params = new URLSearchParams({
    q: query,
    _author: options._author || false,
    _reactions: options._reactions || false,
    _comments: options._comments || false,
  });

  const response = await apiRequest(`/social/posts/search?${params}`);
  return response;
}

// -------------------------------------------------------------------------PROFILE ENDPOINTS

/**
 * Gets a profile by username
 * @param {string} name - The username
 * @param {object} options - Query options
 * @returns {Promise<object>} The profile data
 */
export async function getProfile(name, options = {}) {
  const params = new URLSearchParams({
    _posts: options._posts || false,
    _followers: options._followers || false,
    _following: options._following || false,
  });

  const response = await apiRequest(`/social/profiles/${name}?${params}`);
  return response.data;
}

/**
 * Gets all posts by a specific user
 * @param {string} name - The username
 * @param {object} options - Query options
 * @returns {Promise<object>} Posts data
 */
export async function getPostsByUser(name, options = {}) {
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 12,
    _author: options._author !== false,
    _comments: options._comments || false,
    _reactions: options._reactions || false,
  });

  const response = await apiRequest(`/social/profiles/${name}/posts?${params}`);
  return response;
}

/**
 * Updates the current user's profile
 * @param {string} name - The username to update
 * @param {object} profileData - Updated profile data
 * @returns {Promise<object>} The updated profile data
 */
export async function updateProfile(name, profileData) {
  const response = await apiRequest(`/social/profiles/${name}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  return response.data;
}

/**
 * Follows a user
 * @param {string} name - The username to follow
 * @returns {Promise<object>} Updated followers/following data
 */
export async function followUser(name) {
  const response = await apiRequest(`/social/profiles/${name}/follow`, {
    method: "PUT",
  });
  return response.data;
}

/**
 * Unfollows a user
 * @param {string} name - The username to unfollow
 * @returns {Promise<object>} Updated followers/following data
 */
export async function unfollowUser(name) {
  const response = await apiRequest(`/social/profiles/${name}/unfollow`, {
    method: "PUT",
  });
  return response.data;
}
