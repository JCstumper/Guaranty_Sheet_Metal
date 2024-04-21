describe('Logging the action of adding a new user to the database', () => {
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

    it('Successfully add a new user and verified in logs page', () => {
        cy.get('.username').click();
        cy.get('.add-a-user').contains('Add a User').click();

        cy.get('input[id="Username"]').clear().type('newUser123');
        cy.get('input[id="Password"]').clear().type('newPassword123!');
        cy.get('input[id="Email"]').clear().type('newUser123@gmail.com');

        cy.get('.btn-primary').contains('Register').click();
        cy.contains('Registration successful').should('be.visible');

        cy.wait(7000);

        cy.contains('LOGS').click();

        cy.contains('Added User').scrollIntoView().should('be.visible');
        cy.contains('Add User').should('be.visible');
        cy.contains('Added User to Application Whitelist username: newUser123 email: newUser123@gmail.com role: employee').should('be.visible');
    });

    it('Successfully updated user informationa and verified in logs page', () => {
        cy.get('.username').click();
        cy.get('.edit-profile').contains('Edit Profile').click();

        cy.get('input[id="Username"]').clear().type('brandNewUser');
        cy.get('input[id="Password"]').clear().type('brandNewUser123!');
        cy.get('input[id="Email"]').clear().type('brandNewUser123@gmail.com');

        cy.get('.btn-primary').contains('Save Changes').click();
        cy.wait(7000);

        cy.contains('LOGS').click();

        cy.contains('Update Profile').scrollIntoView().should('be.visible');
        cy.contains('User Profile').should('be.visible');
        cy.contains('Profile updated successfully').should('be.visible');

        cy.get('.username').click();
        cy.get('.edit-profile').contains('Edit Profile').click();

        cy.get('input[id="Username"]').clear().type('admin');
        cy.get('input[id="Password"]').clear().type('Admin123!');
        cy.get('input[id="Email"]').clear().type('admin@gmail.com');

        cy.get('.btn-primary').contains('Save Changes').click();
        cy.wait(7000);
    });
});