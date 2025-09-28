export default class WorkspacesPage {
  private defaultWorkspace = "div.workspace-title[data-testid='workspace-link-default']";
  private pageTitle = ".workspace-overview-title";

  // Navigate to Workspaces page
  visitWorkspacesPage() {
    cy.visit("/workspaces");
  }

  // Click on Default Workspace
  clickDefaultWorkspace() {
    cy.get(this.defaultWorkspace).click();
  }

  // Assertions
  assertDefaultWorkspaceName(expected: string) {
    cy.get(this.defaultWorkspace).should("be.visible").and("contain.text", expected);
  }

  assertOnPage() {
    cy.get(this.pageTitle)
      .invoke("text")
      .then((text) => {
      expect(text.trim()).to.eq("Workspaces");
  });
  }
}

  

  
