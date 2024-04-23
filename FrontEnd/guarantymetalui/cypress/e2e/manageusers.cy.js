describe('Admin manages the users', () => {
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

    it('Successfully changes the test user\'s role from employee to admin', () => {
        cy.get('.username').click();
        cy.get('.manage-users').contains('Manage Users').click();

        // Find the test user by username and store it as an alias
        cy.contains('div', 'testuser').as('testUserItem');

        // Assuming there is a dropdown to select the user role within the user item
        cy.get('@testUserItem').find('select').select('admin');

        // Save changes
        cy.get('.btn-primary').contains('Save Changes').click();

        // Verify success notification
        cy.contains('Changes saved successfully').should('be.visible');
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.get('.username').click();
        cy.get('.manage-users').contains('Manage Users').click();
        cy.contains('div', 'testuser').as('testUserItem');
        // Optionally verify the role change persisted
        cy.get('@testUserItem').find('select').should('have.value', 'admin');
    });

    it('Successfully removes the test user from the application', () => {
        cy.get('.username').click();
        cy.get('.manage-users').contains('Manage Users').click();

        // Find and select the test user by username
        cy.contains('div', 'testuser').as('testUserItem');
        cy.get('@testUserItem').find('button').contains('Remove').click();

        // Confirm the deletion in the modal
        cy.get('.btn-primary').contains('Confirm').click({ force: true });

        // Verify success notification
        cy.contains('User successfully removed').should('be.visible');
        cy.get('@testUserItem').should('not.exist');
    });
});