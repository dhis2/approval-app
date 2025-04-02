import { areListsEqual, cloneJSON } from "./array-utils.js";
import { isDateALessThanDateB } from "./date-utils.js";

export const getCategoryCombosByFilters = (metadata, workflow, orgUnit, period, calendar) => {
    if(workflow == null || orgUnit == null || period == null ) return [];
    
    const categoryComboList = cloneJSON(extractCategoryCombosByWorkflow(metadata, workflow))
    // Filter category options by orgunit
    if( categoryComboList.length > 0 ) {
        categoryComboList.map((categoryCombo) => {
            categoryCombo.categories = filterValidCategoryOptions(categoryCombo, orgUnit, period, calendar)
        })
    }
    
    return categoryComboList
}

const extractCategoryCombosByWorkflow = (metadata, workflow) => {
    if (!workflow?.dataSets?.length) return [];

    const categoryComboList = workflow.dataSets
        .filter(dataSet => verifyCategoryComboAssignment(metadata, dataSet))
        .map(dataSet => getAttributeComboById(metadata, dataSet.categoryCombo.id));

    // Remove duplicates using a Set (ensuring uniqueness by `id`)
    const uniqueCategoryCombos = Array.from(
        new Map(categoryComboList.map(combo => [combo.id, combo])).values()
    );

    return uniqueCategoryCombos;
};

const filterValidCategoryOptions  = (categoryCombo, orgUnit, period, calendar) => {
    if (!categoryCombo?.categories?.length || !orgUnit || !period) return [];

    const periodStartDate = period?.startDate
    const periodEndDate = period?.endDate
    
    return categoryCombo.categories.map(category => ({
        ...category,
        categoryOptions: category.categoryOptions.filter(
            (categoryOption) =>
                isOptionAssignedToOrgUnit({ categoryOption, orgUnit }) &&
                isOptionWithinPeriod({ periodStartDate, periodEndDate, categoryOption, calendar })
        ),
    }));
}

export const getAttributeComboById = (metadata, attributeComboById) => {
    return metadata.categoryCombos.find((item => item.id === attributeComboById))
}

export const getCategoryComboByCategoryOptionCombo = (attributeCombos, attrOptionComboId) => {
    
    for( const attrCombo of attributeCombos ) {
        const foundAttrOptionCombo = attrCombo.categoryOptionCombos?.find((item => item.id === attrOptionComboId))
        if( foundAttrOptionCombo ) {
            return attrCombo
        }
    }
    
    return null
}

export const getCategoryOptionComboById = (attributeCombo, attrOptionComboId) => {
   
    const foundCatOptionCombo = attributeCombo.categoryOptionCombos?.find((item => item.id === attrOptionComboId))
    if( foundCatOptionCombo ) {
        return foundCatOptionCombo
    }
    
    return null
}

export const findAttributeOptionComboInWorkflow = (metadata, workflow, attributeOptionComboId, orgUnit, period, calendar) => {
    if (!workflow?.dataSets?.length) return null
    
    // const periodStartDate = period?.startDate
    // const periodEndDate = period?.endDate
    
    const dataSets = cloneJSON(workflow.dataSets)
    
    for( const dataSet of dataSets) {
        const attributeCombo = cloneJSON(getAttributeComboById(metadata, dataSet.categoryCombo.id))
        if (attributeCombo) {
            const foundAttrOptionCombo = attributeCombo.categoryOptionCombos?.find((optionCombo) => optionCombo.id === attributeOptionComboId)
            const isValid = isCategoryOptionComboValid(foundAttrOptionCombo?.id, attributeCombo, orgUnit, period, calendar)
            if( isValid ) return { attributeCombo, attributeOptionCombo: foundAttrOptionCombo }
        }
    }
  
    return null
}

const isCategoryOptionComboValid = (attrOptionComboId, categoryCombo, orgUnit, period, calendar) => {
    if (!attrOptionComboId || !categoryCombo || !orgUnit || !period) return null;
    
     // Find the categoryOptionCombo by ID
     const categoryOptionCombo = categoryCombo.categoryOptionCombos.find(
        (combo) => combo.id === attrOptionComboId
    );
    
    if (!categoryOptionCombo) return false;
    
    
    const periodStartDate = period?.startDate
    const periodEndDate = period?.endDate
    
    // Check if all categoryOptions in the combo are valid
    return categoryOptionCombo.categoryOptions.every((optionRef) => {
        // Find the actual categoryOption by ID
        const categoryOption = categoryCombo.categories
            .flatMap((category) => category.categoryOptions)
            .find((option) => option.id === optionRef.id);

        if (!categoryOption) return false;

        // Check if categoryOption is assigned to the orgUnit
        const isAssignedToOrgUnit = isOptionAssignedToOrgUnit({ categoryOption, orgUnit })
        // Check if categoryOption falls within the period
        const isWithinPeriod = isOptionWithinPeriod({ periodStartDate, periodEndDate, categoryOption, calendar })
        

        return isWithinPeriod && isAssignedToOrgUnit;
    });
};

