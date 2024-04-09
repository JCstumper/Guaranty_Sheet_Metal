describe('Open application and test login', () => {
  it('Page Opened!', () => {
      cy.visit('https://localhost/login')
  });

  beforeEach(() => {
    // Intercept the GET request to /api/auth/verify and provide a custom response
    cy.intercept('GET', '/api/auth/verify', {
      statusCode: 401, // Example response assuming unauthorized access prompts login
      body: {
          authenticated: false,
      },
    }).as('verifyAuth');

    // Visit the application
    cy.visit('https://localhost');

    // Wait for the verification fetch to complete
    cy.wait('@verifyAuth');
  });

  it('Should login with admin credentials', () => {
      // Intercept any other necessary requests here

      // Type the username
      cy.get('input[name="username"]').type('admin');

      // Type the password
      cy.get('input[name="password"]').type('Admin123!');

      // Click the login button
      cy.get('.login-button').click();

      // Optionally, verify the login was successful
      // This can be done by checking for a logout button, a user's dashboard, or any other indicator of successful login.
      // Example:
      // cy.contains('Logout').should('be.visible');

      // Or, if a success toast message is shown, you can wait for that toast message
      cy.contains('Login Successful!').should('be.visible');
  });

  it('Should not login due to incorrect password', () => {
    // Intercept any other necessary requests here

    // Type the username
    cy.get('input[name="username"]').type('admin');

    // Type the password
    cy.get('input[name="password"]').type('dog');

    // Click the login button
    cy.get('.login-button').click();

    // Optionally, verify the login was successful
    // This can be done by checking for a logout button, a user's dashboard, or any other indicator of successful login.
    // Example:
    // cy.contains('Logout').should('be.visible');

    // Or, if a success toast message is shown, you can wait for that toast message
    cy.contains('Username or Password is incorrect').should('be.visible');
  });

  it('Should not login with incorrect username', () => {
    // Intercept any other necessary requests here

    // Type the username
    cy.get('input[name="username"]').type('dog');

    // Type the password
    cy.get('input[name="password"]').type('Jake2101!');

    // Click the login button
    cy.get('.login-button').click();

    // Optionally, verify the login was successful
    // This can be done by checking for a logout button, a user's dashboard, or any other indicator of successful login.
    // Example:
    // cy.contains('Logout').should('be.visible');

    // Or, if a success toast message is shown, you can wait for that toast message
    cy.contains('Username or Password is incorrect').should('be.visible');
  });
});
