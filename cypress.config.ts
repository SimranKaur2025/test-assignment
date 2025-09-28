import { defineConfig } from "cypress";
import dotenvPlugin from "cypress-dotenv";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8002",   // Kong Manager
    specPattern: "cypress/e2e/**/*.cy.ts",
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    screenshotsFolder: "reports/screenshots",
    screenshotOnRunFailure: true,
    env: {
      proxyUrl: "http://localhost:8000",
      suffix: "/get" 
    }
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "reports/mochawesome",
    overwrite: false,              // keep each spec’s JSON
    html: false,                   // we’ll merge first, then create HTML
    json: true
  }
});
