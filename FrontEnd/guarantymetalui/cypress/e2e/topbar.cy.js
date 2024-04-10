describe('Open application and test inventory', () => {
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

        cy.wait(1000);
    });

    it('Navigate to inventory', () => { 
        cy.get('.list-button').contains('INVENTORY').click();
        cy.get('.table-title').contains('INVENTORY').should('be.visible');
    });

    it('Navigate to purchases', () => { 
        cy.contains('PURCHASES').click();
        cy.get('.table-title').contains('INVENTORY').should('be.visible');
    });
});  