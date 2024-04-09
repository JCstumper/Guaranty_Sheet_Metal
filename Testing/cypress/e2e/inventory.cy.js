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
        cy.contains('INVENTORY').click();
    });

    it('Successfully add product', () => {   
        cy.contains('INVENTORY').click();
        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('SUP-54321');
        cy.get('#radius-size').type('5');
        cy.get('#material-type').type('Metal');
        cy.get('#color').type('Blue');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('20');
        cy.get('#price').type('3.48');
        
        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');
    });

    it('Successfully edit product', () => { 
        cy.contains('INVENTORY').click();
        cy.contains('MBL5WGT20').click();

        cy.get('.edit-button').contains('Edit').click();

        cy.get('input[id="supplier-part-number"]').clear().type('SuppNewPart123');
        cy.get('input[id="radius-size"]').clear().type('7');
        cy.get('input[id="material-type"]').clear().type('Aluminium');
        cy.get('input[id="color"]').clear().type('blue');
        cy.get('textarea[id="description"]').clear().type('Updated description for the product'); // Assuming description is a textarea
        cy.get('input[id="type"]').clear().type('NewCategory');
        cy.get('input[id="catcode"]').clear().type('CAT123');
        cy.get('select[id="item-type"]').select('Box Item');
        cy.get('input[id="quantity-of-item"]').clear().type('100');
        cy.get('input[id="price"]').clear().type('200');
        cy.get('input[id="mark-up-price"]').clear().type('260');
        cy.get('form').submit();
        cy.contains('Product updated successfully').should('be.visible');
    });

    it('Successfully edit product quantity in stock', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('12');
        
        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');
    });

    it('Successfully cancel delete product', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.delete-button').click();
        cy.get('.delete-cancel').click();
    });

    it('Successfully delete product', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.delete-button').click();
        cy.get('.delete-confirm').click();

        
        cy.contains('Product deleted successfully').should('be.visible');
    });
});  