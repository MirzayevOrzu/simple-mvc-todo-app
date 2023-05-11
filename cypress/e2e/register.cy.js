/// <reference types="cypress" />

describe('Registeration', () => {
  describe('UI page', () => {
    it('visit successful', () => {
      cy.visit('http://localhost:3001/register');
    });

    describe('navigation', () => {
      describe('desktop', () => {
        it('contains link to home page', () => {
          cy.viewport('macbook-16');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar')
            .contains('TODO APP')
            .should('have.attr', 'href', '/?userId=false')
            .should('be.visible');
          cy.get('.navbar')
            .contains('Home')
            .should('have.attr', 'href', '/?userId=false')
            .should('be.visible');
        });

        it('contains link to login page', () => {
          cy.viewport('macbook-16');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar')
            .contains('Login')
            .should('have.attr', 'href', '/login')
            .should('be.visible');
        });

        it('contains link to register page', () => {
          cy.viewport('macbook-16');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar')
            .contains('Register')
            .should('have.attr', 'href', '/register')
            .should('be.visible');
        });
      });

      describe('mobile', () => {
        it('contains link to home page with logo', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar')
            .contains('TODO APP')
            .should('have.attr', 'href', '/?userId=false')
            .should('be.visible');
        });

        it('does not show link to home', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar')
            .contains('Home')
            .should('have.attr', 'href', '/?userId=false')
            .should('not.be.visible');
        });

        it('shows link to home when navbar opened', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar').contains('Home').should('not.be.visible');
          cy.get('.navbar-toggler').click();
          cy.get('.navbar').contains('Home').should('be.visible');
        });

        it('does not show link to login', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar').contains('Login').should('not.be.visible');
        });

        it('shows link to login when navbar opened', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar').contains('Login').should('not.be.visible');
          cy.get('.navbar-toggler').click();
          cy.get('.navbar').contains('Login').should('be.visible');
        });

        it('does not show link to register', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar').contains('Register').should('not.be.visible');
        });

        it('shows link to register when navbar opened', () => {
          cy.viewport('samsung-s10');
          cy.visit('http://localhost:3001/register');
          cy.get('.navbar').contains('Register').should('not.be.visible');
          cy.get('.navbar-toggler').click();
          cy.get('.navbar').contains('Register').should('be.visible');
        });
      });
    });

    describe('username input', () => {
      it('exists', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#username').should('exist').and('be.visible');
      });

      it('focuses', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#username').should('be.enabled');
        cy.get('input#username').click();
        cy.get('input#username').should('have.focus');
      });

      it('is required', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#username').should('have.attr', 'required');
      });
    });

    describe('password input', () => {
      it('exists', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#password').should('exist').and('be.visible');
      });

      it('focuses', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#password').should('be.enabled');
        cy.get('input#password').click();
        cy.get('input#password').should('have.focus');
      });

      it('is required', () => {
        cy.viewport('macbook-16');
        cy.visit('http://localhost:3001/register');
        cy.get('input#password').should('have.attr', 'required');
      });
    });
  });

  describe('Use-cases', () => {
    beforeEach(() => {
      cy.task('clear:db');
    });

    it('registers new user successfully', () => {
      // Register
      let username = 'user_' + Date.now().toString();
      let password = Date.now().toString();
      cy.visit('http://localhost:3001/register');
      cy.get('input#username').type(username);
      cy.get('input#password').type(password);
      cy.get('.btn').click();

      // Redirect to login page
      cy.location('pathname').should('eq', '/login');

      // Show alert
      cy.contains('You registered successfully 😍!');
      cy.get('.btn-close').should('exist');
      cy.get('.btn-close').click();
      cy.get('.btn-close').should('not.exist');
    });

    it('does not register the same username twice', () => {
      let username = 'user_' + Date.now().toString();
      let password = Date.now().toString();

      // Register user for the first time
      cy.visit('http://localhost:3001/register');
      cy.get('input#username').type(username);
      cy.get('input#password').type(password);
      cy.get('.btn').click();

      // Register the same user again
      cy.visit('http://localhost:3001/register');
      cy.get('input#username').type(username);
      cy.get('input#password').type(password);
      cy.get('.btn').click();

      cy.location('pathname').should('eq', '/register');
      cy.contains(`User with username of ${username} already exist ☹️!`);
    });
  });
});
