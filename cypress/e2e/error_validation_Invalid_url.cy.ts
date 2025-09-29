import WorkspacesPage from "../pages/workSpacesPage";
import GatewayServicePage from "../pages/gatewayServicePage";
import CreateServicePage from "../pages/createServicePage";
import { generateInvalidServiceUrl } from "../utils/uniqueDataGenerator";
import { attachScreenshot } from "../utils/screenshot";
import { INVALID_URLS } from "../utils/uniqueDataGenerator";

describe("Create Service - FullUrl Required Field Validation", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const invalidServiceUrl = generateInvalidServiceUrl();
  const ERROR_MESSAGE = "must follow a valid format";

  beforeEach(() => {
    // Navigate to Add Gateway Service form
    workspacesPage.visitWorkspacesPage();
    workspacesPage.clickDefaultWorkspace();
    gatewayServicePage.selectGatewayServices();
    gatewayServicePage.clickAddGatewayService();
  });

  // Iterate through each invalid input
  INVALID_URLS.forEach((url) => {
    it(`should show inline error for invalid Full URL: "${url || "blank"}"`, () => {
      // Enter value (or clear if blank) to trigger validation
      if (url === "") {
        cy.get('[data-testid="gateway-service-url-input"]').clear().blur();
      } else {
        createServicePage.enterServiceUrl(url);
      }
      createServicePage.assertUrlValidationError(ERROR_MESSAGE);

      // Save button should not be enabled
      cy.contains("button", /^Save$/).should("be.disabled");
    });
  });

  it("should accept valid Url and clear error message", () => {
    // Enter a valid service URL
    createServicePage.enterServiceUrl("http://httpbin.konghq.com");
    attachScreenshot('No Inline Error with Valid URL');
    // And Save button should be enabled
    cy.contains("button", /^Save$/).should("be.enabled");
  });
});
