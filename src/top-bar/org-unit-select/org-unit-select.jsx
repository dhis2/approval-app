import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree, Divider } from '@dhis2/ui'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/index.js'
import { ApprovalStatusIconsLegend } from './approval-status-icons-legend.jsx'
import { ApprovalStatusLabel } from './approval-status-label.jsx'
import classes from './org-unit-select.module.css'

export const ORG_UNIT = 'ORG_UNIT'

const OrgUnitSelect = () => {
    const { organisationUnits } = useAppContext()
    const {
        orgUnit,
        selectOrgUnit,
        workflow,
        period,
        openedSelect,
        setOpenedSelect,
    } = useSelectionContext()
    const open = openedSelect === ORG_UNIT
    const value = orgUnit?.displayName
    const requiredValuesMessage = workflow?.id
        ? i18n.t('Choose a period first')
        : i18n.t('Choose a workflow and period first')
    const roots = organisationUnits.map(({ id }) => id)
    const onChange = ({ displayName, id, path }) => {
        selectOrgUnit({ displayName, id, path })
    }
    const selectedOrgUnitPath = orgUnit?.path ? [orgUnit.path] : undefined
    const initiallySelected =
        selectedOrgUnitPath || organisationUnits.map(({ path }) => path)

    return (
        <ContextSelect
            dataTest="org-unit-context-select"
            prefix={i18n.t('Organisation Unit')}
            placeholder={i18n.t('Choose an organisation unit')}
            value={value}
            open={open}
            disabled={!(workflow?.id && period?.id)}
            onOpen={() => setOpenedSelect(ORG_UNIT)}
            onClose={() => setOpenedSelect('')}
            requiredValuesMessage={requiredValuesMessage}
            popoverMaxWidth={400}
        >
            <div className={classes.popoverContainer}>
                <div className={classes.scrollbox}>
                    <OrganisationUnitTree
                        roots={roots}
                        onChange={onChange}
                        initiallyExpanded={initiallySelected}
                        selected={selectedOrgUnitPath}
                        singleSelection
                        renderNodeLabel={({ label, node }) => (
                            <ApprovalStatusLabel
                                label={label}
                                orgUnitId={node.id}
                            />
                        )}
                    />
                </div>
                <Divider margin="0" />
                <ApprovalStatusIconsLegend />
            </div>
        </ContextSelect>
    )
}

export { OrgUnitSelect }
