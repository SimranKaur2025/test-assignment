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

describe("Disable / Enable Service", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const serviceUrl = generateUniqueServiceUrl();
  const serviceName = generateUniqueServiceName();
  beforeEach(() => {
    interceptServices();
  });

  it("should create a Gateway Service successfully", () => {
    // Step 1: Create New Service
    workspacesPage.visitWorkspacesPage();
    workspacesPage.clickDefaultWorkspace();
    gatewayServicePage.selectGatewayServices();
    gatewayServicePage.clickAddGatewayService();
    createServicePage.enterServiceUrl(serviceUrl);
    createServicePage.enterServiceName(serviceName);
    createServicePage.clickSave();
    console.log(`Service Name: ${serviceName}`);
    waitForCreate201();
    
    // Step 2:Navigate to Service List Page
    gatewayServicePage.selectGatewayServices();
    waitForServices();

    // Step 3: Disable the newly created service
    gatewayServicePage.disableServiceByName(serviceName);
    attachScreenshot('Service Diabled');


    // Step 4: Enable the same service again
    gatewayServicePage.enableServiceByName(serviceName);
    attachScreenshot('Service Enabled');

    // Delete service flow can be added here for cleanup 
  });
});
