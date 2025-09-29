export default class GatewayServicePage {
  private gatewayServicesSidebar = '[data-testid="sidebar-item-gateway-services"] a';
  private addGatewayServiceEmpty = '[data-testid="empty-state-action"]';
  private addGatewayServiceToolbar = '[data-testid="toolbar-add-gateway-service"]';
  private servicesTable = '[data-testid="entities-base-table"], .k-table-view.k-table-data';
  private toggleSelector = '[data-testid="switch-control"][role="checkbox"]';

  private togglePrompt = '.k-modal.k-prompt[aria-modal="true"]';
  private modalConfirm = '[data-testid="modal-action-button"]';
  private modalCancel  = '[data-testid="modal-cancel-button"], .k-button.tertiary';

  // Select Gateway Service from sidebar
  selectGatewayServices() {
    cy.get(this.gatewayServicesSidebar)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.url().should("include", "/services");

  }
  assertOnServicesList() {
    cy.get('body').should(($b) => {
      const hasTable = $b.find(this.servicesTable).length > 0;
      const hasEmptyBtn = $b.find(this.addGatewayServiceEmpty).length > 0;
      const hasToolbarBtn = $b.find(this.addGatewayServiceToolbar).length > 0;
      expect(hasTable || hasEmptyBtn || hasToolbarBtn).to.eq(true);
    });
    cy.url().should('include', '/services');
  }

  // Assertion: check the button is visible
  assertAddServiceButtonVisible() {
    cy.get('body').then(($b) => {
      if ($b.find(this.addGatewayServiceEmpty).length) {
        cy.get(this.addGatewayServiceToolbar).should('be.visible');
      } else {
        cy.get(this.addGatewayServiceToolbar).should('be.visible');
      }
    });
  }

  // Action: click the button
  clickAddGatewayService() {
    const bothButtons = `${this.addGatewayServiceEmpty}, ${this.addGatewayServiceToolbar}`;

  // Retry until at least one button is visible
  cy.get(bothButtons, { timeout: 20000 })
    .filter(':visible')
    .first()              
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
  }

    // Locate a row by service name
    getRowByServiceName(name: string) {
    cy.log(`Looking for service row: ${name}`);
    console.log(`Looking for service row: ${name}`);
    cy.get(this.servicesTable).should('be.visible');

    // rows have [data-testid="service-xxxx"]
    cy.get(this.servicesTable)
    .find('tr[data-testid^="service-"] td', { timeout: 15000 })
    .contains(name)
    .parents('tr[data-testid^="service-"]')
    .scrollIntoView()   // <— key: handle fixed header/overflow
    .should('be.visible')
    .as('row');

    // return the row chainable
    return cy.get('@row');
  }
  // Assert Protocol + Host
  assertRowProtocolHost(name: string, protocol: string, host: string) {
    this.getRowByServiceName(name).within(() => {
      cy.get('td').eq(1).should('contain.text', protocol);
      cy.get('td').eq(2).should('contain.text', host);     
    });
  }

  openServiceFromList(name: string) {
   cy.contains('tr', name)
    .should('be.visible')
    .within(() => {
      // open kebab menu
      cy.get('[data-testid="row-actions-dropdown-trigger"]')
       .scrollIntoView()
       .should('be.visible')
      .click({ force: true });
    });
    cy.get('body [data-testid="dropdown-list"]:visible')
    .should('be.visible');

    cy.get('[data-testid="action-entity-view"]')
      .contains(/^view details$/i)
      .click({ force: true });

    cy.contains('button', /Gateway Service actions/i).should('be.visible');
  }


  /** Opens the kebab actions menu for a row */
  openRowActionsMenu(name: string) {
    this.getRowByServiceName(name).within(() => {
      cy.get('td').last().scrollIntoView();
      cy.get(
        '[data-testid="row-actions-dropdown-trigger"]')
        .click({ force: true });
    });
  }

  /** Delete service via row action menu → Delete */
  deleteService(name: string) {
    
    // Click Delete from dropdown
    cy.get('[data-testid="action-entity-delete"]')
    .contains(/^delete$/i)
    .click({ force: true });

    cy.get('div[role="dialog"]').within(() => {
    cy.get('input').type(name, { force: true });
    cy.contains('button', /^Delete$/i).click();
    });

    // success toast
    cy.contains(/Gateway Service ".+" successfully deleted/i)
      .should('be.visible');

    // row should be gone
    cy.get(this.servicesTable).should('not.contain', name);
  }

   /** Toggle element inside the row for a specific service */
  private rowFor(name: string) {
    return cy.contains("table tbody tr", name, { timeout: 10000 }).should("be.visible");
  }

  private getToggleFor(name: string) {
    return this.rowFor(name).find(this.toggleSelector).should("be.visible");
  }

  // Modal helpers
  private openToggleModal(name: string) {
  this.getToggleFor(name).click({ force: true });

  // Accept either Disable or Enable title
  cy.contains(
    this.togglePrompt,
    /(Disable|Enable)\s+gateway services/i).should('be.visible');
  }

  private confirmToggle() {
  cy.get(this.togglePrompt).within(() => {
    cy.get(this.modalConfirm).should("be.visible").click({ force: true });
  });
  cy.get(this.togglePrompt).should("not.exist"); // confirm modal closed
  }

  private cancelToggle() {
    cy.get(this.modalCancel).click({ force: true });
    cy.get(this.togglePrompt).should("not.exist");
  }

  // Public actions
  disableServiceByName(name: string) {
    this.getToggleFor(name).should("have.attr", "aria-checked", "true");
    this.openToggleModal(name);
    this.confirmToggle();
    this.getToggleFor(name).should("have.attr", "aria-checked", "false");
  }

  enableServiceByName(name: string) {
    this.getToggleFor(name).should("have.attr", "aria-checked", "false");
    this.openToggleModal(name);
    this.confirmToggle();
    this.getToggleFor(name).should("have.attr", "aria-checked", "true");
  }
}
