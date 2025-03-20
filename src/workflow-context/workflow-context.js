import { createContext } from 'react'

const WorkflowContext = createContext({
    approvalStatus: '',
    allowedActions: {},
    refresh: () => {
        throw new Error('WorkflowContext.refresh has not been initialized')
    },
})

export { WorkflowContext }
