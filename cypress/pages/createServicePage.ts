export default class CreateServicePage {
  private serviceUrlInput = '[data-testid="gateway-service-url-input"]';
  private serviceNameInput = '[data-testid="gateway-service-name-input"]';
  private addTagsToggle = '[data-testid="collapse-trigger-content"]';
  private tagsInput = '[data-testid="gateway-service-tags-input"]';
  private saveButton = '[data-testid="service-create-form-submit"]';
  private errorMessage = '[data-testid="form-error"]';
  private fullUrlInput = '[data-testid="gateway-service-url-input"]';

  enterServiceUrl(url: string) {
    cy.get(this.serviceUrlInput).clear().type(url);
  }

  enterServiceName(name: string) {
    cy.get(this.serviceNameInput).clear().type(name);
  }

  expandAndEnterTags(tags: string) {
    cy.get(this.addTagsToggle).click();
    cy.get(this.tagsInput).type(tags);
  }

  clickSave() {
    cy.get(this.saveButton)
      .scrollIntoView()
      .should('be.enabled')
      .click();
  }
  // Assert UI error for duplicate
   assertDuplicateServiceNameError() {
    cy.get(this.errorMessage)
      .should('be.visible')
      .and('contain.text', 'UNIQUE violation detected');
  }

  // Assert API response status for duplicate
  assertDuplicateServiceNameApi() {
    cy.wait('@postService').its('response.statusCode').should('eq', 409);
  }

  // Assert inline error message
  assertUrlValidationError(expectedMessage: string) {
    cy.get(this.fullUrlInput)
      .invoke('attr', 'aria-describedby')
      .then((id) => {
        cy.get(`#${id as string}`)
          .should('be.visible')
          .and('contain.text', expectedMessage);
      });
  }
}
