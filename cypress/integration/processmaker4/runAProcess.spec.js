describe("ProcessMaker 4", () => {

  it('Create a simple user', () => {
    cy.visit(Cypress.env('CYPRESS_BASE_URL'));
    cy.get('input[name="username"]').clear().type(Cypress.env('CYPRESS_USERNAME'));
    cy.get('input[name="password"]').clear().type(Cypress.env('CYPRESS_PASSWORD'));
    cy.get('button[name="login"]').click();
    cy.get('a:contains("Admin")').click();
    cy.get('button:contains("User")').click();
    cy.getRandomUser().then((user) => {
        console.log(user);
        cy.get('input[name="username"]').clear().type(user.login.username);
        cy.get('input[name="firstname"]').clear().type(user.name.first);
        cy.get('input[name="lastname"]').clear().type(user.name.last);
        cy.get('input[name="title"]').clear().type(user.name.title);
        cy.get('select[name="size"]').select('ACTIVE');
        cy.get('input[name="email"]').clear().type(user.email);
        cy.get('input[name="password"]').clear().type("password123");
        cy.get('input[name="confpassword"]').clear().type("password123");
        cy.get('button:contains("Save")').click();
        cy.get('input[name="phone"]').clear().type(user.phone);
        cy.get('input[name="fax"]').clear().type("591546667");
        cy.get('input[name="cell"]').clear().type(user.cell);
        cy.get('#__BVID__59').select('FR');
        cy.get('input[name="address"]').clear().type(`${user.location.street.name} #${user.location.street.number}`);
        cy.get('input[name="city"]').clear().type(user.location.city);
        cy.get('input[name="state"]').clear().type(user.location.state);
        cy.get('input[name="postal"]').clear().type(user.location.postcode);
        cy.get('div.multiselect__tags:eq(0)').click();
        cy.get('span:contains("Default"):eq(0)').click();
        cy.get('#datetime_format').select('Y-m-d H:i');
        cy.get('#saveUser').click();
    });
  });
});
