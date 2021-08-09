import i18n from '@dhis2/d2-i18n'
import { Approved, Ready, Waiting } from './icons.js'

/*
 * TODO: The current classification logic was discussed with
 * Joe Cooper, but needs to be confirmed by either Lars or Jim.
 * Specifically these cases are not clear:
 * A. Do ACCEPTED_HERE and ACCEPTED_ELSEWHERE fall into "Ready for
 *    approval and accepted"? This doesn't seem to match the webapi docs.
 * B. Should we show a red tag for UNAPPROVABLE and show a negative tag?
 *    This was not included in the design specs.
 */
const getTagDisplayData = approvalState => {
    switch (approvalState) {
        case 'APPROVED_HERE':
        case 'APPROVED_ABOVE':
            return {
                icon: Approved,
                displayName: i18n.t('Approved'),
                type: 'positive',
            }

        case 'ACCEPTED_HERE':
            return {
                icon: Ready,
                displayName: i18n.t('Ready for approval and accepted'),
                type: 'neutral',
            }

        case 'UNAPPROVED_READY':
            return {
                icon: Ready,
                displayName: i18n.t('Ready for approval'),
                type: 'neutral',
            }

        case 'UNAPPROVED_WAITING':
        case 'UNAPPROVED_ABOVE':
            return {
                icon: Waiting,
                displayName: i18n.t('Waiting'),
                type: 'default',
            }

        case 'UNAPPROVABLE':
            return {
                icon: Waiting,
                displayName: i18n.t('Cannot approve'),
                type: 'negative',
            }

        default:
            throw new Error(`Unknown approval state: '${approvalState}'`)
    }
}

export { getTagDisplayData }
