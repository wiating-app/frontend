/// <reference types="cypress" />

Cypress.Commands.add('simulateReturningUser', () => {
  window.localStorage.setItem('acceptDataPrivacy', 'true')
  window.localStorage.setItem('seenInitialInfo', 'true')
  window.localStorage.setItem('lastPosition', `{"bounds":[[54.444849123816056,18.615502528846267],[54.418888026037905,18.464440517127514]],"zoom":14}`)
})


describe('wiating app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('displays the info and cookies popups and closes them', () => {
    cy.get('#cy-info .MuiButton-label').should('have.text', 'Przejdź do mapy').click()
    cy.get('#cy-info').should('not.exist')

    cy.get('#cy-privacy .MuiButton-label').should('have.text', 'Zgadzam się').click()
    cy.get('#cy-privacy').should('not.exist')
  })

  it('displays the map and navbar layout', () => {
    cy.simulateReturningUser()
    cy.get('#cy-navbar').should('be.visible')
    cy.get('#cy-map').should('be.visible')
  })

  it('open location details by clicking pin on map', () => {
    cy.simulateReturningUser()
    cy.intercept('POST', '**/get_points').as('getPoints')
    cy.wait('@getPoints').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      cy.get('#cy-map', { timeout: 10000 }).click({ center: true })
      cy.get('#cy-locationinfo').contains('Opis')
    })
  })
})
