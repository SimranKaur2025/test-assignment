import WorkspacesPage from "../pages/workSpacesPage";
import GatewayServicePage from "../pages/gatewayServicePage";
import CreateServicePage from "../pages/createServicePage";
import { generateUniqueServiceUrl } from "../utils/uniqueDataGenerator";
import { generateUniqueServiceName } from "../utils/uniqueDataGenerator";
import { assertSuccessToast } from "../utils/toastNotifications";
import { attachScreenshot } from "../utils/screenshot";

describe("Duplicate Service Name", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const serviceUrl = generateUniqueServiceUrl();
  const serviceName = generateUniqueServiceName();

  it("should validate duplicate service name error", () => {
    // Step 1: Navigate to the Workspaces page
    workspacesPage.visitWorkspacesPage();
    workspacesPage.assertDefaultWorkspaceName("default");

    // Step 2: Click on the default workspace
    workspacesPage.clickDefaultWorkspace();

    // Step 3: Select Gateway Service from the side-bar
    gatewayServicePage.selectGatewayServices();

    // Step 4: Click upon Add New Gateway Service
    gatewayServicePage.clickAddGatewayService();

    // Step 5: Fill out the form
    createServicePage.enterServiceUrl(serviceUrl);
    createServicePage.enterServiceName(serviceName);
    createServicePage.clickSave();
    console.log(`Created Service: ${serviceName}`);
    
    //Validate success toast notification
    assertSuccessToast(`Gateway Service "${serviceName}" successfully created`);
    attachScreenshot('GatewayService-created'); 

    // Create new service with same service name
    gatewayServicePage.selectGatewayServices();
    gatewayServicePage.clickAddGatewayService();
    createServicePage.enterServiceUrl(serviceUrl);
    createServicePage.enterServiceName(serviceName);
    createServicePage.clickSave();

    // Assertion- UI shows error message
    createServicePage.assertDuplicateServiceNameError();
    attachScreenshot('Duplicate Service-error'); 
    

  });
});
