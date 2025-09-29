
import WorkspacesPage from "../pages/workSpacesPage";
import GatewayServicePage from "../pages/gatewayServicePage";
import CreateServicePage from "../pages/createServicePage";
import { getKongServiceUrl } from "../utils/uniqueDataGenerator";
import { generateUniqueServiceName } from "../utils/uniqueDataGenerator";
import { generateUniqRouteName } from "../utils/uniqueDataGenerator";
import { generateUniqRoutePath } from "../utils/uniqueDataGenerator";
import { assertSuccessToast } from "../utils/toastNotifications";
import { attachScreenshot } from "../utils/screenshot";
import { RoutePage } from "../pages/createRoutePage";

describe("E2E - Create Service and Route", () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicePage = new GatewayServicePage();
  const createServicePage = new CreateServicePage();
  const routePage = new RoutePage();
  const serviceUrl = getKongServiceUrl();
  const serviceName = generateUniqueServiceName();
  const routeName = generateUniqRouteName();
  const routePath = generateUniqRoutePath();
    
  it("should create a Gateway Service and Route successfully", () => {
    // Step 1: Navigate to the Workspaces page
    workspacesPage.visitWorkspacesPage();
    workspacesPage.assertOnPage();

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
    assertSuccessToast(`Gateway Service "${serviceName}" successfully created`);
    attachScreenshot('service-created');

    // Step 6: Click upon Add a Route button to add a route
    routePage.clickAddRoute();

    // Step 7: fill required fields
    routePage.enterName(routeName);
    routePage.enterPath(routePath);

    // Step 8: save the route
    routePage.saveRoute();
    attachScreenshot('route-created');

    // Step 9: verify success toast notification
    assertSuccessToast(`Route "${routeName}" successfully created!`);

    // Save only routePath for proxy test
    cy.writeFile('cypress/fixtures/routePath.json', { routePath });

  });
});
