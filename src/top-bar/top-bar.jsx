import React from 'react'
import { ClearAllButton } from './clear-all-button/index.js'
import { ApprovalStatusesProvider } from './org-unit-select/approval-statuses.jsx'
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
        <ClearAllButton />
    </>
)

export { TopBar }
