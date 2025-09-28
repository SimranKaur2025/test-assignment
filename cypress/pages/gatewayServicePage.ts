export default class GatewayServicePage {
  private gatewayServicesSidebar = '[data-testid="sidebar-item-gateway-services"] a';
  private addGatewayServiceEmpty = '[data-testid="empty-state-action"]';
  private addGatewayServiceToolbar = '[data-testid="toolbar-add-gateway-service"]';
  private servicesTable = '[data-testid="entities-base-table"], .k-table-view.k-table-data';

  selectGatewayServices() {
    cy.get(this.gatewayServicesSidebar)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.url().should("include", "/services");

  }
  assertOnServicesList() {
    cy.get('body', { timeout: 20000 }).should(($b) => {
      const hasTable = $b.find(this.servicesTable).length > 0;
      const hasEmptyBtn = $b.find(this.addGatewayServiceEmpty).length > 0;
      const hasToolbarBtn = $b.find(this.addGatewayServiceToolbar).length > 0;
      expect(hasTable || hasEmptyBtn || hasToolbarBtn).to.eq(true);
    });
    cy.url().should('include', '/services');
  }

  // Assertion: check the button is visible
  assertAddServiceButtonVisible() {
    cy.get('body', { timeout: 20000 }).then(($b) => {
      if ($b.find(this.addGatewayServiceEmpty).length) {
        cy.get(this.addGatewayServiceToolbar, { timeout: 20000 }).should('be.visible');
      } else {
        cy.get(this.addGatewayServiceToolbar, { timeout: 20000 }).should('be.visible');
      }
    });
  }

  // Action: click the button
  clickAddGatewayService() {
    cy.get('body', { timeout: 10000 }).then(($body) => {
    if ($body.find('[data-testid="empty-state-action"]').length) {
      cy.log('Clicking empty state Add Service button');
      cy.get('[data-testid="empty-state-action"]').click({ force: true });
    } else {
      cy.log('Clicking toolbar Add Service button');
      cy.get('[data-testid="toolbar-add-gateway-service"]').click({ force: true });
    }
  });
  }

  /** Locate a row by service name */
  getRowByServiceName(name: string) {
    cy.log(`Looking for service row: ${name}`);
    console.log(`Looking for service row: ${name}`);
    cy.get(this.servicesTable, { timeout: 10000 }).should('be.visible');

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

  assertRowProtocolHost(name: string, protocol: string, host: string) {
    this.getRowByServiceName(name).within(() => {
      cy.get('td').eq(1).should('contain.text', protocol); // Protocol column
      cy.get('td').eq(2).should('contain.text', host);     // Host column
    });
  }

  openServiceFromList(name: string) {
   cy.contains('tr', name, { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      // open kebab menu
      cy.get('[data-testid="row-actions-dropdown-trigger"]')
       .scrollIntoView()
       .should('be.visible')
      .click({ force: true });
    });
    cy.get('body [data-testid="dropdown-list"]:visible', { timeout: 10000 })
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
    cy.contains(/Gateway Service ".+" successfully deleted/i, { timeout: 10_000 })
      .should('be.visible');

    // row should be gone
    cy.get(this.servicesTable).should('not.contain', name);
  }
}