import { useDataMutation } from '@dhis2/app-runtime'

export const APPROVE_DATA_MUTATION = {
    resource: 'dataApprovals/approvals',
    type: 'create',
    data: ({ wf, pe, approvals }) => ({ wf, pe, approvals }),
}

export const useApproveData = ({ onComplete, onError }) =>
    useDataMutation(APPROVE_DATA_MUTATION, { onComplete, onError })
