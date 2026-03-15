const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Говяжий метеорит (отбивная)';
const MODALS = '#modals';

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
      cy.contains(BUN_NAME).closest('li').find('button').click();
      cy.contains(`${BUN_NAME} (верх)`).should('exist');
      cy.contains(`${BUN_NAME} (низ)`).should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains(MAIN_NAME).closest('li').find('button').click();
      cy.contains(MAIN_NAME).should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.contains(BUN_NAME).click();
      cy.get(MODALS).should('not.be.empty');
      cy.get(MODALS).contains(BUN_NAME).should('exist');
    });

    it('должен отображать данные именно того ингредиента, по которому был клик', () => {
      cy.contains(MAIN_NAME).click();
      cy.get(MODALS).should('not.be.empty');
      cy.get(MODALS).contains(MAIN_NAME).should('exist');
      cy.get(MODALS).contains('2674').should('exist');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.contains(BUN_NAME).click();
      cy.get(MODALS).should('not.be.empty');
      cy.get(MODALS).find('button').click();
      cy.get(MODALS).children().should('have.length', 0);
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.contains(BUN_NAME).click();
      cy.get(MODALS).should('not.be.empty');
      cy.get(MODALS).children().last().click({ force: true });
      cy.get(MODALS).children().should('have.length', 0);
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
      cy.contains(BUN_NAME).closest('li').find('button').click();
      cy.contains(MAIN_NAME).closest('li').find('button').click();

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(MODALS).should('not.be.empty');
      cy.get(MODALS).contains('12345').should('exist');

      cy.get(MODALS).find('button').click();
      cy.get(MODALS).children().should('have.length', 0);

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
