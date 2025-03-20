import '../common/index.js'
import {
    When,
    Then,
    defineParameterType,
} from 'cypress-cucumber-preprocessor/steps'

const buttonLabels = ['Approve', 'Accept', 'Unapprove', 'Unaccept']
defineParameterType({
    name: 'buttonLabel',
    regexp: new RegExp(buttonLabels.join('|')),
})

When('the user clicks the {buttonLabel} button', (buttonLabel) => {
    cy.get('[data-test="bottom-bar"]')
        .find('button')
        .contains(buttonLabel)
        .click()
})

Then('the following buttons are available', (dataTable) => {
    dataTable.hashes().forEach(({ label, visible, disabled }) => {
        if (visible) {
            cy.get('[data-test="bottom-bar"]')
                .find('button')
                .contains(label)
                .should('be.visible')
                .and(disabled ? 'be.disabled' : 'not.be.disabled')
        } else {
            cy.get('[data-test="bottom-bar"]')
                .find('button')
                .contains(label)
                .should('not.exist')
        }
    })
})

Then('a circular loader is rendered', () => {
    cy.get('[data-test="dhis2-uicore-circularloader"]').should('be.visible')
})

Then('a modal confirmation dialog is displayed', () => {
    cy.get('[data-test="dhis2-uicore-modal"]').should('be.visible')
})

When('the confirmation button is clicked', () => {
    cy.get('[data-test="dhis2-uicore-modal"]')
        .find('button')
        .contains('Approve')
        .click()
})

Then('an alert bar is displayed with the text Approval saved', () => {
    cy.get('[data-test="dhis2-uicore-alertbar"]')
        .contains('Approval saved')
        .should('be.visible')
})
