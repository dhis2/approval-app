import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ContextSelect } from '../context-select/index.js'
import { useSelectionContext } from '../selection/index.js'

const ORG_UNIT = 'ORG_UNIT'

const OrgUnitSelect = () => {
    const {
        orgUnit /*, setOrgUnit */,
        workflow,
        period,
        openedSelect,
        setOpenedSelect,
    } = useSelectionContext()
    const open = openedSelect === ORG_UNIT
    const value = orgUnit.displayName || i18n.t('Choose an organisation unit')
    const requiredValuesMessage = workflow.id
        ? i18n.t('Choose a period first')
        : i18n.t('Choose a workflow and period first')

    return (
        <ContextSelect
            prefix={i18n.t('Organisation Unit')}
            value={value}
            open={open}
            disabled={!(workflow.id && period.id)}
            onOpen={() => setOpenedSelect(ORG_UNIT)}
            onClose={() => setOpenedSelect('')}
            requiredValuesMessage={requiredValuesMessage}
        >
            <pre>Org Unit picker placeholder</pre>
        </ContextSelect>
    )
}

export { OrgUnitSelect }
