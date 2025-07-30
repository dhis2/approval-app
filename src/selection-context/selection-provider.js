import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useAppContext } from '../app-context/index.js'
import { pushStateToHistory } from '../navigation/index.js'
import { getAttributeComboState, handleSelectOrgUnit, handleSelectPeriod, handleSelectWorkflow } from '../utils/selection-provider-util.js'
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
        case ACTIONS.SELECT_WORKFLOW:
            return handleSelectWorkflow(state, payload)
        case ACTIONS.SELECT_PERIOD:
            return handleSelectPeriod(state, payload)
        case ACTIONS.SELECT_ORG_UNIT:
            return handleSelectOrgUnit(state, payload)
        case ACTIONS.SELECT_ATTRIBUTE_COMBO:
            return {
                ...state,
                attributeCombo: payload.attributeCombo,
                attributeOptionCombo: null,
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
                ...initialValues(
                    payload.metadata,
                    payload.dataApprovalWorkflows,
                    payload.calendar
                ),
            }
        default:
            return state
    }
}

const SelectionProvider = ({ children }) => {
    const { metadata, dataApprovalWorkflows } = useAppContext()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const [
        {
            openedSelect,
            workflow,
            period,
            orgUnit,
            dataSet,
            attributeCombo,
            attributeOptionCombo,
        },
        dispatch,
    ] = useReducer(reducer,  null, () => ({
        openedSelect: '',
        ...initialValues(metadata, dataApprovalWorkflows, calendar),
    }));

    const [attributeComboState, setAttributeComboState] = useState({
        attributeCombos: [],
        showAttributeSelect: true,
        attrComboValue: '',
    })

    const _attributeComboState = useMemo(() => {
        if (!metadata || !workflow || !orgUnit || !period) {
            return null;
        }

        return getAttributeComboState({
            metadata,
            workflow,
            orgUnit,
            period,
            calendar,
            attributeCombo,
            attributeOptionCombo,
        });
    }, [workflow, orgUnit, period, attributeCombo, attributeOptionCombo]);

    useEffect(() => {
        if (_attributeComboState) {
            updateAttributeComboState(_attributeComboState);
            dispatchAttributeStateIfNeeded(_attributeComboState);
        }
    }, [_attributeComboState]);

    useEffect(() => {
        pushStateToHistory({
            workflow,
            period,
            orgUnit,
            attributeOptionCombo,
            dataSet,
        })
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

    const updateAttributeComboState = (_attributeState) => {
        setAttributeComboState({
            attributeCombos: _attributeState.attributeCombos,
            showAttributeSelect: _attributeState.showAttributeSelect,
            attrComboValue: _attributeState.attrComboValue,
        });
    }

    const dispatchAttributeStateIfNeeded = (_attributeState) => {
        if (attributeCombo?.id !== _attributeState.attributeCombo?.id) {
            dispatch({ type: ACTIONS.SELECT_ATTRIBUTE_COMBO, payload: { attributeCombo: _attributeState.attributeCombo } });
        }

        if (attributeOptionCombo?.id !== _attributeState.attributeOptionCombo?.id) {
            dispatch({ type: ACTIONS.SELECT_CAT_OPTION_COMBO, payload: { attributeOptionCombo: _attributeState.attributeOptionCombo } });
        }
    }
    const providerValue = {
        workflow,
        period,
        orgUnit,
        attributeCombo,
        attributeOptionCombo: attributeOptionCombo,
        attributeCombos: attributeComboState.attributeCombos,
        showAttributeSelect: attributeComboState.showAttributeSelect,
        attrComboValue: attributeComboState.attrComboValue,
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
            dispatch({
                type: ACTIONS.SELECT_WORKFLOW,
                payload: { metadata, workflow, calendar },
            }),
        selectPeriod: (period) =>
            dispatch({
                type: ACTIONS.SELECT_PERIOD,
                payload: { metadata, period, calendar },
            }),
        selectOrgUnit: (orgUnit) =>
            dispatch({
                type: ACTIONS.SELECT_ORG_UNIT,
                payload: { metadata, orgUnit, calendar },
            }),
        selectAttributeCombo: (attributeCombo) =>
            dispatch({
                type: ACTIONS.SELECT_ATTRIBUTE_COMBO,
                payload: { attributeCombo },
            }),
        selectAttributeOptionCombo: (attributeOptionCombo) =>
            dispatch({
                type: ACTIONS.SELECT_CAT_OPTION_COMBO,
                payload: { attributeOptionCombo },
            }),
        selectDataSet: (dataSet) =>
            dispatch({ type: ACTIONS.SELECT_DATA_SET, payload: { dataSet } }),
    }

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
