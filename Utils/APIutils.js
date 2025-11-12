/*import { request } from '@playwright/test';

export class APIutils {
    constructor() {
        this.baseURL = 'http://49.249.28.218:8098';
    }
    async getLoginToken()
    {
    const apiContext = await request.newContext({
        baseURL: this.baseURL,
        httpCredentials: {
            username: 'rmgyantra',
            password: 'rmgy@9999'
        },
        extraHTTPHeaders: {
            'Accept': 'application/json'
        }
    });

        const response = await apiContext.get('/login');
        const jsonData = await response.json();
        const accessToken = jsonData.jwtToken;
        return {
            Token: accessToken,
            apiContext: apiContext
        };
    }
    async createAuthenicatedContext() {
        const {Token, apiContext} = await this.getLoginToken();
        const authContext = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${Token}`,
                'Accept': 'application/json'
            }
        });
        return authContext;
        }
    }
        */
    