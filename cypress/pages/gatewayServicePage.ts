export default class GatewayServicePage {
  private gatewayServicesSidebar = '[data-testid="sidebar-item-gateway-services"] a';
  private addGatewayServiceButton = '[data-testid="toolbar-add-gateway-service"]';
  private servicesTable = '[data-testid="entities-base-table"], .k-table-view.k-table-data';

  selectGatewayServices() {
    cy.get(this.gatewayServicesSidebar)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.url().should("include", "/services");

  }

  assertOnServicesList() {
    cy.get(this.addGatewayServiceButton).should('be.visible');
    cy.get(this.servicesTable).should('be.visible');
    cy.url().should('include', '/services');
  }

  // Assertion: check the button is visible
  assertAddServiceButtonVisible() {
    cy.get(this.addGatewayServiceButton).should("be.visible");
  }

  // Action: click the button
  clickAddGatewayService() {
    cy.get(this.addGatewayServiceButton).click({ force: true });
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

  // ---------- Enable/Disable toggle ----------

  /** Returns the enable-toggle element inside the row (span[role="checkbox"]) */
  private getEnableToggleInRow() {
    // span.switch-control[data-testid="switch-control"][role="checkbox"]
    return cy.get('@row').within(() => {
      cy.get('span[role="checkbox"][data-testid="switch-control"]').as('toggle');
    });
  }

  /** Assert current enabled state using aria-checked */
  assertServiceEnabled(name: string, expected: boolean) {
    this.getRowByServiceName(name);
    this.getEnableToggleInRow();
    cy.get('@toggle')
      .should('have.attr', 'aria-checked', String(expected));
  }

  /**
   * Set the enabled state for a service row.
   * - When disabling, a confirm dialog appears ("Disable gateway services") -> click "Yes, disable"
   * - When enabling, no dialog typically appears.
   */
  setServiceEnabled(name: string, desired: boolean) {
    this.getRowByServiceName(name);
    this.getEnableToggleInRow();

    cy.get('@toggle').then($t => {
      const current = $t.attr('aria-checked') === 'true';
      if (current === desired) return; // already in desired state

      // click the visual switch (the span works fine)
      cy.wrap($t).click({ force: true });

      if (desired === false) {
        // handle confirm dialog for disable
        cy.get('[role="dialog"]', { timeout: 10_000 })
          .should('contain.text', 'Disable gateway services')
          .within(() => {
            cy.contains('button', /Yes, disable/i).click();
          });
      }

      // wait for state to settle
      this.getRowByServiceName(name);
      this.getEnableToggleInRow();
      cy.get('@toggle').should('have.attr', 'aria-checked', String(desired));
    });
  }
}

//  openRowActionsMenu(name: string) {
//     this.getRowByServiceName(name);
//     // open kebab menu
//     cy.get('@row').within(() => {
//       cy.get('td').last().scrollIntoView();
//       cy.get(
//         '[data-testid="row-actions-dropdown-trigger"]')
//         .click({ force: true });
//     });

//     cy.get('[data-testid="action-entity-delete"]')
//       .contains(/^delete$/i)
//       .click({ force: true });
//   }


//   /** Delete service via row action menu → Delete */
//   deleteService(name: string) {

//     cy.get('[data-testid="header-actions"]').click({ force: true });
    
//     // Click Delete from dropdown
//     cy.get('[data-testid="entity-button"][data-testaction="action-delete"]')
//     .should('be.visible')
//     .click({ force: true });

//     cy.get('[role="dialog"]').within(() => {
//     cy.contains('button', /^Delete$/i).click();
//     });

//     // success toast
//     cy.contains(/Gateway Service ".+" successfully deleted/i, { timeout: 10_000 })
//       .should('be.visible');

//     // row should be gone
//     cy.get(this.servicesTable).should('not.contain', name);
//   }
