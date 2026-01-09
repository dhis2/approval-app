import {
    enableAutoLogin,
    enableNetworkShim,
    isStubMode,
} from '@dhis2/cypress-commands'

if (!isStubMode()) {
    enableAutoLogin()
}
enableNetworkShim()

Cypress.Commands.add('openOrgUnitNodeByName', (orgUnitName) => {
    cy.get('[data-test="org-unit-context-select-popover"]')
        .contains(orgUnitName)
        .closest('.node')
        .find('[data-test="dhis2-uiwidgets-orgunittree-node-toggle"]')
        .click()
})
