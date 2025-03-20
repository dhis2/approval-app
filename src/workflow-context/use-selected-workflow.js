import { useAppContext } from '../app-context/index.js'

const useSelectedWorkflow = (params) => {
    const { dataApprovalWorkflows } = useAppContext()

    if (!(params && params.wf && dataApprovalWorkflows)) {
        return {}
    }

    return dataApprovalWorkflows.find(({ id }) => id === params.wf) || {}
}

export { useSelectedWorkflow }
