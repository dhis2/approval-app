import { PropTypes } from '@dhis2/prop-types'
import React, { useEffect, useReducer } from 'react'
import { useQueryParams, StringParam } from 'use-query-params'
import { useCurrentUser } from '../../current-user/index.js'
import { SelectionContext } from './selection-context.js'

// TODO: should take a periodId and return a period object
const parsePeriodId = id => ({
    id: id,
    displayName: id,
})

const initialWorkflowValue = (workflows, id) => {
    if (id) {
        /*
         * Auto select workflow with query param id
         * default to empty object if `find` returns undefined in case the
         * workflow with the id from the url is not available to the user
         */
        return workflows.find(workflow => workflow.id === id) || {}
    }
    if (workflows.length === 1) {
        // auto-select if user only has one workflow
        return workflows[0]
    }
    return {}
}

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
                openedSelect: payload.openedSelect,
            }
        case ACTIONS.CLEAR_ALL:
            return {
                openedSelect: '',
                workflow: payload.workflow,
                period: {},
                orgUnit: {},
            }
        case ACTIONS.SELECT_WORKFLOW:
            return {
                openedSelect: '',
                workflow: payload.workflow,
                period: {},
                orgUnit: {},
            }
        case ACTIONS.SELECT_PERIOD:
            return {
                ...state,
                openedSelect: '',
                period: payload.period,
                orgUnit: {},
            }
        case ACTIONS.SELECT_ORG_UNIT:
            return {
                ...state,
                openedSelect: '',
                orgUnit: payload.orgUnit,
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
            workflow: initialWorkflowValue(dataApprovalWorkflows, query.wf),
            // TODO: the initial value for period should take into account the inital
            // workflow value, it should be cleared if no valid workflow is found
            period: query.pe ? parsePeriodId(query.pe) : {},
            // TODO: same as period, but orgUnit should also be cleared if period is
            // unset/invalid
            orgUnit: query.ou ? { id: query.ou } : {},
        }
    )
    const providerValue = {
        workflow,
        period,
        orgUnit,
        openedSelect,
        clearAll: () =>
            dispatch({
                type: ACTIONS.CLEAR_ALL,
                payload: {
                    workflow: initialWorkflowValue(dataApprovalWorkflows),
                },
            }),
        setOpenedSelect: fieldName =>
            dispatch({
                type: ACTIONS.SET_OPENED_SELECT,
                payload: {
                    openedSelect: fieldName,
                },
            }),
        selectWorkflow: workflow =>
            dispatch({ type: ACTIONS.SELECT_WORKFLOW, payload: { workflow } }),
        selectPeriod: period =>
            dispatch({ type: ACTIONS.SELECT_PERIOD, payload: { period } }),
        selectOrgUnit: orgUnit =>
            dispatch({ type: ACTIONS.SELECT_ORG_UNIT, payload: { orgUnit } }),
    }

    useEffect(() => {
        setQuery({
            wf: workflow.id,
            pe: period.id,
            ou: orgUnit.id,
        })
    }, [workflow, period, orgUnit])

    return (
        <SelectionContext.Provider value={providerValue}>
            {children}
        </SelectionContext.Provider>
    )
}

SelectionProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { SelectionProvider }
