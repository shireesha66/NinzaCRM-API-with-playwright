import { test, expect } from '@playwright/test';
import { APIUtils } from './Utils/APIutils';

test.describe('Campaign Controller Tests', () => {
    let apiContext;
    let apiUtils;

    test.beforeAll(async () => {
        apiUtils = new APIUtils();
        apiContext = await apiUtils.createAuthenticatedContext();
    });

    test('Create a new campaign', async () => {
        const response = await apiContext.post('/campaigns', {
            data: {
                // Add your campaign data here
                name: 'Test Campaign',
                description: 'Test campaign description',
                // Add other required fields
            }
        });

        expect(response.status()).toBe(201); // Or whatever status code your API returns
        const jsonResponse = await response.json();
        console.log('Campaign created:', jsonResponse);
    });

    test('Get all campaigns', async () => {
        const response = await apiContext.get('/campaigns');
        expect(response.status()).toBe(200);
        const campaigns = await response.json();
        console.log('Retrieved campaigns:', campaigns);
    });

    // Add more campaign-related tests as needed

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});
