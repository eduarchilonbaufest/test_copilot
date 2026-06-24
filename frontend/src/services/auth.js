/**
 * auth.js — Service layer for JWT authentication.
 * Communicates with the FastAPI backend via the Vite dev-server proxy (/api).
 */

const BASE_URL = '/api'

/**
 * Exchange username + password for an access/refresh token pair.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access_token: string, refresh_token: string, token_type: string}>}
 */
export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Credenciales inválidas')
  }

  return response.json()
}

/**
 * Request a new token pair using a refresh token.
 * @param {string} refreshToken
 * @returns {Promise<{access_token: string, refresh_token: string, token_type: string}>}
 */
export async function refreshTokens(refreshToken) {
  const response = await fetch(`${BASE_URL}/token/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('No se pudo renovar la sesión')
  }

  return response.json()
}
