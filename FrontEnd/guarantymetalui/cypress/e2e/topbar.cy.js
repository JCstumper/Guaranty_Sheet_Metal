describe('Test navigation', () => {
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
        cy.get('.list-button').contains('PURCHASES').click();
        cy.get('.table-title').contains('ORDERS').should('be.visible');
    });

    it('Navigate to jobs', () => { 
        cy.get('.list-button').contains('JOBS').click();
        cy.get('.table-title').contains('JOBS').should('be.visible');
    });

    it('Navigate to logs', () => { 
        cy.wait(6000);
        cy.get('.list-button').contains('LOGS').click();
        cy.get('.table-title').contains('INVENTORY LOGS').should('be.visible');
    });

    it('Navigate to dashboard', () => { 
        cy.get('.list-button').contains('DASHBOARD').click();
        cy.contains('Inventory Details').should('be.visible');
    });

    it('Navigate to different pages', () => { 
        cy.get('.list-button').contains('INVENTORY').click();
        cy.get('.table-title').contains('INVENTORY').should('be.visible');

        cy.get('.list-button').contains('PURCHASES').click();
        cy.get('.table-title').contains('ORDERS').should('be.visible');

        cy.get('.list-button').contains('JOBS').click();
        cy.get('.table-title').contains('JOBS').should('be.visible');

        cy.wait(6000);
        cy.get('.list-button').contains('LOGS').click();
        cy.get('.table-title').contains('INVENTORY LOGS').should('be.visible');

        cy.get('.list-button').contains('DASHBOARD').click();
        cy.contains('Inventory Details').should('be.visible');
    });
});  