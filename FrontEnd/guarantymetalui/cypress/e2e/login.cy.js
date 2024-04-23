describe('Test login', () => {
  it('Page Opened!', () => {
      cy.visit('https://localhost/login')
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/auth/verify', {
      body: {
          authenticated: false,
      },
    }).as('verifyAuth');

    cy.visit('https://localhost');

    cy.wait('@verifyAuth');
  });

  it('Should login with admin credentials', () => {
      cy.get('input[name="username"]').type('admin');
      cy.get('input[name="password"]').type('Admin123!');
      cy.get('.login-button').click();
      cy.contains('Login Successful!').should('be.visible');
  });

  it('Should not login due to incorrect password', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('dog');
    cy.get('.login-button').click();
    cy.contains('Username or Password is incorrect').should('be.visible');
  });

  it('Should not login with incorrect username', () => {
    cy.get('input[name="username"]').type('dog');
    cy.get('input[name="password"]').type('Jake2101!');
    cy.get('.login-button').click();
    cy.contains('Username or Password is incorrect').should('be.visible');
  });
});
