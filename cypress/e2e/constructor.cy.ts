beforeEach(function() {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json'});
  cy.viewport(1300, 800);
  cy.visit('http://localhost:4000/');
});

describe('Добавление ингридиентов в бургер', function() {
  it('Добавление булки', function() {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]').contains('Булка1').should('exist');
    cy.get('[data-cy=constructor-bun-2]').contains('Булка1').should('exist');
  });
});

describe('Модальное окно ингридиентов', function() {
  it('Открытие окна ингридиентов', function() {
    cy.contains('Детали ингридиента').should('not.exist');
    cy.contains('Булка1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Булка1').should('exist');
  });

  it('Закрытие окна ингридиентов по кнопке', function() {
    cy.contains('Булка1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals button[type="button"]').click();
    cy.contains('Детали ингридиента').should('not.exist');
  });

  it('Закрытие окна ингридиентов по оверлею', function() {
    cy.contains('Булка1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Заказ', function() {
  beforeEach(function() {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as('post_order');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
  });

  afterEach(function() {
    cy.clearLocalStorage();
    cy.clearCookies();
  });



  it('Оформление заказа', function() {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-summ] button').click();

    cy.wait('@post_order').its('request.body').should('deep.equal', {
      ingredients: ['bun1', 'main1', 'sauce1', 'bun1']
    });

    cy.get('[data-cy=order-number]').contains('95450').should('exist');

    cy.get('#modals button[type="button"]').click();

    cy.get('[data-cy=order-number]').should('not.exist');
    cy.get('[data-cy=constructor]').contains('Булка1').should('not.exist');
    cy.get('[data-cy=constructor]').contains('Основа1').should('not.exist');
    cy.get('[data-cy=constructor]').contains('Соус1').should('not.exist');
  })
});