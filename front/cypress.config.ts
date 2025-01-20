import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    viewportHeight: 768,
    viewportWidth: 1024,
  },
});
