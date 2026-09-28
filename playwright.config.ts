import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4190';
export default defineConfig({
	testDir: 'tests/system',
	workers: 1,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL,
		channel: 'chrome',
		headless: true,
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'node build',
		url: `${baseURL}/catalog`,
		env: { HOST: '127.0.0.1', PORT: '4190', DATABASE_PATH: ':memory:', ORIGIN: baseURL, DEMO_SEED: 'true' },
		reuseExistingServer: false,
		timeout: 120000
	}
});
