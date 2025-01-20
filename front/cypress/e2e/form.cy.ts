describe('Client Registration Form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should successfully submit the form with valid data', () => {
    cy.intercept('POST', '/clients', {
      statusCode: 201,
      body: { message: 'Cadastro Realizado com sucesso!' },
    }).as('postClient');

    cy.get('#name').type('John Doe', { force: true });
    cy.get('#email').type('john.doe.teste@example.com', { force: true });
    cy.get('#cpf').type('12345678900', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.get('.success').should('contain', 'Cadastro realizado com sucesso!');

    cy.get('#name').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#cpf').should('have.value', '');
    cy.get('#color').should('have.value', '');
    cy.get('#annotations').should('have.value', '');
  });

   it('should show validation error for invalid email', () => {
    cy.get('#name').type('John Doe', { force: true });
    cy.get('#email').type('invalid-email', { force: true });
    cy.get('#cpf').type('12345678901', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'Email inválido');
  });

  it('should show validation error for invalid CPF', () => {
    cy.get('#name').type('John Doe', { force: true });
    cy.get('#email').type('john.doe@example.com', { force: true });
    cy.get('#cpf').type('123', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'CPF deve ter 11 dígitos');
  });

  it('should show validation error for empty name', () => {
    cy.get('#email').type('john.doe@example.com', { force: true });
    cy.get('#cpf').type('12345678901', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'Nome completo obrigatório');
  });

  it('should show validation error for empty email', () => {
    cy.get('#name').type('John Doe', { force: true });
    cy.get('#cpf').type('12345678901', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'Email obrigatório');
  });

  it('should show validation error for empty CPF', () => {
    cy.get('#name').type('John Doe', { force: true });
    cy.get('#email').type('john.doe@example.com', { force: true });
    cy.get('#color').select('Azul', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'CPF obrigatório');
  });

  it('should show validation error for empty color', () => {
     cy.get('#name').type('John Doe', { force: true });
    cy.get('#email').type('john.doe@example.com', { force: true });
    cy.get('#cpf').type('12345678901', { force: true });
    cy.get('#annotations').type('No additional notes.', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.error').should('contain', 'Cor obrigatória');
  });
});
