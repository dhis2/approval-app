import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {
    getApprovalStatusDisplayData,
    isApproved,
    APPROVAL_STATUSES,
} from './get-approval-status.js'
import { useServerDateTimeAsLocal } from './use-server-date-time-as-local.js'

const ApprovalStatusTag = ({ approvalStatus, approvedAt, approvedBy }) => {
    const approvalDateTime = useServerDateTimeAsLocal(approvedAt)
    const {
        icon: Icon,
        displayName,
        type,
    } = getApprovalStatusDisplayData({
        approvalStatus,
        approvalDateTime,
        approvedBy,
    })
    const props = {
        [type]: true,
        icon: <Icon />,
    }
    const shouldRenderTooltip = isApproved(approvalStatus) && approvedAt
    const tag = (
        <Tag {...props} maxWidth="auto">
            {displayName}
        </Tag>
    )

    if (!shouldRenderTooltip) {
        return tag
    }

    const dateTimeStr = moment(approvalDateTime).format('LLL')
    const tooltipContent = i18n.t('Approved {{- dateTimeStr}}', { dateTimeStr })

    return <Tooltip content={tooltipContent}>{tag}</Tooltip>
}

ApprovalStatusTag.propTypes = {
    approvalStatus: PropTypes.oneOf(Object.values(APPROVAL_STATUSES)),
    approvedAt: PropTypes.string,
    approvedBy: PropTypes.string,
}

export { ApprovalStatusTag }
