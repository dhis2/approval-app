import '../common/index.js'
import { Then, When } from 'cypress-cucumber-preprocessor/steps'

Then('a tab bar is displayed with a single tab "Mortality < 5 years"', () => {
    cy.get('[data-test="dhis2-uicore-tabbar"]').should('have.length', 1)
    cy.get('[data-test="dhis2-uicore-tab"]').should('have.length', 1)
    cy.get('[data-test="dhis2-uicore-tab"]').should(
        'have.text',
        'Mortality < 5 years'
    )
})

Then('a single table with data is displayed', () => {
    cy.get('[data-test="dhis2-uicore-datatable"]').should('have.length', 1)
})

When('the user selects organisation unit "Sierra Leone"', () => {
    cy.get('[data-test="org-unit-context-select-button"]').click()
    cy.get('[data-test="org-unit-context-select-popover"]')
        .contains('Sierra Leone')
        .click()
})

When('the user selects organisation unit "Bo"', () => {
    cy.get('[data-test="org-unit-context-select-button"]').click()
    cy.get('[data-test="org-unit-context-select-popover"]')
        .contains('Bo')
        .click()
})

When('the user selects organisation unit "Baoma Station CHP"', () => {
    cy.get('[data-test="org-unit-context-select-button"]').click()
    cy.openOrgUnitNodeByName('Bo')
    cy.openOrgUnitNodeByName('Baoma')
    cy.get('[data-test="org-unit-context-select-popover"]')
        .contains('Baoma Station CHP')
        .click()
})
