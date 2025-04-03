import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree, Divider } from '@dhis2/ui'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/index.js'
import { ApprovalStatusIconsLegend } from './approval-status-icons-legend.js'
import { ApprovalStatusLabel } from './approval-status-label.js'
import classes from './org-unit-select.module.css'
import { useOrgUnitSearch } from './use-org-unit-search.js'
import { isNullOrEmpty } from '../../utils/string-utils.js'

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
    const { searchText, orgUnits, loading, setSearchText } = useOrgUnitSearch();
    
    const open = openedSelect === ORG_UNIT
    const value = orgUnit?.displayName
    const requiredValuesMessage = workflow?.id
        ? i18n.t('Choose a period first')
        : i18n.t('Choose a workflow and period first')
    const onChange = ({ displayName, id, path }) => {
        selectOrgUnit({ displayName, id, path })
    }
    const selectedOrgUnitPath = orgUnit?.path ? [orgUnit.path] : undefined
    const initiallySelected =
        selectedOrgUnitPath || organisationUnits.map(({ path }) => path)

    const renderOrgUnitTree = () => {
        if(isNullOrEmpty(searchText)) {
            return (
                <OrganisationUnitTree
                    key="initial"
                    roots={organisationUnits.map(({ id }) => id)}
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
            )
        }
        
        return <OrganisationUnitTree
            roots={orgUnits.map(({ id }) => id)}
            onChange={onChange}
            key={`${searchText}-${new Date().getTime()}`}
            selected={selectedOrgUnitPath}
            singleSelection
            renderNodeLabel={({ label, node }) => (
                <ApprovalStatusLabel
                    label={label}
                    orgUnitId={node.id}
                />
            )}
        />
    }
    
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
                <div className={classes.inputContainer}>
                    <input
                        type="text"
                        placeholder={i18n.t('Search by name')}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className={classes.searchInput}
                    />
                </div>
                
                <div className={classes.scrollbox}>
                    {renderOrgUnitTree()}
                </div>
                <Divider margin="0" />
                <ApprovalStatusIconsLegend />
            </div>
        </ContextSelect>
    )
}

export { OrgUnitSelect }
