import { useDataMutation } from '@dhis2/app-runtime'

export const UNACCEPT_DATA_MUTATION = {
    resource: 'dataAcceptances/unacceptances',
    type: 'create',
    data: ({ wf, pe, approvals }) => ({ wf, pe, approvals }),
}

export const useUnacceptData = ({ onComplete, onError }) =>
    useDataMutation(UNACCEPT_DATA_MUTATION, { onComplete, onError })
