import WorkspacesPage from "../pages/workSpacesPage";
import GatewayServicePage from "../pages/gatewayServicePage";
import CreateServicePage from "../pages/createServicePage";
import { generateUniqueServiceUrl } from "../utils/uniqueDataGenerator";
import { generateUniqueServiceName } from "../utils/uniqueDataGenerator";
import { assertSuccessToast } from "../utils/toastNotifications";
import { attachScreenshot } from "../utils/screenshot";
import { interceptServices } from "../utils/serviceApi";
import { waitForServices } from "../utils/serviceApi";
import { waitForCreate201 } from "../utils/serviceApi";

describe("Kong Manager - Workspaces Page", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const serviceUrl = generateUniqueServiceUrl();
  const serviceName = generateUniqueServiceName();
  const { protocol, host } = (() => {
    const u = new URL(serviceUrl);
    return { protocol: u.protocol.replace(':', ''), host: u.host };
  })();
  beforeEach(() => {
    interceptServices();
  });

  it("should load the Workspaces page and show default workspace", () => {
    // Step 1: Navigate to the Workspaces page
    workspacesPage.visitWorkspacesPage();
    workspacesPage.assertDefaultWorkspaceName("default");

    // Step 2: Click on the default workspace
    workspacesPage.clickDefaultWorkspace();
    cy.wait(1000);
    // Step 3: Select Gateway Service from the side-bar
    gatewayServicePage.selectGatewayServices();

    // Step 4: Click upon Add New Gateway Service
    gatewayServicePage.clickAddGatewayService();

    // Step 5: Fill out the form
    createServicePage.enterServiceUrl(serviceUrl);
    createServicePage.enterServiceName(serviceName);
    createServicePage.clickSave();
    console.log(`Service Name: ${serviceName}`);
    attachScreenshot('GatewayService-created'); 

    //Validate success toast notification
    assertSuccessToast(`Gateway Service "${serviceName}" successfully created`);
    waitForCreate201();
    
    // Step 6:Navigate to Service List Page
    gatewayServicePage.selectGatewayServices();
    waitForServices();

    // Step 7: Verify Protocol + Host in row
    gatewayServicePage.assertRowProtocolHost(serviceName, protocol, host);
  });
});
