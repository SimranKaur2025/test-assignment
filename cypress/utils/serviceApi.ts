export function interceptServices() {
  cy.intercept('POST', '**/services**').as('createService');
  cy.intercept('GET', '**/services**').as('getServices');
}

export function waitForCreate201() {
  cy.wait('@createService').its('response.statusCode').should('eq', 201);
}

export function waitForServices() {
  // wait until the services list API has responded
  cy.wait('@getServices', { timeout: 20000 });
}