export const getCategoryOptionsByCategoryOptionCombo = (metadata, categoryOptionComboId) => {
    const categoryCombos = metadata.categoryCombos
    for( const categoryCombo of categoryCombos ) {
        const foundCatOptionCombo = categoryCombo.categoryOptionCombos?.find((item => item.id === categoryOptionComboId))
        if( foundCatOptionCombo ) {
            return foundCatOptionCombo.categoryOptions
        }
    }
    
    return
}

export const getDataSetReportFilter = (attributeCombo, attributeOptionCombo) => {
    if (!attributeOptionCombo?.categoryOptions?.length) return null
    
    if (!attributeCombo || attributeCombo.isDefault) return null
    
     // Map categoryOptions to category-option pairs, filtering out nulls
     return attributeOptionCombo.categoryOptions
        .map(option => {
            const category = attributeCombo.categories.find(cat =>
                cat.categoryOptions.some(catOption => catOption.id === option.id)
            );

            return category ? `${category.id}:${option.id}` : null;
        })
        .filter(Boolean) // Remove null values
}

export const filterDataSetsByAttributeOptionComboAndOrgUnit = (metadata, workflow, orgUnit, attributeOptionCombo) => {
    const result = [];
    
    if( attributeOptionCombo ) {
        const dataSets = cloneJSON(workflow?.dataSets)
        for( const dataSet of dataSets ) {
            const catCombo = cloneJSON(getAttributeComboById(metadata, dataSet.categoryCombo.id))
            // Check if the data set assigned to "attributeOptionCombo"
            const checkAttrOptionCombo = catCombo.categoryOptionCombos.find((dsCatOptionCombo => dsCatOptionCombo.id === attributeOptionCombo.id))
            // Check if the data set assigned to "orgUnit"
            // const checkOrgunit = dataSet.organisationUnits.find((dsOrgUnit => dsOrgUnit.id === orgUnit.id))
            const checkOrgunit = dataSet.organisationUnits.find((dsOrgUnit => dsOrgUnit.path.indexOf(orgUnit?.path)>=0))
            
            if( checkAttrOptionCombo && checkOrgunit ) {
                result.push(dataSet)
            }
        }
    }
    
    return result
}

/**
 * @param {*} metadata
 * @param {*} dataSet
 */
const verifyCategoryComboAssignment = (metadata, dataSet) => {
    const categoryCombos = metadata?.categoryCombos
    
    if (!dataSet.categoryCombo?.id) {
        console.warn(`Data set with id ${dataSet.id} does not have a category combo`)
        return false
    }

    const categoryCombo = categoryCombos.find((item => item.id === dataSet.categoryCombo?.id))
    if (!categoryCombo) {
        console.warn(`Could not find a category combo for data set with id ${dataSet.id}`)
        return false
    }
    
    // return categoryCombo
    return true
}


const isOptionAssignedToOrgUnit = ({ categoryOption, orgUnit }) => {
    // by default, ...
    if (!categoryOption?.organisationUnits?.length) {
        return true;
    }
    
    const found = categoryOption?.organisationUnits.filter(catOptionOrgUnit => orgUnit?.path.indexOf(catOptionOrgUnit.path)>=0)
    
    return found.length > 0
}

const isOptionWithinPeriod = ({
    periodStartDate,
    periodEndDate,
    categoryOption,
    calendar = 'gregory',
}) => {
    
    const categoryOptionStartDate = categoryOption.startDate
    const categoryOptionEndDate = categoryOption.endDate
    
    // option has not start and end dates
    if (!categoryOption.startDate && !categoryOption.endDate) {
        return true
    }
    
    let startDateValid = true
    let endDateValid = true 
    
    // catOption.startDate <= period.startDate
    if(categoryOption.startDate) {
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
    if(categoryOption.endDate) {
        endDateValid =  isDateALessThanDateB(
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

/**
 * 
 * @param {*} attributeCombo 
 * @param {*} categoryOptionMap {<category_id>: <category_option_id>, ...}
 * @returns 
 */
export const findAttributeOptionCombo = (attributeCombo, categoryOptionMap) => {
    const selectedCatOptionIds = Object.values(categoryOptionMap) // Get the category list
    const catOptionComboList = attributeCombo.categoryOptionCombos
    for( let i=0; i<catOptionComboList.length; i++ ) {
        const attributeOptionCombo = catOptionComboList[i]
        const catOptionIds = attributeOptionCombo.categoryOptions.map((item) => item.id)
        if( areListsEqual(selectedCatOptionIds, catOptionIds) ) {
            return attributeOptionCombo;
        }
    }
    
    return;
}