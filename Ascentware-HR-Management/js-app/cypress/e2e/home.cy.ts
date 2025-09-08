describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/home");
  });

  it("displays Client Master", () => {
    cy.get('[data-testid="home-title"]').should(
      "contain.text",
      "Client Master"
    );
  });

  it("shows Term Master", () => {
    cy.contains("Term Master").should("be.visible");
  });

  it("shows Item Master", () => {
    cy.contains("Item Master").should("be.visible");
  });

  it("navigates to Invoice Table", () => {
    cy.contains("Invoice").click();
    cy.url().should("include", "/invoice-table");
  });

  it("navigates to Clients page", () => {
    cy.get('[data-testid="home-title"]').click();
    cy.url().should("include", "/clients");
  });

  it("renders 3 grid buttons", () => {
    cy.get(".grid button").should("have.length", 4);
  });
});
