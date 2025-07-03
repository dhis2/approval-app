import { useDataMutation } from '@dhis2/app-runtime'

export const UNAPPROVE_DATA_MUTATION = {
    resource: 'dataApprovals/unapprovals',
    type: 'create',
    data: ({ wf, pe, approvals }) => ({ wf, pe, approvals }),
}

export const useUnapproveData = ({ onComplete, onError }) =>
    useDataMutation(UNAPPROVE_DATA_MUTATION, { onComplete, onError })
