import { IconBlock16, IconError16 } from '@dhis2/ui'
import moment from 'moment'
import {
    getApprovalStatusDisplayData,
    APPROVAL_STATUSES,
} from './get-approval-status.js'
import { Approved, Ready, Waiting } from './icons.jsx'

jest.mock('moment', () => {
    const now = new Date()
    now.setFullYear(now.getFullYear() - 2)
    return () => jest.requireActual('moment')(now)
})

describe('getApprovalStatusDisplayData', () => {
    it('returns the correct display data for approval status "UNAPPROVED_READY"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.UNAPPROVED_READY,
            })
        ).toEqual({
            displayName: 'Ready for approval',
            icon: Ready,
            type: 'neutral',
        })
    })
    it('returns the correct display data for approval status "ACCEPTED_HERE"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.ACCEPTED_HERE,
                approvedBy: 'Hendrik',
            })
        ).toEqual({
            displayName: 'Approval by Hendrik accepted 2 years ago',
            icon: Approved,
            type: 'positive',
        })
    })
    it('returns the correct display data for approval status "UNAPPROVED_WAITING"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.UNAPPROVED_WAITING,
            })
        ).toEqual({
            displayName: 'Waiting for lower level approval',
            icon: Waiting,
            type: 'default',
        })
    })
    it('returns the correct display data for approval status "UNAPPROVED_ABOVE"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.UNAPPROVED_ABOVE,
            })
        ).toEqual({
            displayName: 'Waiting for higher level approval',
            icon: Waiting,
            type: 'default',
        })
    })
    it('returns the correct diplay data for "APPROVED_HERE"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.APPROVED_HERE,
                approvedBy: 'Hendrik',
                // The actual value for this field is irrelevant due to the moment mock
                approvalDateTime: 'Not empty',
            })
        ).toEqual({
            displayName: 'Approved by Hendrik 2 years ago',
            icon: Approved,
            type: 'positive',
        })
    })
    it('returns the correct diplay data for "APPROVED_ABOVE"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.APPROVED_ABOVE,
            })
        ).toEqual({
            displayName: 'Approved at higher level',
            icon: Approved,
            type: 'positive',
        })
    })
    it('returns the correct display data for approval status "UNAUTHORIZED"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.UNAUTHORIZED,
            })
        ).toEqual({
            displayName: 'You do not have authority to approve data',
            icon: IconBlock16,
            type: 'negative',
        })
    })
    it('returns the correct display data for approval status "UNAPPROVABLE"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.UNAPPROVABLE,
            })
        ).toEqual({
            displayName: 'Cannot be approved',
            icon: IconBlock16,
            type: 'negative',
        })
    })
    it('returns the correct display data for approval status "ERROR"', () => {
        expect(
            getApprovalStatusDisplayData({
                approvalStatus: APPROVAL_STATUSES.ERROR,
            })
        ).toEqual({
            displayName: 'Could not retrieve approval status',
            icon: IconError16,
            type: 'negative',
        })
    })
    it('throws an error when encountering an unknown approval status', () => {
        expect(() =>
            getApprovalStatusDisplayData({ approvalStatus: 'bad input' })
        ).toThrow("Unknown approval status: 'bad input'")
    })
})
