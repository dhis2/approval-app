import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ApprovalStatusIcon,
    APPROVAL_STATUSES,
} from '../../shared/approval-status/index.js'
import classes from './approval-status-icons-legend.module.css'

// Not all approval statuses are defined here as some share the same icons
const approvalStatuses = [
    {
        status: APPROVAL_STATUSES.UNAPPROVED_WAITING,
        displayName: i18n.t('Waiting for approval'),
    },
    {
        status: APPROVAL_STATUSES.UNAPPROVED_READY,
        displayName: i18n.t('Ready for approval'),
    },
    {
        status: APPROVAL_STATUSES.APPROVED_HERE,
        displayName: i18n.t('Approved'),
    },
    {
        status: APPROVAL_STATUSES.UNAPPROVABLE,
        displayName: i18n.t('Cannot be approved'),
    },
]

const ApprovalStatusIconsLegend = () => (
    <div className={classes.container}>
        {approvalStatuses.map(({ status, displayName }) => (
            <div key={status} className={classes.label}>
                <ApprovalStatusIcon approvalStatus={status} showTitle={false} />
                {displayName}
            </div>
        ))}
    </div>
)

export { ApprovalStatusIconsLegend }
