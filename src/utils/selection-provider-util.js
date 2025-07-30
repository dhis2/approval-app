import i18n from '@dhis2/d2-i18n'
import { findAttributeOptionCombo, findAttributeOptionComboInWorkflow, getCategoryComboByCategoryOptionCombo, getCategoryCombosByFilters, getCategoryOptionComboById, getCategoryOptionsByCategoryOptionCombo } from "./category-combo-utils.js"

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

export const getAttributeComboState = ({
    metadata,
    workflow,
    orgUnit,
    period,
    calendar,
    attributeCombo,
    attributeOptionCombo,
}) => {
    const _attributeCombos = getCategoryCombosByFilters(metadata, {
        workflow,
        orgUnit,
        period,
        calendar,
    })

    let _attributeCombo = attributeCombo
    let _attributeOptionCombo = null
    let isShowAttributeComboVisible = true
    let attributeComboValue = i18n.t('0 selections')

    const processCategoryOptions = (metadata, optionComboId) => {
        const options =
            getCategoryOptionsByCategoryOptionCombo(metadata, optionComboId) || []
        return options.reduce((acc, option, index) => {
            acc[index] = option.id
            return acc
        }, [])
    }

    const getAttributeOptionComboValue = (selectedAttrCombo, selectedCategoryItems) => {
        if (selectedAttrCombo?.isDefault) {
            return ''
        }

        if (!Object.values(selectedCategoryItems).length || !selectedAttrCombo) {
            return i18n.t('0 selections')
        }

        const amount = Object.values(selectedCategoryItems).length
        if (amount === 1) {
            return i18n.t('1 selection')
        }

        return i18n.t('{{amount}} selections', { amount })
    }

    if (_attributeCombos.length === 0) {
        _attributeCombo = null
        isShowAttributeComboVisible = false
        attributeComboValue = i18n.t('0 selections')
    }
    else if (attributeOptionCombo) {
        const selectedAttrCombo = getCategoryComboByCategoryOptionCombo(
            _attributeCombos,
            attributeOptionCombo.id
        )
        const selectedAttrOptionCombo = getCategoryOptionComboById(
            selectedAttrCombo,
            attributeOptionCombo.id
        )
        const categoryOptions = processCategoryOptions(metadata, attributeOptionCombo.id)
        const value = getAttributeOptionComboValue(selectedAttrCombo, categoryOptions)
        _attributeCombo = selectedAttrCombo
        _attributeOptionCombo = selectedAttrOptionCombo
        attributeComboValue = value

        isShowAttributeComboVisible = !(
            _attributeCombos.length === 1 &&
            _attributeCombos[0].categories?.length === 1 &&
            _attributeCombos[0].categories[0].categoryOptions.length <= 1
        )
    }
    else if (_attributeCombos.length === 1) {
        const singleCategoryCombo = _attributeCombos[0]
        if (
            singleCategoryCombo.categories?.length === 1 &&
            singleCategoryCombo.categories[0].categoryOptions?.length === 1
        ) {
            const category = singleCategoryCombo.categories[0]
            const categoryOptionMap = {}
            categoryOptionMap[category.id] = category.categoryOptions[0].id
            _attributeOptionCombo = findAttributeOptionCombo(
                singleCategoryCombo,
                categoryOptionMap
            )
            _attributeCombo = singleCategoryCombo
            attributeComboValue = i18n.t('1 selection')
            isShowAttributeComboVisible = false
        } else {
            _attributeCombo = singleCategoryCombo
            attributeComboValue = i18n.t('0 selections')
            isShowAttributeComboVisible = true
        }
    }

    return {
        attributeCombos: _attributeCombos,
        attributeCombo: _attributeCombo,
        attributeOptionCombo: _attributeOptionCombo,
        showAttributeSelect: isShowAttributeComboVisible,
        attrComboValue: attributeComboValue,
    }
}
