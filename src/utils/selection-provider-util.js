import i18n from '@dhis2/d2-i18n'
import {
    findAttributeOptionCombo,
    extractValidCatComboAndCatOptionCombo,
    getCategoryCombosByFilters,
    getAttributeComboById,
} from './category-combo-utils.js'

export const getAttributeOptionComboData = (state, payload) => {
    return extractValidCatComboAndCatOptionCombo(payload.metadata, {
        workflow: payload.workflow,
        attributeOptionComboId: state.attributeOptionCombo?.id,
        orgUnit: state.orgUnit,
        period: state.period,
        calendar: payload.calendar,
    })
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
    const attributeOptionComboData = extractValidCatComboAndCatOptionCombo(
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

    const processCategoryOptions = (metadata, attributeOptionCombo) => {
        return attributeOptionCombo.categoryOptionIds.map(
            (catOptionId) => metadata.categoryOptions[catOptionId]
        )
    }

    const getAttributeOptionComboValue = (
        selectedAttrCombo,
        selectedCategoryItems
    ) => {
        if (selectedAttrCombo?.isDefault) {
            return ''
        }

        if (
            !Object.values(selectedCategoryItems).length ||
            !selectedAttrCombo
        ) {
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
    } else if (attributeOptionCombo) {
        const selectedAttrCombo = getAttributeComboById(
            metadata,
            attributeOptionCombo.categoryComboId
        )
        const selectedAttrOptionCombo = attributeOptionCombo
        const categoryOptions = processCategoryOptions(
            metadata,
            attributeOptionCombo
        )
        const value = getAttributeOptionComboValue(
            selectedAttrCombo,
            categoryOptions
        )
        _attributeCombo = selectedAttrCombo
        _attributeOptionCombo = selectedAttrOptionCombo
        attributeComboValue = value

        isShowAttributeComboVisible = !(
            _attributeCombos.length === 1 &&
            _attributeCombos[0].categoryIds?.length === 1 &&
            metadata.categories[_attributeCombos[0].categoryIds[0]]
                .categoryOptionIds.length <= 1
        )
    } else if (_attributeCombos.length === 1) {
        const [singleCategoryCombo] = _attributeCombos
        const [categoryId] = singleCategoryCombo.categoryIds
        const firstCategory = metadata.categories[categoryId]

        if (
            singleCategoryCombo.categoryIds?.length === 1 &&
            firstCategory.categoryOptionIds?.length === 1
        ) {
            const categoryId = singleCategoryCombo.categoryIds[0]
            const categoryOptionMap = {}
            categoryOptionMap[categoryId] = firstCategory.categoryOptionIds[0]
            _attributeOptionCombo = findAttributeOptionCombo(
                metadata,
                categoryOptionMap
            )
            _attributeCombo = singleCategoryCombo
            attributeComboValue = i18n.t('1 selection')
            isShowAttributeComboVisible = false
        } else {
            _attributeCombo = singleCategoryCombo
            attributeComboValue = i18n.t('0 selections')
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
