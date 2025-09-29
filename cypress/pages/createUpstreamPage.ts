export default class CreateUpstreamPage {
  // Sidebar + empty-state button
  private upstreamsSidebar = 'li[data-testid="sidebar-item-upstreams"] a';
  private newUpstreamBtn = '[data-testid="toolbar-add-upstream"]';
  private nameSelectInput = '[data-testid="select-input"]';
  private hostHeaderInput = '[data-testid="upstreams-form-host-header"]';
  private saveButton = '[data-testid="upstreams-create-form-submit"]';

  /** Navigate to Upstreams list from the sidebar */
  selectUpstream() {
    cy.get(this.upstreamsSidebar, { timeout: 10_000 }).click();
    cy.url().should('match', /\/upstreams$/);
  }

  /** Click the "New upstream" button (works for empty-state and toolbar) */
  clickAddNewUpstream() {
    cy.get(this.newUpstreamBtn).click({ force: true });
    cy.url().should('match', /\/upstreams\/create/);
  }

  /** Type into the Name field (custom select supports typing) */
 enterName(name: string) {
  // Type the name
  cy.get('[data-testid="upstreams-form-name"]')
    .clear()
    .type(name);

  // Wait for dropdown option to appear and select it
  cy.get('[data-testid="select-add-item"]')
    .contains(new RegExp(`^${name}`, 'i'))
    .click();
}

  clickSave() {
    cy.get(this.saveButton, { timeout: 10000 })
        .should('be.visible')
        .and('not.be.disabled')
        .click();
    }
}
