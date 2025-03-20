import React from 'react'
import { AttributeComboSelect } from './attribute-combo-select/attribute-combo-select.js'
import { ClearAllButton } from './clear-all-button/index.js'
import { ApprovalStatusesProvider } from './org-unit-select/approval-statuses.js'
import { OrgUnitSelect } from './org-unit-select/index.js'
import { PeriodSelect } from './period-select/index.js'
import { WorkflowSelect } from './workflow-select/index.js'

const TopBar = () => (
    <>
        <WorkflowSelect />
        <PeriodSelect />
        <ApprovalStatusesProvider>
            <OrgUnitSelect />
        </ApprovalStatusesProvider>
        <AttributeComboSelect />
        <ClearAllButton />
    </>
)

export { TopBar }
