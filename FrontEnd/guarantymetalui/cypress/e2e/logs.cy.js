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

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });
    });

    it('Successfully add a new user and verify in the logs page', () => {
        cy.get('.username').click();
        cy.get('.add-a-user').contains('Add a User').click();

        cy.get('input[id="Username"]').clear().type('newUser123');
        cy.get('input[id="Password"]').clear().type('newPassword123!');
        cy.get('input[id="Email"]').clear().type('newUser123@gmail.com');

        cy.get('.btn-primary').contains('Register').click();
        cy.contains('Registration successful').should('be.visible');

        // Wait for the toast to appear and click the close button
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Added User').scrollIntoView().should('be.visible');
        cy.contains('Add User').should('be.visible');
        cy.contains('Added User to Application Whitelist username: newUser123 email: newUser123@gmail.com role: employee').should('be.visible');

        cy.get('.username').click();
        cy.get('.manage-users').contains('Manage Users').click();

        cy.contains('.user-item', 'newUser123') // This targets a div with class 'user-item' containing text 'testUser'
          .within(() => {
            cy.get('button').contains('Remove').click(); // Clicks the Remove button
          });

        // Check modal actions
        cy.get('.modal-backdrop').should('be.visible');
        cy.get('.modal-content').eq(0).within(() => {
            cy.get('button.btn-primary').contains('Confirm').click({force: true});
        });


        // Check if the deletion was successful
        cy.contains('User successfully removed').should('be.visible');
    });

    it('Successfully add product and verify in the logs page', () => {   
        cy.contains('INVENTORY').click();
        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('GTY-66498');
        cy.get('#radius-size').type('5');
        cy.get('#material-type').type('Copper');
        cy.get('#color').type('Copper');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('15');
        cy.get('#price').type('10.20');
        
        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Add Product').scrollIntoView().should('be.visible');
        cy.contains('Inventory').should('be.visible');
        cy.contains('Product Added').should('be.visible');
        cy.contains('supplierPartNumber: GTY-66498 radiusSize: 5 materialType: Copper color: Copper description: This is a test product description type: Widget quantityOfItem: 15 unit: ft price: 10.20 markUpPrice: 13.26 catCode: WGT').should('be.visible');
    });

    it('Successfully edit product and verify in the logs page', () => { 
        cy.contains('INVENTORY').click();

        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('YPD-9902');
        cy.get('#radius-size').type('90');
        cy.get('#material-type').type('Metal');
        cy.get('#color').type('Red');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('50');
        cy.get('#price').type('100');

        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });
        
        cy.contains('MRD90WGT50').click();

        cy.get('.edit-button').contains('Edit').click();

        cy.get('input[id="supplier-part-number"]').clear().type('BrandNewPart123');
        cy.get('input[id="radius-size"]').clear().type('25');
        cy.get('input[id="material-type"]').clear().type('Aluminium');
        cy.get('input[id="color"]').clear().type('Gray');
        cy.get('textarea[id="description"]').clear().type('Updated item');
        cy.get('input[id="type"]').clear().type('NewCategory');
        cy.get('input[id="catcode"]').clear().type('NEW889');
        cy.get('select[id="item-type"]').select('Box Item');
        cy.get('input[id="quantity-of-item"]').clear().type('80');
        cy.get('input[id="price"]').clear().type('60');
        cy.get('input[id="mark-up-price"]').clear().type('300');
        cy.get('form').submit();
        cy.contains('Product updated successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Update Product').scrollIntoView().should('be.visible');
        cy.contains('Inventory').should('be.visible');
        cy.contains('Product Information Updated partNumber: A25NEW889 supplierPartNumber: BrandNewPart123 radiusSize: 25 materialType: Aluminum color: Gray description: Updated item type: NewCategory oldType: Widget quantityOfItem: 80 unit: pcs price: 60 markUpPrice: 300 catCode: NEW889 ').scrollIntoView().should('be.visible');
    });

    it('Successfully update product and verify in the logs page', () => {
        cy.contains('INVENTORY').click();
        cy.contains('C5WGT15').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('20');
        
        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Update Quantity').scrollIntoView().should('be.visible');
        cy.contains('Inventory').should('be.visible');
        cy.contains('Product Quantity In Stock Updated quantity_in_stock: 20').should('be.visible');
    });


    it('Successfully delete product and verify in the logs page', () => {
        cy.contains('INVENTORY').click();
        cy.contains('C5WGT15').click();

        cy.get('.delete-button').click();
        cy.get('.delete-confirm').click();

        
        cy.contains('Product deleted successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Delete Product').scrollIntoView().should('be.visible');
        cy.contains('Inventory').should('be.visible');
        cy.contains('Product Deleted part_number: C5WGT15 supplier_part_number: GTY-66498 radius_size: 5 material_type: Copper color: Copper description: This is a test product description type: Widget quantity_of_item: 15.00 unit: ft price: $10.20 mark_up_price: $13.26').should('be.visible');
    });
    

    it('Successfully updated user informationa and verify in the logs page', () => {
        cy.get('.username').click();
        cy.get('.edit-profile').contains('Edit Profile').click();

        cy.get('input[id="Username"]').clear().type('brandNewUser');
        cy.get('input[id="Password"]').clear().type('brandNewUser123!');
        cy.get('input[id="Email"]').clear().type('brandNewUser123@gmail.com');

        cy.get('.btn-primary').contains('Save Changes').click();

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

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
    });
});