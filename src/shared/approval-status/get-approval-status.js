import i18n from '@dhis2/d2-i18n'
import { IconBlock16, IconError16 } from '@dhis2/ui'
import moment from 'moment'
import { Approved, Ready, Waiting } from './icons.js'

const APPROVAL_STATUSES = {
    UNAPPROVED_READY: 'UNAPPROVED_READY',
    ACCEPTED_HERE: 'ACCEPTED_HERE',
    UNAPPROVED_WAITING: 'UNAPPROVED_WAITING',
    UNAPPROVED_ABOVE: 'UNAPPROVED_ABOVE',
    APPROVED_HERE: 'APPROVED_HERE',
    APPROVED_ABOVE: 'APPROVED_ABOVE',
    UNAPPROVABLE: 'UNAPPROVABLE',
    UNAUTHORIZED: 'UNAUTHORIZED',
    LOADING: 'LOADING',
    ERROR: 'ERROR',
}

const getApprovalStatusIcon = (approvalStatus) => {
    switch (approvalStatus) {
        case APPROVAL_STATUSES.UNAPPROVED_READY:
            return {
                icon: Ready,
                type: 'neutral',
            }
        case APPROVAL_STATUSES.UNAPPROVED_WAITING:
        case APPROVAL_STATUSES.UNAPPROVED_ABOVE:
            return {
                icon: Waiting,
                type: 'default',
            }
        case APPROVAL_STATUSES.ACCEPTED_HERE:
        case APPROVAL_STATUSES.APPROVED_HERE:
        case APPROVAL_STATUSES.APPROVED_ABOVE:
            return {
                icon: Approved,
                type: 'positive',
            }
        case APPROVAL_STATUSES.UNAPPROVABLE:
        case APPROVAL_STATUSES.UNAUTHORIZED:
            return {
                icon: IconBlock16,
                type: 'negative',
            }
        case APPROVAL_STATUSES.ERROR:
            return {
                icon: IconError16,
                type: 'negative',
            }
        default:
            throw new Error(`Unknown approval status: '${approvalStatus}'`)
    }
}

const getApprovalStatusText = ({
    approvalStatus,
    approvalDateTime,
    approvedBy,
}) => {
    switch (approvalStatus) {
        case APPROVAL_STATUSES.UNAPPROVED_READY:
            return i18n.t('Ready for approval')
        case APPROVAL_STATUSES.UNAPPROVED_WAITING:
            return i18n.t('Waiting for lower level approval')
        case APPROVAL_STATUSES.UNAPPROVED_ABOVE:
            return i18n.t('Waiting for higher level approval')
        case APPROVAL_STATUSES.ACCEPTED_HERE:
            return i18n.t('Approval by {{- name}} accepted {{timeAgo}}', {
                name: approvedBy,
                timeAgo: moment(approvalDateTime).fromNow(),
            })
        case APPROVAL_STATUSES.APPROVED_HERE:
            return i18n.t('Approved by {{- name}} {{timeAgo}}', {
                name: approvedBy,
                timeAgo: moment(approvalDateTime).fromNow(),
            })
        case APPROVAL_STATUSES.APPROVED_ABOVE:
            return i18n.t('Approved at higher level')
        case APPROVAL_STATUSES.UNAUTHORIZED:
            return i18n.t('You do not have authority to approve data')
        case APPROVAL_STATUSES.UNAPPROVABLE:
            return i18n.t('Cannot be approved')
        case APPROVAL_STATUSES.ERROR:
            return i18n.t('Could not retrieve approval status')
        default:
            throw new Error(`Unknown approval status: '${approvalStatus}'`)
    }
}

const isApproved = (approvalStatus) =>
    approvalStatus === APPROVAL_STATUSES.APPROVED_HERE ||
    approvalStatus === APPROVAL_STATUSES.APPROVED_ABOVE

const getApprovalStatusDisplayData = ({
    approvalStatus,
    approvalDateTime,
    approvedBy,
}) => {
    const displayName = getApprovalStatusText({
        approvalStatus,
        approvalDateTime,
        approvedBy,
    })
    const { icon, type } = getApprovalStatusIcon(approvalStatus)

    return { displayName, icon, type }
}

export { APPROVAL_STATUSES, getApprovalStatusDisplayData, isApproved }
