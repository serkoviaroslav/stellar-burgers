describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Говяжий метеорит (отбивная)')
        .closest('li')
        .find('button')
        .click();
      cy.contains('Говяжий метеорит (отбивная)').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').contains('Краторная булка N-200i').should('exist');
    });

    it('должен отображать данные именно того ингредиента, по которому был клик', () => {
      cy.contains('Говяжий метеорит (отбивная)').click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').contains('Говяжий метеорит (отбивная)').should('exist');
      cy.get('#modals').contains('2674').should('exist');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').find('button').click();
      cy.get('#modals').children().should('have.length', 0);
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').children().last().click({ force: true });
      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('должен оформить заказ, показать номер и очистить конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.contains('Говяжий метеорит (отбивная)')
        .closest('li')
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').contains('12345').should('exist');

      cy.get('#modals').find('button').click();
      cy.get('#modals').children().should('have.length', 0);

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});