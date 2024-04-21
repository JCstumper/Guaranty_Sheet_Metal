describe('Open application and test jobs', () => {
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
    
    it('Navigate to Jobs', () => { 
        cy.contains('JOBS').click();
    });

    it('Successfully add a Job', () => {   
        cy.contains('JOBS').click();
        cy.get('.add-button').contains('+').click();

        cy.get('input[id="customer_name"]').type('Testing Test');
        cy.get('input[id="address"]').type('123 Testing Street');
        cy.get('input[id="phone"]').type('123-456-7891');
        cy.get('input[id="email"]').type('TestingTest123@test.com');

        cy.contains('Add Job').click();
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
        cy.get('#quantity-of-item').type('5');
        cy.get('#price').type('3.48');
        
        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');
    });

    it('Successfully edit product quantity in stock', () => {
        cy.contains('INVENTORY').click();
        cy.contains('MBL5WGT5').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('12');

        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');
    });

    it('Successfully Add Part to Necessary', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Target the specific section before clicking the 'Add Part' button
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.add-part-btn').click();
        });
        cy.get('.form-control').type('MBL5WGT5');
        
        cy.get('.btn-primary').contains('Add').click();
    });
    
    it('Successfully Edit Part in Necessary', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Edit').click();
    
            cy.get('input[type="number"]').clear().type('3');
        });

        cy.get('.details-btn').contains('Save').click();
    });

    it('Successfully Move to Used from Necessary', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Move to Used').click();
        });

        cy.get('.btn-primary').contains('Confirm').click();
    });

    it('Successfully Return to Necessary from Used', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.details-btn').contains('Return to Necessary').click();
        });
        
        cy.get('.btn-primary').contains('Return to Necessary').click();
        cy.contains('Part returned to necessary successfully').should('be.visible');
    });

    it('Successfully Remove from Necessary Parts', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Remove').click();
        });

        cy.get('.btn-primary').contains('Remove').click();
        cy.contains('Necessary part removed successfully.').should('be.visible');
    });

    it('Successfully Add Part to Used Parts', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Target the specific section before clicking the 'Add Part' button
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.add-part-btn').click();
        });
        cy.get('.form-control').type('MBL5WGT5');
        
        cy.get('.btn-primary').contains('Add').click();
    });

    it('Successfully Edit Part in Used Parts', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.details-btn').contains('Edit').click();
    
            cy.get('input[type="number"]').clear().type('2');
        });

        cy.get('.details-btn').contains('Save').click();
        cy.contains('Used part updated successfully').should('be.visible');
    });

    it('Successfully Remove from Necessary Parts', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.details-btn').contains('Remove').click();
        });

        cy.get('.btn-primary').contains('Remove Part').click();
    });

    it('Successfully cancel add estimate', () => {
        cy.contains('JOBS').click();
        cy.contains('Testing Test').click();

        cy.get('.details-btn').contains('Add Estimate').click();
        cy.get('.btn-secondary').contains('Cancel').click();
    });

    it('Successfully add a second Job', () => {   
        cy.contains('JOBS').click();
        cy.get('.add-button').contains('+').click();

        cy.get('input[id="customer_name"]').type('Other Tester');
        cy.get('input[id="address"]').type('987 Other Street');
        cy.get('input[id="phone"]').type('111-111-1111');
        cy.get('input[id="email"]').type('OtherTester123@test.com');

        cy.contains('Add Job').click();
    });

    it('Filters Jobs based on search input', () => {
        cy.contains('JOBS').click();
        
        cy.get('.search-input-jobs').type('Testing Test');

        cy.contains('td', 'Testing Test').should('be.visible');
        cy.contains('td', 'Other Tester').should('not.exist');
    });

    it('Successfully edit a Job', () => {
        cy.contains('JOBS').click();

        cy.contains('tr', 'Testing Test').within(() => {
            cy.get('.edit-btn').click(); 
        });    

        cy.get('input[id="customer_name"]').clear().type('Testing Edit');
        cy.get('input[id="address"]').clear().type('123 Edit Street');
        cy.get('input[id="phone"]').clear().type('109-876-5432');
        cy.get('input[id="email"]').clear().type('TestingEdit123@Edit.com');
        
        cy.get('.btn-primary').contains('Save Changes').click();
    });

    it('Successfully cancel delete Job', () => {
        cy.contains('JOBS').click();

        cy.contains('tr', 'Other Tester').within(() => {
            cy.get('.remove-btn').click(); // Click the edit button within this row
        });

        cy.get('.btn-secondary').click();
    });

    it('Successfully delete Job', () => {
        cy.contains('JOBS').click();

        cy.contains('tr', 'Other Tester').within(() => {
            cy.get('.remove-btn').click(); // Click the edit button within this row
        });

        cy.get('.btn-primary').click();
    });
});  