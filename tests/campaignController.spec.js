
/*import { test } from '../Utils/Fixture.js';   // extended test with jwtToken
import { expect } from '@playwright/test';
import { loadCampaignId, saveCampaignId } from '../Utils/campaignDataHelper.js';
import fs from 'fs';
import path from 'path';*/


// tests/campaignController.spec.js
import { test, expect, request } from '@playwright/test';
import { loginAsUser, loginAsAdmin } from '../Utils/Fixture.js';

let sharedCampaignId;
let authContext;

test.describe.serial('Campaign Controller Tests', () => {
  test.beforeAll(async () => {
    const jwtToken = await loginAsUser('nonadminuser', 'nonadminpassword');
    authContext = await request.newContext({
      baseURL: 'http://49.249.28.218:8098',
      extraHTTPHeaders: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Authenticated context created');
  });

  test('1. Create Campaign', async () => {
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

    const response = await authContext.post('/campaign', { data: campaignData });
    expect(response.status()).toBe(201);

    const body = await response.json();
    sharedCampaignId = body.campaignId;
    expect(sharedCampaignId).toBeTruthy();
    console.log('✅ Shared Campaign ID:', sharedCampaignId);
  });
});
