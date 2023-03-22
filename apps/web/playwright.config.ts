import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const PORT = process.env.PORT ?? 3000

const projects = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
  },
]

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: process.env.CI ? 60_000 : undefined,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: process.env.CI ? projects.slice(0, 1) : projects,
  webServer: {
    command: `PORT=${PORT} yarn dev`,
    port: PORT,
    timeout: process.env.CI ? 10 * 60000 : 5 * 60000,
    reuseExistingServer: !process.env.CI,
  },
}

export default config
