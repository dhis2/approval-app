import i18n from '@dhis2/d2-i18n'
import { Menu } from '@dhis2/ui'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/index.js'
import { WorkflowSelectOption } from './workflow-select-option.jsx'
import classes from './workflow-select.module.css'

const WORKFLOW = 'WORKFLOW'

const WorkflowSelect = () => {
    const { dataApprovalWorkflows } = useAppContext()
    const {
        workflow: selectedWorkflow,
        selectWorkflow,
        openedSelect,
        setOpenedSelect,
    } = useSelectionContext()
    const open = openedSelect === WORKFLOW
    const value = selectedWorkflow?.displayName

    return (
        <ContextSelect
            dataTest="workflow-context-select"
            prefix={i18n.t('Workflow')}
            placeholder={i18n.t('Choose a workflow')}
            value={value}
            open={open}
            onOpen={() => setOpenedSelect(WORKFLOW)}
            onClose={() => setOpenedSelect('')}
        >
            {dataApprovalWorkflows.length === 0 ? (
                <div className={classes.message}>
                    {i18n.t(
                        'No workflows found. None may exist, or you may not have access to any.'
                    )}
                </div>
            ) : (
                <Menu className={classes.menu}>
                    {dataApprovalWorkflows.map((workflow) => (
                        <WorkflowSelectOption
                            key={workflow.id}
                            id={workflow.id}
                            name={workflow.displayName}
                            periodType={workflow.periodType}
                            active={workflow.id === selectedWorkflow?.id}
                            onClick={() => selectWorkflow(workflow)}
                        />
                    ))}
                </Menu>
            )}
        </ContextSelect>
    )
}

export { WorkflowSelect, WORKFLOW }
