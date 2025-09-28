export class RoutePage {
  private addRouteBtn = 'button:contains("Add a Route")';
  private nameInput = '[data-testid="route-form-name"]';
  private pathInput = '[data-testid="route-form-paths-input-1"]';
  private saveBtn = '[data-testid="route-create-form-submit"]';

  clickAddRoute() {
    cy.get(this.addRouteBtn).click();
  }

  enterName(name: string) {
    cy.get(this.nameInput).clear().type(name);
  }

  enterPath(path: string) {
    cy.get(this.pathInput).clear().type(path);
  }

  saveRoute() {
    cy.get(this.saveBtn).click();
  }
}
