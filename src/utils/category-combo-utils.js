import { areListsEqual, cloneJSON } from './array-utils.js'
import { isDateALessThanDateB } from './date-utils.js'

export const getCategoryCombosByFilters = (
    metadata,
    { workflow, orgUnit, period, calendar }
) => {
    if (workflow == null || orgUnit == null || period == null) {
        return []
    }

    const categoryComboList = cloneJSON(
        getCategoryComboByDataSet(workflow, metadata)
    )

    // Filter category options by orgunit and period
    categoryComboList.map((categoryCombo) => {
        filterValidCategoryOptions({
            categoryCombo,
            metadata,
            orgUnit,
            period,
            calendar,
        })
    })

    return categoryComboList
}

export const getAttributeComboById = (metadata, attributeComboId) => {
    return metadata.categoryCombos?.[attributeComboId]
}

export const extractValidCatComboAndCatOptionCombo = (
    metadata,
    selection = {}
) => {
    const { workflow, aoc, orgUnit, period, calendar } = selection

    if (!workflow?.dataSets?.length) {
        return null
    }

    const categoryOptionCombo = metadata.categoryOptionCombos[aoc]
    if (!categoryOptionCombo) {
        return null
    }

    const datasetHasMatchingCatCombo = workflow.dataSets.find(
        (ds) => ds.categoryCombo.id === categoryOptionCombo?.categoryComboId
    )
    if (!datasetHasMatchingCatCombo) {
        return null
    }

    const categoryCombo = cloneJSON(
        getAttributeComboById(metadata, categoryOptionCombo.categoryComboId)
    )

    const isValid = isCategoryOptionComboValid({
        aoc,
        metadata,
        orgUnit,
        period,
        calendar,
    })

    if (!isValid) {
        return null
    }

    return {
        attributeCombo: categoryCombo,
        attributeOptionCombo: categoryOptionCombo,
    }
}

export const getDataSetReportFilter = (
    metadata,
    attributeCombo,
    attributeOptionCombo
) => {
    if (
        !attributeOptionCombo?.categoryOptionIds?.length ||
        !attributeCombo ||
        attributeCombo.isDefault
    ) {
        return null
    }

    // Map categoryOptions to category-option pairs
    const filter = []
    const categoryCombo = getAttributeComboById(
        metadata,
        attributeOptionCombo.categoryComboId
    )
    const categories = getCategoriesByCategoryCombo(categoryCombo, metadata)
    for (const category of categories) {
        const matchedOptionId = category.categoryOptionIds.find((optionId) =>
            attributeOptionCombo.categoryOptionIds.includes(optionId)
        )

        if (matchedOptionId) {
            filter.push(`${category.id}:${matchedOptionId}`)
        }
    }

    return filter
}

export const filterDataSetsByAttributeOptionComboAndOrgUnit = (
    metadata,
    { workflow, orgUnit, attributeOptionCombo }
) => {
    const result = []

    if (attributeOptionCombo) {
        const dataSets = cloneJSON(workflow?.dataSets)
        const catCombo = getAttributeComboById(
            metadata,
            attributeOptionCombo.categoryComboId
        )
        for (const dataSet of dataSets) {
            // Check if the data set assigned to "categoryCombo"
            const checkAttrOptionCombo =
                catCombo.id === dataSet.categoryCombo.id

            // Check if the data set assigned to "orgUnit"
            const checkOrgunit = dataSet.organisationUnits.find(
                (dsOrgUnit) => dsOrgUnit.path.indexOf(orgUnit?.path) >= 0
            )

            if (checkAttrOptionCombo && checkOrgunit) {
                result.push(dataSet)
            }
        }
    }

    return result
}

/**
 *
 * @param {*} categoryCombo
 * @param {*} categoryOptionMap {<category_id>: <category_option_id>, ...}
 * @returns
 */
export const findAttributeOptionCombo = (metadata, categoryOptionMap) => {
    const selectedOptionIds = Object.values(categoryOptionMap) // Get the selected category list

    return (
        Object.values(metadata.categoryOptionCombos).find((catOptionCombo) =>
            areListsEqual(catOptionCombo.categoryOptionIds, selectedOptionIds)
        ) || null
    )
}

export const getCategoriesByCategoryCombo = (categoryCombo, metadata) =>
    categoryCombo.categoryIds.map((id) => metadata.categories[id])

const getCategoryComboByDataSet = (workflow, metadata) => {
    if (!workflow?.dataSets?.length) {
        return []
    }

    const uniqueComboIds = Array.from(
        new Set(workflow.dataSets.map((ds) => ds?.categoryCombo?.id))
    )

    return uniqueComboIds.map((id) => getAttributeComboById(metadata, id))
}

const isOptionAssignedToOrgUnit = ({ categoryOption, orgUnit }) => {
    // by default, ...
    if (!categoryOption?.organisationUnits?.length) {
        return true
    }

    const found = categoryOption?.organisationUnits.filter(
        (catOptionOrgUnit) =>
            orgUnit?.path.indexOf(catOptionOrgUnit.path) >= 0 ||
            catOptionOrgUnit?.path.indexOf(orgUnit.path) >= 0
    )
    return found.length > 0
}

const isOptionWithinPeriod = ({
    period,
    categoryOption,
    calendar = 'gregory',
}) => {
    const { startDate: periodStartDate, endDate: periodEndDate } = period
    const {
        startDate: categoryOptionStartDate,
        endDate: categoryOptionEndDate,
    } = categoryOption

    // option has not start and end dates
    if (!categoryOptionStartDate && !categoryOptionEndDate) {
        return true
    }

    let startDateValid = true
    let endDateValid = true

    // catOption.startDate <= period.startDate
    if (categoryOptionStartDate) {
        startDateValid = isDateALessThanDateB(
            { date: categoryOptionStartDate, calendar: 'gregory' },
            { date: periodStartDate, calendar },
            {
                calendar,
                inclusive: true,
            }
        )
    }

    // period.endDate<=catOption.endDate
    if (categoryOptionEndDate) {
        endDateValid = isDateALessThanDateB(
            { date: periodEndDate, calendar },
            { date: categoryOptionEndDate, calendar: 'gregory' },
            {
                calendar,
                inclusive: true,
            }
        )
    }

    return startDateValid && endDateValid
}

const filterValidCategoryOptions = ({
    metadata,
    categoryCombo,
    orgUnit,
    period,
    calendar,
}) => {
    if (!categoryCombo?.categoryIds?.length || !orgUnit || !period) {
        return
    }

    const categories = getCategoriesByCategoryCombo(categoryCombo, metadata)
    for (const category of categories) {
        if (!category?.categoryOptionIds?.length) {
            return
        }

        category.categoryOptionIds.filter((catOptionId) => {
            const categoryOption = metadata.categoryOptions[catOptionId]
            return isCategoryOptionValid({
                categoryOption,
                orgUnit,
                period,
                calendar,
            })
        })
    }
}

const isCategoryOptionComboValid = ({
    aoc,
    metadata,
    orgUnit,
    period,
    calendar,
}) => {
    const catMap = metadata.categoryOptionCombos[aoc].breakdown

    return catMap.every(({ optionId }) => {
        const categoryOption = metadata.categoryOptions[optionId]
        return isCategoryOptionValid({
            categoryOption,
            orgUnit,
            period,
            calendar,
        })
    })
}

const isCategoryOptionValid = ({
    categoryOption,
    orgUnit,
    period,
    calendar,
}) => {
    return (
        isOptionAssignedToOrgUnit({ categoryOption, orgUnit }) &&
        isOptionWithinPeriod({ categoryOption, period, calendar })
    )
}
