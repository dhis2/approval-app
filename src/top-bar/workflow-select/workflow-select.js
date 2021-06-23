import i18n from '@dhis2/d2-i18n'
import { Menu } from '@dhis2/ui'
import React from 'react'
import { useCurrentUser } from '../../current-user/index.js'
import { ContextSelect } from '../context-select/index.js'
import { useSelection } from '../selection/index.js'
import { WorkflowSelectOption } from './workflow-select-option.js'
import classes from './workflow-select.module.css'

const WORKFLOW = 'WORKFLOW'

const WorkflowSelect = () => {
    const { dataApprovalWorkflows } = useCurrentUser()
    const {
        workflow: selectedWorkflow,
        selectWorkflow,
        openedSelect,
        setOpenedSelect,
    } = useSelection()
    const open = openedSelect === WORKFLOW
    const value = selectedWorkflow.name || i18n.t('Choose a workflow')

    return (
        <ContextSelect
            label={i18n.t('Workflow')}
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
                <Menu>
                    {dataApprovalWorkflows.map(workflow => (
                        <WorkflowSelectOption
                            key={workflow.id}
                            name={workflow.name}
                            periodType={workflow.periodType}
                            active={workflow.id === selectedWorkflow.id}
                            onClick={() => selectWorkflow(workflow)}
                        />
                    ))}
                </Menu>
            )}
        </ContextSelect>
    )
}

export { WorkflowSelect }
