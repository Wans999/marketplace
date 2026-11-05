import { defineConfig } from '@playwright/test';
import { API_URL } from './fixtures/env.js';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1, // reset DB tidak aman dijalankan paralel
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: API_URL },
  webServer: {
    command: 'PORT=3001 npm --prefix ../backend run start:test',
    url: `${API_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
  },
});