describe('Logout of the application', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);

        cy.intercept('GET', '/api/auth/verify', {
            statusCode: 401,
            body: {
                authenticated: false,
            },
        }).as('verifyAuth');

        cy.visit('https://localhost');

        cy.wait('@verifyAuth');

        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('Admin123!');
        cy.get('.login-button').click();

        cy.contains('Login Successful!').should('be.visible');

        cy.wait(7000);
    });

    it('Successfully log out of the application', () => {
        cy.get('.username').click();
        cy.get('.logout-user').contains('Logout').click();
        cy.get('.btn-primary').contains('Log Out').click();
    });

    it('Successfully cancel the log out of the application', () => {
        cy.get('.username').click();
        cy.get('.logout-user').contains('Logout').click();
        cy.get('.btn-secondary').contains('Cancel').click();
        cy.contains('Stock Level Dashboard').should('be.visible');
    });

});