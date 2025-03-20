import { createContext } from 'react'

const defaultFn = () => {
    throw new Error('Selection Context has not been initialized')
}

const SelectionContext = createContext({
    workflow: {},
    period: {},
    orgUnit: {},
    attributeCombo: {},
    attributeOptionCombo: {},
    selectWorkflow: defaultFn,
    selectPeriod: defaultFn,
    selectOrgUnit: defaultFn,
    selectAttributeCombo: defaultFn,
    selectAttributeOptionCombo: defaultFn,
    clearAll: defaultFn,
    setOpenedSelect: defaultFn,
})

export { SelectionContext }
