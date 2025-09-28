export function assertSuccessToast(expected: string) {
  cy.get('#kongponents-toaster-container .k-toaster', { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .then(text => {
      expect(text).to.include(expected);
    });
}
