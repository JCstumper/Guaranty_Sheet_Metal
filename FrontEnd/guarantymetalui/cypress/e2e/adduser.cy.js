describe('Admin adds a user to the database', () => {
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

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

    });

    it('Successfully add a user to the application', () => {
        cy.get('.username').click();
        cy.get('.add-a-user').contains('Add a User').click();

        cy.get('input[id="Username"]').clear().type('testuser');
        cy.get('input[id="Password"]').clear().type('TestPassword123!');
        cy.get('input[id="Email"]').clear().type('test@gmail.com');

        cy.get('.btn-primary').contains('Register').click();
        cy.contains('Registration successful').should('be.visible');
    });

});