describe('Do the initial setup of a user', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);

        cy.wait(1000);
    });

    it('Initial setup complete', () => {
        // Click on the "Initial Setup" button
        cy.contains('Initial Setup').should('be.visible');

        // Verify that the modal is displayed
        cy.get('.modal-backdrop').should('be.visible');

        // Fill in the form fields
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('Admin123!');
        cy.get('input[name="confirmPassword"]').type('Admin123!');
        cy.get('input[name="email"]').type('admin@gmail.com');

        // Submit the form
        cy.get('.btn-primary').click();
        
    });
});
