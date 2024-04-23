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

    it('Successfully Add a New User and Verify in the Logs Page', () => {
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

    it('Successfully Updated User Informationa and Verify in the Logs Page', () => {
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

    it('Successfully Add Product and Verify in the Logs Page', () => {   
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

    it('Successfully Add a Job and Verify in the Logs Page', () => {   
        cy.contains('JOBS').click();
        cy.get('.add-button').contains('+').click();

        cy.get('input[id="customer_name"]').type('Test 1');
        cy.get('input[id="address"]').type('123 Playground Stret');
        cy.get('input[id="phone"]').type('555-555-5555');
        cy.get('input[id="email"]').type('test1@gmail.com');

        cy.contains('Add Job').click();

        cy.contains('LOGS').click();

        cy.contains('Add Job').scrollIntoView().should('be.visible');
        cy.contains('Job Management').should('be.visible');
        cy.contains('Added job_id: 3 customer_name: Test 1 address: 123 Playground Stret phone: 555-555-5555 email: test1@gmail.com').should('be.visible');
    });

    it('Successfully Add Product C5WGT15 to Necessary Parts and Verify in Logs Page', () => {
        cy.contains('JOBS').click();
        cy.contains('Test 1').click();
    
        // Target the specific section before clicking the 'Add Part' button
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.add-part-btn').click();
        });
        cy.get('.form-control').type('C5WGT15');
        
        cy.get('.btn-primary').contains('Add').click();

        cy.contains('LOGS').click();

        cy.contains('Add Necessary Part').scrollIntoView().should('be.visible');
        cy.contains('Necessary Parts').should('be.visible');
        cy.contains('Add necessary part').should('be.visible');
    });

    it('Successfully Edit Product C5WGT15 in Necessary Parts and Verify in the Logs Page', () => {
        cy.contains('JOBS').click();
        cy.contains('Test 1').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Edit').click();
    
            cy.get('input[type="number"]').clear().type('500');
        });

        cy.get('.details-btn').contains('Save').click();

        cy.get('.btn-primary').contains('Update').click();

        cy.contains('Part updated successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Update Necessary Part').scrollIntoView().should('be.visible');
        cy.contains('Necessary Parts').should('be.visible');
        cy.contains('Update id: 3 job_id: 3 part_number: C5WGT15 quantity_required: 500').should('be.visible');
    });

    it('Successfully Move Product C5WGT15 from Necessary Parts to Used Parts and Verify in the Logs Page', () => {
        cy.contains('INVENTORY').click();
        cy.contains('C5WGT15').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('50');
        
        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });
        
        cy.contains('JOBS').click();
        cy.contains('Test 1').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Move to Used').click();
        });

        cy.get('.btn-primary').contains('Confirm').click();

        cy.contains('Part moved to used successfully.').should('be.visible');
        cy.contains('50 of C5WGT15 moved.').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });
        
        cy.contains('LOGS').click();

        cy.contains('Move to Used').scrollIntoView().should('be.visible');
        cy.contains('Part Movement').should('be.visible');
        cy.contains('Part moved to used successfully. 50 of C5WGT15 moved.').should('be.visible');
    });

    it('Successfully Returned Product C5WGT15 From Used Parts to Necessary Parts and Verify in the Logs Page', () => {
        cy.contains('JOBS').click();
        cy.contains('Test 1').click();
    
        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.details-btn').contains('Return to Necessary').click();
        });
        
        cy.get('.btn-primary').contains('Return to Necessary').click();
        cy.contains('Part returned to necessary successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Return to Necessary').scrollIntoView().should('be.visible');
        cy.contains('Part Management').should('be.visible');
        cy.contains('Part returned to necessary successfully job_id: 3 part_number: C5WGT15 quantity_returned: 50 ').should('be.visible');
    });

    it('Successfully Remove Product C5WGT15 from Used Parts and Verify in the Logs Page', () => {
        cy.contains('JOBS').click();
        cy.contains('Test 1').click();
    
        cy.contains('div', 'Necessary Parts').within(() => {
            cy.get('.details-btn').contains('Move to Used').click();
        });

        cy.get('.btn-primary').contains('Confirm').click();

        cy.contains('Part moved to used successfully.').should('be.visible');
        cy.contains('50 of C5WGT15 moved.').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        // Navigate to the Necessary Parts section and initiate editing
        cy.contains('div', 'Used Parts').within(() => {
            cy.get('.details-btn').contains('Remove').click();
        });

        cy.get('.btn-primary').contains('Remove Part').click();
        cy.contains('Part C5WGT15 removed from used.').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').first().click();
        });

        cy.contains('LOGS').click();

        cy.contains('Delete From Used').scrollIntoView().should('be.visible');
        cy.contains('Part Management').should('be.visible');
        cy.contains('Part C5WGT15 removed from used and quantity added back to inventory. part_number: C5WGT15 quantity_in_stock: 50 ').should('be.visible');
    });

    it('Successfully Edit a Job and Verify in the Logs Page', () => {
        cy.contains('JOBS').click();

        cy.contains('tr', 'Test 1').within(() => {
            cy.get('.edit-btn').click(); 
        });    

        cy.get('input[id="customer_name"]').clear().type('Test 2');
        cy.get('input[id="address"]').clear().type('123 Edit Street');
        cy.get('input[id="phone"]').clear().type('666-666-6666');
        cy.get('input[id="email"]').clear().type('Testing123@Edit.com');
        
        cy.get('.btn-primary').contains('Save Changes').click();

        cy.wait(1000);

        cy.contains('LOGS').click();

        cy.contains('Update Job').scrollIntoView().should('be.visible');
        cy.contains('Job Management').should('be.visible');
        cy.contains('Update job_id: 3 customer_name: Test 2 address: 123 Edit Street phone: 666-666-6666 email: Testing123@Edit.com').should('be.visible');
    });

    it('Successfully Delete Job and Verify in the Logs Page', () => {
        cy.contains('JOBS').click();

        cy.contains('tr', 'Test 2').within(() => {
            cy.get('.remove-btn').click(); // Click the edit button within this row
        });

        cy.get('.btn-primary').click();

        cy.contains('Job 3 removed successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Delete Job').scrollIntoView().should('be.visible');
        cy.contains('Job Management').should('be.visible');
        cy.contains('Job at address 123 Edit Street removed successfully job_id: 3 customer_name: Test 2 address: 123 Edit Street phone: 666-666-6666 email: Testing123@Edit.com').should('be.visible');
    });

    it('Successfully Edit Product and Verify in the Logs Page', () => { 
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
        cy.contains('Product Information Updated partNumber: A25NEW889 supplierPartNumber: BrandNewPart123 radiusSize: 25 materialType: Aluminium color: Gray description: Updated item type: NewCategory oldType: Widget quantityOfItem: 80 unit: pcs price: 60 markUpPrice: 300 catCode: NEW889').scrollIntoView().should('be.visible');
    });

    it('Successfully Update Product Quantity and Verify in the Logs Page', () => {
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

    it('Successfully Add an Order and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.get('.add-button').click();

        // Fill out the form
        cy.get('input[name="supplier_name"]').type('Supplier 1');
        cy.get('input[name="invoice_date"]').type('2024-04-22');

        cy.get('button').contains('Add Order').click();
        
        cy.contains('Order added successfully.').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        // cy.contains('Add').scrollIntoView().should('be.visible');
        cy.contains('Invoice').should('be.visible');
        cy.contains('Added invoice supplier_name: Supplier 1 total_cost: null invoice_date: 2024-04-22 status: Building').should('be.visible');
    });

    it('Add a Single Item from Out of Stock and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').click();

        // Optionally, assert the presence of at least one item before attempting to add
        cy.get('.parts-subsection.out-of-stock .add-order').should('have.length.greaterThan', 0)
            .then(($buttons) => {
                const initialButtonsCount = $buttons.length;
                cy.get('.parts-subsection.out-of-stock .add-order').first().click();

                // Assert that a new item exists in the new order section
                cy.get('.parts-subsection.new-order tbody tr').should('exist');
            });

        cy.contains('LOGS').click();

        cy.contains('New Order').should('be.visible');
        cy.contains('Added item to new order invoiceId: 1 partNumber: A25NEW889 quantity: 0 source: outOfStock amount_to_order: 15').should('be.visible');
    });

    it('Add a Single Item from Low Inventory and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').click();

        // Optionally, assert the presence of at least one item before attempting to add
        cy.get('.parts-subsection.low-stock .add-order').should('have.length.greaterThan', 0)
            .then(($buttons) => {
                const initialButtonsCount = $buttons.length;
                cy.get('.parts-subsection.low-stock .add-order').first().click();

                // Assert that a new item exists in the new order section
                cy.get('.parts-subsection.new-order tbody tr').should('exist');
            });

        cy.contains('LOGS').click();

        cy.contains('New Order').should('be.visible');
        cy.contains('Added item to new order invoiceId: 1 partNumber: MBL5WGT5 quantity: 12 source: lowInventory amount_to_order: 15').should('be.visible');
    });

    it('Remove a Single Item from the Order and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').click();

        // Assert the presence of at least one item before attempting to remove
        cy.get('.parts-subsection.new-order tbody tr').should('have.length.greaterThan', 0)
            .then(($rows) => {
                const initialCount = $rows.length;
                cy.get('.parts-subsection.new-order .remove-button').first().click();
            });

        cy.contains('LOGS').click();

        cy.contains('Update').scrollIntoView().should('be.visible');
        cy.contains('Out-of-Stock Inventory').should('be.visible');
        cy.contains('Updated 1 out-of-stock items for invoice 1').should('be.visible');
        // cy.contains('Item returned to out_of_stock invoiceId: 1 partNumber: A25NEW889 quantity: 0 source: outOfStock').should('be.visible');
    });

    it('Mark Order as Generated and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').parent('tr').within(() => {
            cy.get('.mark-as-generated').click();
        });

        // New: Verify success message for order status update to Generated
        cy.contains('Order status updated to Generated.').should('be.visible');

        // Wait for the toast to appear and click the close button
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Update Order Details').scrollIntoView().should('be.visible');
        cy.contains('Order Status Update').should('be.visible');
        cy.contains('Updated the order details invoiceId: 1 status: Generated total_cost: null').should('be.visible');
    });

    it('Add shipping Cost to the Order and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').click();

        // Click the 'Add Shipping Cost' button to open the modal
        cy.contains('tr', 'Supplier 1').find('.edit-button').click();

        // Wait for the modal to appear and type in the new shipping cost
        cy.get('.modal-number-input').as('shippingCostInput').should('be.visible').type('1000');

        // Click the 'Submit' button on the modal
        cy.get('button').contains('Submit').click();

        // New: Verify success message for total cost update
        cy.contains('Total cost updated successfully.').should('be.visible');

        // Wait for the toast to appear and click the close button
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Invoice Total Cost').scrollIntoView().should('be.visible');
        cy.contains('Total cost updated invoiceId: 1 total_cost: 1000').should('be.visible');
    });

    it('Mark order as Received and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Supplier 1').parent('tr').within(() => {
            cy.get('.mark-as-received').click();
        });

        // New: Verify success message for order status update to Received
        cy.contains('Order status updated to Received.').should('be.visible');

        // Wait for the toast to appear and click the close button
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Update Order Details').scrollIntoView().should('be.visible');
        cy.contains('Order Status Update').scrollIntoView().should('be.visible');
        cy.contains('Updated the order details invoiceId: 1 status: Received total_cost: 1000').should('be.visible');
    });

    it('Delete an Order and Verify in the Logs Page', () => {
        cy.contains('PURCHASES').click();

        cy.get('.delete-button').click();

        cy.get('.btn-primary').contains('Delete Order').click();

        cy.contains('Order successfully deleted.').should('be.visible');

        // Wait for the toast to appear and click the close button
        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Delete').scrollIntoView().should('be.visible');
        cy.contains('Invoice Deletion').scrollIntoView().should('be.visible');
        cy.contains('Invoice and all related records deleted invoiceId: 1').should('be.visible');
    });

    it('Successfully Delete Product C5WGT15 and Verify in the Logs Page', () => {
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
    
    it('Successfully Delete Product A25NEW889 and Verify in the Logs Page', () => {
        cy.contains('INVENTORY').click();
        cy.contains('A25NEW889').click();

        cy.get('.delete-button').click();
        cy.get('.delete-confirm').click();

        
        cy.contains('Product deleted successfully').should('be.visible');

        cy.get('.Toastify__toast-container').within(() => {
            cy.get('.Toastify__close-button').click();
        });

        cy.contains('LOGS').click();

        cy.contains('Delete Product').scrollIntoView().should('be.visible');
        cy.contains('Inventory').should('be.visible');
        cy.contains('Product Deleted part_number: A25NEW889 supplier_part_number: BrandNewPart123 radius_size: 25 material_type: Aluminium color: Gray description: Updated item type: NewCategory quantity_of_item: 80.00 unit: pcs price: $60.00 mark_up_price: $300.00').should('be.visible');
    });
});