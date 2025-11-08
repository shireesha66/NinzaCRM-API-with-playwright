import { test as base, expect } from '@playwright/test';
import { APIutils } from '../Utils/APIutils';

// Extend base test (for future shared fixtures)
const test = base.extend({});
let sharedCampaignId; 
let apiutils;
let authContext;

test.describe('Campaign Controller API Tests', () => {
  test.describe.configure({ mode: 'serial' });

  const campaignData = {
    campaignName: "SaveTurtle",
    campaignStatus: "Active",
    description: "Protecting endangered turtles",
    expectedCloseDate: "2025-11-30",
    targetAudience: "Public",
    campaignType: "Awareness",
    budget: 5000
  };

  // 🔹 Setup before all tests (authenticate)
  test.beforeAll(async () => {
    apiutils = new APIutils();
    authContext = await apiutils.createAuthenicatedContext();
    console.log("✅ Authenticated context created");
  });

  // 🔹 CREATE
  test('1. Create Campaign', async () => {
    console.log('\n=== Starting Create Campaign ===');

    const response = await authContext.post('/campaign', {
      headers: { 'Content-Type': 'application/json' },
      data: campaignData
    });

    console.log('Create response status:', response.status());
    expect(response.status()).toBe(201);

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.log('Response is not JSON');
      responseData = {};
    }

    // Extract campaign ID from response body or headers
    sharedCampaignId =
      responseData.campaignId ||
      responseData.id ||
      responseData._id ||
      response.headers()['location']?.match(/[?&]campaignId=([^&]+)/)?.[1];

    console.log('✅ Extracted Campaign ID:', sharedCampaignId);
    expect(sharedCampaignId).toBeTruthy();
  });

  // 🔹 GET
  test('2. Get Campaign', async () => {
    console.log('\n=== Starting Get Campaign ===');
    console.log('Using campaign ID:', sharedCampaignId);

    if (!sharedCampaignId)
      throw new Error('No campaign ID available - Create test must run first and succeed');

    // Note: Based on your Postman example, use query param, not path
    const response = await authContext.get(`/campaign/${sharedCampaignId}`);
    console.log('Get response status:', response.status());
    expect(response.status()).toBe(200);

    const body = await response.text();
    console.log('Get response body:', body);
  });

  // 🔹 UPDATE
  test('3. Update Campaign', async () => {
    console.log('\n=== Starting Update Campaign ===');
    console.log('Using campaign ID:', sharedCampaignId);

    if (!sharedCampaignId)
      throw new Error('No campaign ID available - Create test must run first and succeed');

    const updateData = {
      campaignId: sharedCampaignId,
      campaignName: 'SaveSeaLions',
      campaignStatus: 'Active',
      description: 'Protecting endangered sea lions',
      expectedCloseDate: '2025-12-31',
      targetAudience: 'Public',
      campaignType: 'Awareness',
      budget: 6000
    };

    console.log('Sending update request:', updateData);

    // ✅ Use same query pattern as Postman (PUT /campaign?campaignId=...)
    const response = await authContext.put(`/campaign?campaignId=${sharedCampaignId}`, {
      headers: { 'Content-Type': 'application/json' },
      data: updateData
    });

    console.log('Update response status:', response.status());
    expect([200, 204]).toContain(response.status());
  });

  // 🔹 DELETE
  test('4. Delete Campaign', async () => {
    console.log('\n=== Starting Delete Campaign ===');
    console.log('Using campaign ID:', sharedCampaignId);

    if (!sharedCampaignId)
      throw new Error('No campaign ID available - Create test must run first and succeed');

    // ✅ Again, same pattern (DELETE /campaign?campaignId=...)
    const response = await authContext.delete(`/campaign?campaignId=${sharedCampaignId}`);
    console.log('Delete response status:', response.status());

    // Accept 200 or 204 as success
    expect([200, 204]).toContain(response.status());

    // Clear for cleanup
    sharedCampaignId = undefined;
    console.log('✅ Campaign deleted successfully');
  });
});
