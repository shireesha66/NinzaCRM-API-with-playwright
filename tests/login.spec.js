import { test, expect, request } from '@playwright/test';


// login with valid credentials and reuse JWT token

test.describe('Admin Login API Automation', () => {

  test('Login and reuse JWT token', async () => {
    // ✅ Create API context with httpCredentials (Basic Auth)
    const apiContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      httpCredentials: {
        username: 'rmgyantra',
        password: 'rmgy@9999'
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
    expect(adminResponse.status()).toBe(200);
    // console.log('Admin Console Response:', await adminResponse.text());
  });

});



// login with invalid credentials

test('Login with invalid credintials', async () => {
    // ✅ Create API context with httpCredentials (Basic Auth)
    const apiContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      httpCredentials: {
        username: 'rmgyantra',
        password: 'rmgy'
      },
      extraHTTPHeaders: {
        'Accept': 'application/json'
      }
    });

    // ✅ GET /login
    const response = await apiContext.get('/login');
    expect(response.status()).toBe(401);
    console.log('Invalid Login Response Status:', response.status());

});


// login with missing credentials

test('login with missing credintials', async () => {

    const apiContext = await request.newContext({
        baseURL : 'http://49.249.28.218:8098',
        extraHTTPHeaders: {
            'Accept': 'application/json'
          }

    });
    const response = await apiContext.get('/login');
    expect(response.status()).toBe(401);
    console.log('Missing Credentials Login Response Status:', response.status());
    

});

//login with empty authentication credentials

test ('login with empty authentication credintials', async () => {
    const apiContext = await request.newContext({
        baseURL : 'http://49.249.28.218:8098',
        httpCredentials: {
            username: '',
            password: ''
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
          }

    });
    const response = await apiContext.get('/login');
    expect (response.status()).toBe(401);
    console.log ('Empty Credentials Login Response Status:', response.status()); 
});



//login using POST method

test('login using POST method', async () => {
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098'
    });

    const response = await apiContext.post('/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username: 'rmgyantra',
            password: 'rmgy@9999'

        }
    });

    expect(response.status()).toBe(401);
    console.log('POST Login Response Status:', response.status());
    console.log('POST Login Response Body:', await response.text());
});




//login endpoint handles sql injection safely

test('login endpoint handles sql injection safely', async () => {
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098'
    });

    // Example SQL injection attempt
    const response = await apiContext.get('/login', {
        httpCredentials: {
            username: "admin' OR '1'='1",
            password: "anything"
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    expect(response.status()).toBe(401);
    console.log('SQL Injection Attempt Response Status:', response.status());
});




// verify login response time

test('verify login response time', async () => {
   
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098'
    });
     const start = Date.now();
    const response = await apiContext.get('/login' , {
        httpCredentials : {
            username : 'rmgyantra',
            password : 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    const end = Date.now();
const responseTime = end - start;
console.log('Response time (ms):', responseTime);
}),




//Verify login returns token format correctly

test('Verify login returns token format correctly', async () => {
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098',
        httpCredentials: {
            username: 'rmgyantra',
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    const response = await apiContext.get('/login');
    expect(response.status()).toBe(202);

    const jsonData = await response.json();
    const token = jsonData.jwtToken;

    expect(token).toBeTruthy();

    const tokenParts = token.split('.');
    expect(tokenParts).toHaveLength(3);

    tokenParts.forEach(part => {
        expect(part).toBeTruthy();
    });

    console.log('token format is valid');
});





//verify case sensitivity username
test('Verify username case sensitivity', async () => {
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098'
    });

    // Test with original case
    const normalResponse = await apiContext.get('/login', {
        httpCredentials: {
            username: 'rmgyantra',
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    // Test with uppercase username
    const uppercaseResponse = await apiContext.get('/login', {
        httpCredentials: {
            username: 'RMGYANTRA',
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    // Test with mixed case username
    const mixedCaseResponse = await apiContext.get('/login', {
        httpCredentials: {
            username: 'RmGyAnTrA',
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    // Log the results
    console.log('Normal case status:', normalResponse.status());
    console.log('Uppercase status:', uppercaseResponse.status());
    console.log('Mixed case status:', mixedCaseResponse.status());

    // Verify if the API is case sensitive or case insensitive
    // If case sensitive, only normal case should work (202)
    // If case insensitive, all should work (202)
    const isCaseSensitive = (normalResponse.status() === 202) && 
                           (uppercaseResponse.status() === 401) && 
                           (mixedCaseResponse.status() === 401);

    console.log('API is case sensitive:', isCaseSensitive);
});
    




//Verify login with special characters in username

test('Login with special characters in username', async () => {
    const apiContext = await request.newContext({
        baseURL: 'http://49.249.28.218:8098'
    });

    const response = await apiContext.get('/login', {
        httpCredentials: {
            username: 'rmgyantra!@#$', // username with special characters
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

    // Expect unauthorized (401) or whatever is appropriate for your API
    expect([401, 400, 404]).toContain(response.status());
    console.log('Special character username login status:', response.status());
});



        


   