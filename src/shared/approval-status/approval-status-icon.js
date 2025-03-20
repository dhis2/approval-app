import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './approval-status-icon.module.css'
import {
    getApprovalStatusDisplayData,
    APPROVAL_STATUSES,
} from './get-approval-status.js'

const getIconColorForType = (type) => {
    switch (type) {
        case 'default':
            return colors.grey500
        case 'neutral':
            return colors.blue700
        case 'positive':
            return colors.green600
        case 'negative':
            return colors.red600
    }
}

const ApprovalStatusIcon = ({ approvalStatus, showTitle }) => {
    const {
        icon: Icon,
        displayName,
        type,
    } = getApprovalStatusDisplayData({ approvalStatus })

    return (
        <span
            title={showTitle ? displayName : ''}
            className={classes.container}
        >
            <Icon color={getIconColorForType(type)} />
        </span>
    )
}

ApprovalStatusIcon.defaultProps = {
    showTitle: true,
}

ApprovalStatusIcon.propTypes = {
    approvalStatus: PropTypes.oneOf(Object.values(APPROVAL_STATUSES)),
    showTitle: PropTypes.bool,
}

export { ApprovalStatusIcon }
