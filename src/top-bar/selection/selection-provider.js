import { PropTypes } from '@dhis2/prop-types'
import React, { useEffect, useReducer } from 'react'
import { useQueryParams, StringParam } from 'use-query-params'
import { useCurrentUser } from '../../current-user/index.js'
import { SelectionContext } from './selection-context.js'

// TODO: should take a periodCode and return a period object
const parsePeriodCode = code => ({
    code: code,
    name: code,
})

const ACTIONS = {
    SET_OPENED_SELECT: 'SET_OPENED_SELECT',
    CLEAR_ALL: 'CLEAR_ALL',
    SELECT_WORKFLOW: 'SELECT_WORKFLOW',
    SELECT_PERIOD: 'SELECT_PERIOD',
    SELECT_ORG_UNIT: 'SELECT_ORG_UNIT',
}

const reducer = (state, { type, payload }) => {
    switch (type) {
        case ACTIONS.SET_OPENED_SELECT:
            return {
                ...state,
                openedSelect: payload,
            }
        case ACTIONS.CLEAR_ALL:
            return {
                openedSelect: '',
                workflow: {},
                period: {},
                orgUnit: {},
            }
        case ACTIONS.SELECT_WORKFLOW:
            return {
                openedSelect: '',
                workflow: payload,
                period: {},
                orgUnit: {},
            }
        case ACTIONS.SELECT_PERIOD:
            return {
                ...state,
                openedSelect: '',
                period: payload,
                orgUnit: {},
            }
        case ACTIONS.SELECT_ORG_UNIT:
            return {
                ...state,
                openedSelect: '',
                orgUnit: payload,
            }
        default:
            return state
    }
}

const SelectionProvider = ({ children }) => {
    const [query, setQuery] = useQueryParams({
        wf: StringParam,
        pe: StringParam,
        ou: StringParam,
    })

    const { dataApprovalWorkflows } = useCurrentUser()

    const [{ openedSelect, workflow, period, orgUnit }, dispatch] = useReducer(
        reducer,
        {
            openedSelect: '',
            workflow:
                dataApprovalWorkflows.find(({ id }) => id === query.wf) || {},
            period: query.pe ? parsePeriodCode(query.pe) : {},
            orgUnit: query.ou ? { id: query.ou } : {},
        }
    )

    useEffect(() => {
        setQuery({
            wf: workflow.id,
            pe: period.code,
            ou: orgUnit.id,
        })
    }, [workflow, period, orgUnit])

    const providerValue = {
        workflow,
        period,
        orgUnit,
        openedSelect,
        setOpenedSelect: fieldName =>
            dispatch({ type: ACTIONS.SET_OPENED_SELECT, payload: fieldName }),
        clearAll: () => dispatch({ type: ACTIONS.CLEAR_ALL }),
        selectWorkflow: workflow =>
            dispatch({ type: ACTIONS.SELECT_WORKFLOW, payload: workflow }),
        selectPeriod: period =>
            dispatch({ type: ACTIONS.SELECT_PERIOD, payload: period }),
        selectOrgUnit: orgUnit =>
            dispatch({ type: ACTIONS.SELECT_ORG_UNIT, payload: orgUnit }),
    }

    return (
        <SelectionContext.Provider value={providerValue}>
            {children}
        </SelectionContext.Provider>
    )
}

SelectionProvider.propTypes = {
    children: PropTypes.node,
}

export { SelectionProvider }