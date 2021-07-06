import { Tag } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useApprovalState } from './use-approval-state.js'

const StatusTag = ({ approvalState }) => {
    const { icon: Icon, displayName, type } = useApprovalState(approvalState)
    const props = {
        [type]: true,
        icon: <Icon />,
    }

    return <Tag {...props}>{displayName}</Tag>
}

StatusTag.propTypes = {
    approvalState: PropTypes.oneOf([
        'APPROVED_HERE',
        'APPROVED_ELSEWHERE',
        'ACCEPTED_HERE',
        'ACCEPTED_ELSEWHERE',
        'UNAPPROVED_READY',
        'UNAPPROVED_WAITING',
        'UNAPPROVED_ELSEWHERE',
        'UNAPPROVABLE',
    ]),
}

export { StatusTag }