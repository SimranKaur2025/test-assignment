Cypress.Commands.add('deleteServiceIfExists', (serviceName: string) => {
  cy.log(`Checking if service "${serviceName}" exists for deletion`);

  // Make sure you're already on Services list page before calling this.
  cy.contains('tr', serviceName, { timeout: 3000 }).then($row => {
    if (!$row.length) {
      cy.log(`Service "${serviceName}" not found, skipping delete`);
      return;
    }

    cy.wrap($row).within(() => {
      cy.get('button[aria-haspopup="menu"]').click({ force: true });
    });

    // Click Delete from row menu
    cy.get('[data-testid="action-entity-delete"]').click({ force: true });

    // Confirm in dialog
    cy.get('[role="dialog"]', { timeout: 10000 }).within(() => {
      cy.contains('button', /^Delete$/i).click();
    });

    // Verify toast
    cy.contains(/Gateway Service ".+" successfully deleted/i, { timeout: 10000 })
      .should('be.visible');

    cy.log(`Service "${serviceName}" deleted successfully`);
  });
});
