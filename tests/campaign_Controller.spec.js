import { test, expect, request } from '@playwright/test';

let sharedCampaignId;
let accessToken;
let authContext;

test.describe.serial('Campaign Controller Tests', () => {  // 👈 make the whole suite serial

  test.beforeAll(async () => {
    const authdata = {
      username: 'nonadminuser',
      password: 'nonadminpassword',
    };

    const apiContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      httpCredentials: {
        username: authdata.username,
        password: authdata.password,
      },
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });

    const response = await apiContext.get('/login');
    expect(response.status()).toBe(202);

    const jsonData = await response.json();
    accessToken = jsonData.jwtToken;
    expect(accessToken).toBeTruthy();

    authContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      extraHTTPHeaders: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Authenticated context created');
  });

  test('1. Create Campaign', async () => {
    console.log('\n=== Starting Create Campaign Test ===');

    const campaignData = {
      campaignid: '',
      campaignName: 'SaveTurtle&SeaLion',
      campaignStatus: 'Active',
      description: 'Protecting endangered turtles&SeaLions',
      expectedCloseDate: '2025-01-30',
      targetAudience: 'Public',
      campaignType: 'Awareness',
      budget: 5000,
    };

    const response = await authContext.post('/campaign', {
      data: campaignData,
    });

    expect(response.status()).toBe(201);
    const responseData = await response.json();

    sharedCampaignId = responseData.campaignId;
    expect(sharedCampaignId).toBeTruthy();

    console.log('✅ Shared Campaign ID:', sharedCampaignId);
  });

  test('2. Get Campaign', async () => {
    console.log('\n=== Starting Get Campaign Test ===');
    console.log('Using campaign ID:', sharedCampaignId);

    if (!sharedCampaignId) {
      throw new Error('No campaign ID available - Create test must run first and succeed');
    }

    const response = await authContext.get(`/campaign/${sharedCampaignId}`);
    console.log('Get response status:', response.status());

    const responseText = await response.text();
    console.log('Get response:', responseText);

    expect(response.status()).toBe(200);
  });

 test('3. Update Campaign', async () => {
  console.log('\n=== Starting Update Campaign Test ===');
  expect(sharedCampaignId, 'Campaign ID must exist').toBeTruthy();

  const updateData = {
    campaignId: sharedCampaignId,
    campaignName: 'SaveTurtle&SeaLions - Updated',
    campaignStatus: 'Active',
    description: 'Protecting endangered turtles - Updated',
    expectedCloseDate: '2025-12-30',
    targetAudience: 'Public',
    campaignType: 'Awareness',
    budget: 6000,
  };

  // ✅ FIXED: use query param, not path param
  const response = await authContext.put(`/campaign?campaignId=${sharedCampaignId}`, {
    data: updateData,
  });

  console.log('Update response status:', response.status());
  const body = await response.text();
  console.log('Update response body:', body);

  expect(response.status(), 'Expected successful update').toBe(200);
});

//   test('4. Delete Campaign', async () => {
//   console.log('\n=== Starting Delete Campaign Test ===');
//   expect(sharedCampaignId, 'Campaign ID must exist').toBeTruthy();

//   const response = await authContext.delete(`/campaign?campaignId=${sharedCampaignId}`);
//   console.log('Delete response status:', response.status());

//   // ✅ Accept 200 or 204 as success
//   expect([200, 204]).toContain(response.status());
// });


});
