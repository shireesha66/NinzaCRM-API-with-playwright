// utils/campaignDataHelper.js
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/campaignData.json');

// ✅ Export functions individually
export function saveCampaignId(id) {
  fs.writeFileSync(filePath, JSON.stringify({ campaignId: id }, null, 2));
}

export function loadCampaignId() {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.campaignId || null;
  }
  return null;
}


/*import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/campaignData.json');

export function saveCampaignId(id) {
  fs.writeFileSync(filePath, JSON.stringify({ campaignId: id }, null, 2));
}

export function loadCampaignId() {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.campaignId || null;
  }
  return null;
}
*/