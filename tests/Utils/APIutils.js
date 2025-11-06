import { request } from '@playwright/test';

export class APIUtils {
    constructor() {
        this.baseURL = 'http://49.249.28.218:8098';
    }

    async getLoginToken() {
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
            token: accessToken,
            apiContext: apiContext
        };
    }

    async createAuthenticatedContext() {
        const { token, apiContext } = await this.getLoginToken();
        
        // Add the token to all future requests
        await apiContext.setExtraHTTPHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        });

        return apiContext;
    }
}
