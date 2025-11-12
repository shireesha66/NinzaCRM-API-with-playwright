 // Utils/Fixture.js
import { request } from '@playwright/test';

/**
 * Login as a regular user and return JWT token
 * @param {string} username
 * @param {string} password
 */
export async function loginAsUser(username, password) {
  const apiContext = await request.newContext({
    baseURL: 'http://49.249.28.218:8098',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const response = await apiContext.post('/login', {
    data: { username, password },
  });

  if (!response.ok()) {
    throw new Error(`User login failed! Status: ${response.status()}`);
  }

  const body = await response.json();
  return body.jwtToken;
}

/**
 * Login as admin and return JWT token
 * @param {string} username
 * @param {string} password
 */
export async function loginAsAdmin(username, password) {
  const apiContext = await request.newContext({
    baseURL: 'http://49.249.28.218:8098',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const response = await apiContext.post('/login', {
    data: { username, password },
  });

  if (!response.ok()) {
    throw new Error(`Admin login failed! Status: ${response.status()}`);
  }

  const body = await response.json();
  return body.jwtToken;
}
