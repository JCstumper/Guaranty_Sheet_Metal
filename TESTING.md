# Cypress Tests Documentation

This documentation provides an overview of automated end-to-end tests for the web application using Cypress. These tests cover critical functionalities such as login, navigation, and inventory management.

## Login Tests (`login.cy.js`)

### Test: Page Opened!
- Opens the login page at 'https://localhost/login'.

```javascript
    it('Page Opened!', () => {
        cy.visit('https://localhost/login')
    });
```

### Test: Should login with admin credentials
- Logs into the application using the 'admin' username and 'Admin123!' password.
- Verifies that the login is successful by checking for the 'Login Successful!' message.

```javascript
    it('Should login with admin credentials', () => {
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('Admin123!');
        cy.get('.login-button').click();
        cy.contains('Login Successful!').should('be.visible');
    });
```

### Test: Should not login due to incorrect password
- Attempts to log in with the correct username ('admin') and an incorrect password ('dog').
- Verifies that the login fails by checking for an error message indicating the username or password is incorrect.

```javascript
    it('Should not login due to incorrect password', () => {
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('dog');
        cy.get('.login-button').click();
        cy.contains('Username or Password is incorrect').should('be.visible');
    });
```

### Test: Should not login with incorrect username
- Attempts to log in with an incorrect username ('dog') and a password ('Jake2101!').
- Verifies that the login fails by checking for an error message indicating the username or password is incorrect.

```javascript
    it('Should not login with incorrect username', () => {
        cy.get('input[name="username"]').type('dog');
        cy.get('input[name="password"]').type('Jake2101!');
        cy.get('.login-button').click();
        cy.contains('Username or Password is incorrect').should('be.visible');
    });
```

## Topbar Navigation Tests (`topbar.cy.js`)

### Setup: Login and Wait for Verification
- Sets the viewport size, intercepts authentication verification, logs in with valid credentials, and waits for confirmation.

```javascript
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
```

### Test: Navigate to inventory
- Clicks the 'INVENTORY' button and checks if the inventory page is visible.

```javascript
    it('Navigate to inventory', () => { 
        cy.get('.list-button').contains('INVENTORY').click();
        cy.get('.table-title').contains('INVENTORY').should('be.visible');
    });
```

### Test: Navigate to different sections
- Tests navigation to different parts of the application such as 'PURCHASES', 'JOBS', 'LOGS', and 'DASHBOARD'.
- Verifies that the correct page is visible after each navigation.

```javascript
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
        cy.contains('Revenue Breakdown').should('be.visible');
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
        cy.contains('Revenue Breakdown').should('be.visible');
    });
```

## Inventory Management Tests (`inventory.cy.js`)

### Setup: Login and Wait for Verification
- Identical setup to the 'Topbar Navigation Tests' section.

### Test: Navigate to inventory
- Navigates to the inventory section after logging in.

```javascript
    it('Navigate to inventory', () => { 
        cy.contains('INVENTORY').click();
    });
```
### Test: Successfully add product
- Adds a new product with detailed specifications such as part number, supplier part number, radius size, material type, color, description, type, category code, item type, quantity, and price.
- Verifies that the product is added successfully by looking for a success message.

```javascript
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
```

### Test: Successfully edit product
- Edits an existing product with updated details.
- Submits the changes and verifies that the product is updated successfully by checking for a success message.

```javascript
    it('Successfully edit product', () => { 
        cy.contains('INVENTORY').click();
        cy.contains('MBL5WGT20').click();

        cy.get('.edit-button').contains('Edit').click();

        cy.get('input[id="supplier-part-number"]').clear().type('SuppNewPart123');
        cy.get('input[id="radius-size"]').clear().type('7');
        cy.get('input[id="material-type"]').clear().type('Aluminium');
        cy.get('input[id="color"]').clear().type('blue');
        cy.get('textarea[id="description"]').clear().type('Updated description for the product');
        cy.get('input[id="type"]').clear().type('NewCategory');
        cy.get('input[id="catcode"]').clear().type('CAT123');
        cy.get('select[id="item-type"]').select('Box Item');
        cy.get('input[id="quantity-of-item"]').clear().type('100');
        cy.get('input[id="price"]').clear().type('200');
        cy.get('input[id="mark-up-price"]').clear().type('260');
        cy.get('form').submit();
        cy.contains('Product updated successfully').should('be.visible');
    });
```

### Test: Filters products based on search input
- Types into the search input to filter products.
- Verifies that the correct product appears in the search and that unrelated products are not shown.

```javascript
    it('Filters products based on search input', () => {
        cy.contains('INVENTORY').click();
        
        cy.get('.search-input').type('ABL7CAT123');

        cy.contains('td', 'ABL7CAT123').should('be.visible');
        cy.contains('td', 'C5G20').should('not.exist');
    });
```

### Test: Filters products based on checkbox selections
- Filters the inventory items by checking a filter box, specifically looking for items with a 7" description.
- Verifies that the correct filtered items are displayed.

```javascript
    it('Filters products based on checkbox selections', () => {
        cy.contains('INVENTORY').click();
    
        cy.contains('label', '7"').find('input[type="checkbox"]').check({force: true});
    
        cy.contains('td', '7" Updated description for the product').should('be.visible');
    });
```

### Test: Successfully edit product quantity in stock
- Edits the quantity in stock of a specific product.
- Verifies the update by checking for a success message.

```javascript
    it('Successfully edit product quantity in stock', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.edit-button').contains('Edit Quantity').click();

        cy.get('.edit-quantity-modal-input').clear().type('12');
        
        cy.get('.edit-quantity-modal-update-btn').contains('Update').click();
        cy.contains('Quantity updated successfully').should('be.visible');
    });
```

### Test: Successfully cancel delete product
- Initiates the delete action for a product and then cancels it.

```javascript
    it('Successfully cancel delete product', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.delete-button').click();
        cy.get('.delete-cancel').click();
    });
```

### Test: Successfully delete product
- Deletes a product and verifies that the deletion is successful by checking for a success message.

```javascript
    it('Successfully delete product', () => {
        cy.contains('INVENTORY').click();
        cy.contains('ABL7CAT123').click();

        cy.get('.delete-button').click();
        cy.get('.delete-confirm').click();
        
        cy.contains('Product deleted successfully').should('be.visible');
    });
```
