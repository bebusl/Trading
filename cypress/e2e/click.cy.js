describe("login", () => {
  it("validate inputs", () => {
    cy.visit("https://localhost");
    cy.get("#__next > div > header > div > a:nth-child(1)").click();
    cy.url().should("include", "/login");

    cy.get("form").within(($form) => {
      cy.get('input[name="email"]').type("test@test.com");
      cy.get('input[name="password"]').type("ㅅㄷㄴㅅ1234");
    });

    //그 행동의 결과
  });
});
