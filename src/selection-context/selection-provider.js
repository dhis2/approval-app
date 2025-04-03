import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useReducer } from 'react'
import { useAppContext } from '../app-context/index.js'
import { pushStateToHistory } from '../navigation/index.js'
import { findAttributeOptionComboInWorkflow } from '../utils/caterogy-combo-utils.js'
import { initialValues, initialWorkflowValue } from './initial-values.js'
import { SelectionContext } from './selection-context.js'

const ACTIONS = {
    SET_OPENED_SELECT: 'SET_OPENED_SELECT',
    CLEAR_ALL: 'CLEAR_ALL',
    SELECT_WORKFLOW: 'SELECT_WORKFLOW',
    SELECT_PERIOD: 'SELECT_PERIOD',
    SELECT_ORG_UNIT: 'SELECT_ORG_UNIT',
    SELECT_ATTRIBUTE_COMBO: 'SELECT_ATTRIBUTE_COMBO',
    SELECT_CAT_OPTION_COMBO: 'SELECT_CAT_OPTION_COMBO',
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    SET_STATE_FROM_QUERY_PARAMS: 'SET_STATE_FROM_QUERY_PARAMS',
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
                period: null,
                orgUnit: null,
                attributeOptionCombo: null,
                dataSet: null,
            }
        case ACTIONS.SELECT_WORKFLOW: {
            const attributeOptionComboData = findAttributeOptionComboInWorkflow(payload.metadata, payload.workflow, state.attributeOptionCombo?.id, state.orgUnit, state.period, payload.calendar)
            return {
                ...state,
                openedSelect: '',
                workflow: payload.workflow,
                period:
                    state.workflow &&
                    state.workflow?.periodType === payload.workflow?.periodType
                        ? state.period
                        : null,
                attributeCombo: state.attributeCombo ? attributeOptionComboData?.attributeCombo : null,
                attributeOptionCombo: state.attributeOptionCombo
                    ? attributeOptionComboData?.attributeOptionCombo
                    : null,
                dataSet: null,
            }
        }
        case ACTIONS.SELECT_PERIOD: {
            const attributeOptionComboData = findAttributeOptionComboInWorkflow(payload.metadata, state.workflow, state.attributeOptionCombo?.id, state.orgUnit, payload.period, payload.calendar)
            
            return {
                ...state,
                /*
                 * Close dropdown only if selecting a period,
                 * not when unsetting it when the year changes
                 */
                openedSelect: payload.period?.id ? '' : state.openedSelect,
                period: payload.period,
                attributeCombo: state.attributeCombo ? attributeOptionComboData?.attributeCombo : null,
                attributeOptionCombo: state.attributeOptionCombo
                    ? attributeOptionComboData?.attributeOptionCombo
                    : null,
                dataSet: null,
            }
        }
        case ACTIONS.SELECT_ORG_UNIT: {
            const attributeOptionComboData = findAttributeOptionComboInWorkflow(payload.metadata, state.workflow, state.attributeOptionCombo?.id, payload.orgUnit, state.period, payload.calendar)
            return {
                ...state,
                openedSelect: '',
                orgUnit: payload.orgUnit,
                attributeCombo: state.attributeCombo ? attributeOptionComboData?.attributeCombo : null,
                attributeOptionCombo: state.attributeOptionCombo
                    ? attributeOptionComboData?.attributeOptionCombo
                    : null,
                dataSet: null,
            }
        }
        case ACTIONS.SELECT_ATTRIBUTE_COMBO:
            return {
                ...state,
                attributeCombo: payload.attributeCombo,
                dataSet: null,
            }
        case ACTIONS.SELECT_CAT_OPTION_COMBO:
            return {
                ...state,
                attributeOptionCombo: payload.attributeOptionCombo,
                dataSet: null,
            }
        case ACTIONS.SELECT_DATA_SET:
            return {
                ...state,
                dataSet: payload.dataSet,
            }
        case ACTIONS.SET_STATE_FROM_QUERY_PARAMS:
            return {
                openedSelect: '',
                ...initialValues(payload.metadata, payload.dataApprovalWorkflows, payload.calendar),
            }
        default:
            return state
    }
}

const SelectionProvider = ({ children }) => {
    const { metadata, dataApprovalWorkflows } = useAppContext()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const [{ openedSelect, workflow, period, orgUnit, dataSet, attributeCombo, attributeOptionCombo}, dispatch] =
        useReducer(reducer, {
            openedSelect: '',
            ...initialValues(metadata, dataApprovalWorkflows, calendar),
        })

    const providerValue = {
        workflow,
        period,
        orgUnit,
        attributeCombo,
        attributeOptionCombo,
        openedSelect,
        dataSet,
        clearAll: () =>
            dispatch({
                type: ACTIONS.CLEAR_ALL,
                payload: {
                    workflow: initialWorkflowValue(dataApprovalWorkflows),
                },
            }),
        setOpenedSelect: (fieldName) =>
            dispatch({
                type: ACTIONS.SET_OPENED_SELECT,
                payload: {
                    openedSelect: fieldName,
                },
            }),
        selectWorkflow: (workflow) =>
            dispatch({ type: ACTIONS.SELECT_WORKFLOW, payload: { metadata, workflow, calendar } }),
        selectPeriod: (period) =>
            dispatch({ type: ACTIONS.SELECT_PERIOD, payload: { metadata, period, calendar } }),
        selectOrgUnit: (orgUnit) =>
            dispatch({ type: ACTIONS.SELECT_ORG_UNIT, payload: { metadata, orgUnit, calendar } }),
        selectAttributeCombo: (attributeCombo) =>
            dispatch({ type: ACTIONS.SELECT_ATTRIBUTE_COMBO, payload: { attributeCombo } }),
        selectAttributeOptionCombo: (attributeOptionCombo) =>
            dispatch({ type: ACTIONS.SELECT_CAT_OPTION_COMBO, payload: { attributeOptionCombo } }),
        selectDataSet: (dataSet) =>
            dispatch({ type: ACTIONS.SELECT_DATA_SET, payload: { dataSet } }),
    }

    useEffect(() => {
        pushStateToHistory({ workflow, period, orgUnit, attributeOptionCombo, dataSet })
    }, [workflow, period, orgUnit, attributeOptionCombo, dataSet])

    useEffect(() => {
        const setStateFromQueryParams = () => {
            dispatch({
                type: ACTIONS.SET_STATE_FROM_QUERY_PARAMS,
                payload: {
                    metadata,
                    dataApprovalWorkflows,
                },
            })
        }
        window.addEventListener('popstate', setStateFromQueryParams)

        return () => {
            window.removeEventListener('popstate', setStateFromQueryParams)
        }
    }, [])

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
