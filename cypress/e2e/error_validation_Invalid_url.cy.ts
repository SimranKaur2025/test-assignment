import WorkspacesPage from "../pages/workSpacesPage";
import GatewayServicePage from "../pages/gatewayServicePage";
import CreateServicePage from "../pages/createServicePage";
import { generateInvalidServiceUrl } from "../utils/uniqueDataGenerator";
import { attachScreenshot } from "../utils/screenshot";

describe("Kong Manager - Workspaces Page", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const invalidServiceUrl = generateInvalidServiceUrl();

  it("should load the Workspaces page and show default workspace", () => {
    // Step 1: Navigate to the Workspaces page
    workspacesPage.visitWorkspacesPage();
    workspacesPage.assertDefaultWorkspaceName("default");

    // Step 2: Click on the default workspace
    workspacesPage.clickDefaultWorkspace();

    // Step 3: Select Gateway Service from the side-bar
    gatewayServicePage.selectGatewayServices();

    // Step 4: Click upon Add New Gateway Service
    gatewayServicePage.clickAddGatewayService();

    // Step 5: Enter Invalid Url in the FullUrl field
    createServicePage.enterServiceUrl(invalidServiceUrl);
    
    createServicePage.assertUrlValidationError("must follow a valid format");

  });
});
