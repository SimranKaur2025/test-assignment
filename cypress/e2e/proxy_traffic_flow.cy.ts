describe('Traffic flows through Proxy (200 OK)', () => {
  let routePath: string;
    before(() => {
      cy.readFile('cypress/fixtures/routePath.json').then((data) => {
        routePath = data.routePath;
        cy.log('Using routePath:', routePath);
      });
    });

  it('returns 200 and includes Kong proxy headers', () => {
    const proxyUrl = Cypress.env("proxyUrl");
    const suffix = Cypress.env("suffix");
    cy.request(`${proxyUrl}${routePath}${suffix}`).then((resp) => {
      // status
      expect(resp.status).to.eq(200);

      // response body (httpbin returns JSON)
      expect(resp.body).to.have.property('headers');
      expect(resp.body).to.have.property('url');
      expect(resp.body.url).to.match(/\/get$/);

      // ensure upstream URL contains httpbin
      expect(resp.body.headers).to.have.property('Host', 'httpbin.konghq.com');

      // Kong headers
      const h = resp.headers;
      expect(h).to.have.property('via');
      expect(h).to.have.property('x-kong-proxy-latency');
      expect(h).to.have.property('x-kong-upstream-latency');
    });
  });
});
