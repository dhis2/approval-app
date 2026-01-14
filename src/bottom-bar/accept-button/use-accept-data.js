import { useDataMutation } from '@dhis2/app-runtime'

export const ACCEPT_DATA_MUTATION = {
    resource: 'dataAcceptances/acceptances',
    type: 'create',
    data: ({ wf, pe, approvals }) => ({ wf, pe, approvals }),
}

export const useAcceptData = ({ onComplete, onError }) =>
    useDataMutation(ACCEPT_DATA_MUTATION, { onComplete, onError })
