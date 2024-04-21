describe('Open application and test purchases', () => {
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
        cy.get('#material-type').type('Apple');
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

    it('Successfully add product 2', () => {
        cy.contains('INVENTORY').click();
        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('SUP-54322');
        cy.get('#radius-size').type('5');
        cy.get('#material-type').type('Bravo');
        cy.get('#color').type('Green');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('0');
        cy.get('#price').type('3.48');

        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');
    });

    it('Successfully add product 3', () => {
        cy.contains('INVENTORY').click();
        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('SUP-54323');
        cy.get('#radius-size').type('5');
        cy.get('#material-type').type('Charlie');
        cy.get('#color').type('Yellow');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('0');
        cy.get('#price').type('3.48');

        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');
    });

    it('Successfully add product 4', () => {
        cy.contains('INVENTORY').click();
        cy.get('.add-button').click();

        cy.get('#auto-generate-part-number').check();
        cy.get('input[id="supplier-part-number"]').type('SUP-54324');
        cy.get('#radius-size').type('5');
        cy.get('#material-type').type('Delta');
        cy.get('#color').type('Green');
        cy.get('#description').type('This is a test product description');
        cy.get('#type').type('Widget');
        cy.get('#catcode').invoke('val').then(val => {
            if (!val) cy.get('#catcode').type('WGT');
        });
        cy.get('#item-type').select('length');
        cy.get('#quantity-of-item').type('7');
        cy.get('#price').type('3.48');

        cy.contains('Add Item').click();

        cy.contains('Item added successfully').should('be.visible');
    });

    it('Successfully edit product 3 quantity in stock', () => {
        cy.contains('INVENTORY').click();
        cy.contains('CYL5WGT0').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('12');

        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');
    });

    it('Successfully edit product 4 quantity in stock', () => {
        cy.contains('INVENTORY').click();
        cy.contains('DGN5WGT7').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('9');

        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');
    });

    it('Navigate to purchases', () => {
        cy.contains('PURCHASES').click();
    });

    it('Successfully add order', () => {
        cy.contains('PURCHASES').click();
        cy.get('.add-button').click();

        // Fill out the form
        cy.get('input[name="supplier_name"]').type('Acme Supplies');
        cy.get('input[name="invoice_date"]').type('2023-04-20');

        cy.get('button').contains('Add Order').click();

    });

    it('Expand the new order made', () => {
        cy.contains('PURCHASES').click();

        cy.contains('Acme Supplies').click();

        cy.get('.order-details-expanded').should('be.visible');
    });

    it('Add a single item from low inventory', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000); // Adjust based on your application's needs

        // Optionally, assert the presence of at least one item before attempting to add
        cy.get('.parts-subsection.low-stock .add-order').should('have.length.greaterThan', 0)
            .then(($buttons) => {
                const initialButtonsCount = $buttons.length;
                cy.get('.parts-subsection.low-stock .add-order').first().click();
                cy.wait(1000); // Adjust based on your application's response time

                // Optionally, confirm the decrease in "Add to Order" buttons in the low inventory section
                cy.get('.parts-subsection.low-stock .add-order').should('have.length', initialButtonsCount - 1);

                // Assert that a new item exists in the new order section
                cy.get('.parts-subsection.new-order tbody tr').should('exist');
            });
    });

    it('Add a single item from out of stock', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000); // Adjust based on your application's needs

        // Optionally, assert the presence of at least one item before attempting to add
        cy.get('.parts-subsection.out-of-stock .add-order').should('have.length.greaterThan', 0)
            .then(($buttons) => {
                const initialButtonsCount = $buttons.length;
                cy.get('.parts-subsection.out-of-stock .add-order').first().click();
                cy.wait(1000); // Adjust based on your application's response time

                // Optionally, confirm the decrease in "Add to Order" buttons in the out-of-stock section
                cy.get('.parts-subsection.out-of-stock .add-order').should('have.length', initialButtonsCount - 1);

                // Assert that a new item exists in the new order section
                cy.get('.parts-subsection.new-order tbody tr').should('exist');
            });
    });

    it('Remove one item from the order', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000);

        // Assert the presence of at least one item before attempting to remove
        cy.get('.parts-subsection.new-order tbody tr').should('have.length.greaterThan', 0)
            .then(($rows) => {
                const initialCount = $rows.length;
                cy.get('.parts-subsection.new-order .remove-button').first().click();

                // Wait and assert that the count of items has decreased
                cy.wait(1000);
                cy.get('.parts-subsection.new-order tbody tr').should('have.length', initialCount - 1);
            });
    });

    it('Remove one from the orderk', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000);

        cy.get('.parts-subsection.new-order tbody tr').should('have.length.greaterThan', 0)
            .then(($rows) => {
                const initialCount = $rows.length;
                cy.get('.parts-subsection.new-order .remove-button').first().click();

                // Wait and assert that the count of items has decreased
                cy.wait(1000);
                cy.get('.parts-subsection.new-order tbody tr').should('have.length', initialCount - 1);
            });
    });

    it('Add all from out of stock', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000);

        cy.get('.parts-subsection.out-of-stock .add-all').click();
        cy.wait(1000);

        // Assert that a new item exists in the new order section
        cy.get('.parts-subsection.new-order tbody tr').should('exist');
    });

    it('Mark order as Generated', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').parent('tr').within(() => {
            cy.get('.mark-as-generated').click();
        });
        cy.wait(1000);

        // Assuming the status is in the same row and updates in place
        cy.contains('Acme Supplies').parent('tr').find('td').eq(3).should('contain.text', 'Generated');
    });

    it('Add shipping cost to an order', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').click();
        cy.wait(1000); // Wait for potential page interactions to complete

        // Click the 'Add Shipping Cost' button to open the modal
        cy.contains('tr', 'Acme Supplies').find('.edit-button').click();

        // Wait for the modal to appear and type in the new shipping cost
        cy.get('.modal-number-input').as('shippingCostInput').should('be.visible').type('100');

        // Click the 'Submit' button on the modal
        cy.get('button').contains('Submit').click();

        // Verify the update - Adjust according to how your app shows the update 
        // Example: If the total cost is displayed in a table cell alongside the order:
        cy.contains('tr', 'Acme Supplies').within(() => {
            cy.get('td').eq(1).should('contain.text', '100'); // Adjust the eq index based on your table structure
        });

        // Optionally, wait for a success message or another indication that the operation was successful
        // cy.contains('Total cost updated successfully.').should('be.visible');
    });

    it('Mark order as Received', () => {
        cy.contains('PURCHASES').click();
        cy.contains('Acme Supplies').parent('tr').within(() => {
            cy.get('.mark-as-received').click();
        });
        cy.wait(1000);

        // Assuming the status is in the same row and updates in place
        cy.contains('Acme Supplies').parent('tr').find('td').eq(3).should('contain.text', 'Received');
    });

});  