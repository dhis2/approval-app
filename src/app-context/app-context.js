import { createContext } from 'react'

const AppContext = createContext({
    authorities: [],
    organisationUnits: [],
    dataApprovalWorkflows: [],
    metadata: {},
})

export { AppContext }
