describe('Edit a user profile', () => {
    it('Successfully edit the user profile', () => {
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

        cy.get('.username').click();
        cy.get('.edit-profile').contains('Edit Profile').click();

        cy.get('input[id="Username"]').clear().type('admin');
        cy.get('input[id="Password"]').clear().type('Admin123!');
        cy.get('input[id="Email"]').clear().type('admintest@gmail.com');

        cy.get('.btn-primary').contains('Save Changes').click();
        cy.wait(7000);
        cy.contains('ADMIN').should('be.visible');
    });

    it('Successfully cancel the edit of the user profile', () => {
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

        cy.get('.username').click();
        cy.get('.edit-profile').contains('Edit Profile').click();

        cy.get('.btn-secondary').contains('Cancel').click();
        cy.contains('Stock Level Dashboard').should('be.visible');
    });

});