import { test, expect, request } from '@playwright/test';


// login with valid credentials and reuse JWT token

test.describe('contact_controller', () => {

  test('Login', async () => {
    // ✅ Create API context with httpCredentials (Basic Auth)
    const apiContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      httpCredentials: {
        username: 'nonadminuser',
        password: 'nonadminpassword'
      },
      extraHTTPHeaders: {
        'Accept': 'application/json'
      }
    });

    // ✅ GET /login
    const response = await apiContext.get('/login');
    expect(response.status()).toBe(202);

    const jsonData = await response.json();
    console.log('Login Response:', jsonData);

    // ✅ Extract JWT token
    const accessToken = jsonData.jwtToken;
    expect(accessToken).toBeTruthy();
    console.log('✅ JWT Access Token:', accessToken);

    // ✅ Use JWT token for secured API request
    const adminResponse = await apiContext.get('/admin/console', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    console.log('Admin Console Status:', adminResponse.status());
    expect(adminResponse.status()).toBe(403);
    // console.log('Admin Console Response:', await adminResponse.text());
  });
 

});