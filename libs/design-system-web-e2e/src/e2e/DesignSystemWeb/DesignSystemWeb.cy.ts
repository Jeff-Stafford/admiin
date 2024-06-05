describe('design-system-web: DesignSystemWeb component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=designsystemweb--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to DesignSystemWeb!');
  });
});
