declare namespace Cypress {
  interface Chainable {
    /**
     * Deletes a gateway service by name if it exists.
     * Requires the test to already be on the Services list page.
     */
    deleteServiceIfExists(serviceName: string): Chainable<void>;
  }
}
