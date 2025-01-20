/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Ignore uncaught exceptions
Cypress.on('uncaught:exception', () => 
  // returning false here prevents Cypress from
  // failing the test
   false
);
