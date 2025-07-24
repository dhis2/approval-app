import { findAttributeOptionComboInWorkflow } from "./category-combo-utils.js"

export const getAttributeOptionComboData = (state, payload) => {
    return findAttributeOptionComboInWorkflow(
        payload.metadata,
        {
            workflow: payload.workflow,
            attributeOptionComboId: state.attributeOptionCombo?.id,
            orgUnit: state.orgUnit,
            period: state.period,
            calendar: payload.calendar,
        }
    )
}

export const handleSelectWorkflow = (state, payload) => {
    const attributeOptionComboData = getAttributeOptionComboData(state, payload)

    const samePeriodType =
        state.workflow?.periodType === payload.workflow?.periodType

    return {
        ...state,
        openedSelect: '',
        workflow: payload.workflow,
        period: state.workflow && samePeriodType ? state.period : null,
        attributeCombo: state.attributeCombo
            ? attributeOptionComboData?.attributeCombo
            : null,
        attributeOptionCombo: state.attributeOptionCombo
            ? attributeOptionComboData?.attributeOptionCombo
            : null,
        dataSet: null,
    }
}

export const handleSelectPeriod = (state, payload) => {
    const attributeOptionComboData = getAttributeOptionComboData(state, payload)

    return {
        ...state,
        openedSelect: payload.period?.id ? '' : state.openedSelect,
        period: payload.period,
        attributeCombo: state.attributeCombo
            ? attributeOptionComboData?.attributeCombo
            : null,
        attributeOptionCombo: state.attributeOptionCombo
            ? attributeOptionComboData?.attributeOptionCombo
            : null,
        dataSet: null,
    }
}

export const handleSelectOrgUnit = (state, payload) => {
    const attributeOptionComboData = findAttributeOptionComboInWorkflow(
        payload.metadata,
        state.workflow,
        state.attributeOptionCombo?.id,
        payload.orgUnit,
        state.period,
        payload.calendar
    )

    return {
        ...state,
        openedSelect: '',
        orgUnit: payload.orgUnit,
        attributeCombo: state.attributeCombo
            ? attributeOptionComboData?.attributeCombo
            : null,
        attributeOptionCombo: state.attributeOptionCombo
            ? attributeOptionComboData?.attributeOptionCombo
            : null,
        dataSet: null,
    }
}
