import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Divider, SingleSelect, SingleSelectOption} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../app-context/use-app-context.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { findObject } from '../../utils/array-utils.js'
import { findAttributeOptionCombo, getCategoryComboByCategoryOptionCombo, getCategoryCombosByFilters, getCategoryOptionComboById, getCategoryOptionsByCategoryOptionCombo } from '../../utils/caterogy-combo-utils.js'
import { ContextSelect } from '../context-select/context-select.js'
import css from './attribute-combo-select.module.css'
import CategoySelect from './category-select.js'


const CAT_OPTION_COMBO = 'CAT_OPTION_COMBO';

const AttributeComboSelect = () => {
    const { metadata } = useAppContext()
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    
    const { workflow, orgUnit, period, openedSelect, setOpenedSelect, attributeCombo, selectAttributeCombo, attributeOptionCombo, selectAttributeOptionCombo } = useSelectionContext();
        
    const open = openedSelect === CAT_OPTION_COMBO
    const getMissingSelectionsMessage = () => {
        if( !period ) {
            return i18n.t('Choose a period first')
        }
        
        if( !orgUnit ) {
            return i18n.t('Choose an organisation unit first')
        }
    } 
        
    const [attributeCombos, setAttributeCombos] = useState([])
    const [attrComboValue, setAttrComboValue] = useState("")
    const [showed, setShowed] = useState(true)
    
    const processCategoryOptions = (metadata, optionComboId) => {
        return getCategoryOptionsByCategoryOptionCombo(metadata, optionComboId).reduce(
            (acc, option, index) => {
                acc[index] = option.id;
                return acc;
            },
            {}
        );
    };
    
    const initializeSelectedAttributeCombo = (metadata, _attributeCombos, optionComboId) => {
        const selectedAttrCombo = getCategoryComboByCategoryOptionCombo(_attributeCombos, optionComboId)
        const selectedAttrOptionCombo = getCategoryOptionComboById(selectedAttrCombo, optionComboId)
        const categoryOptions = processCategoryOptions(metadata, optionComboId)
    
        const value = getAttributeOptionComboValue(selectedAttrCombo, categoryOptions)
        const isVisible = !(_attributeCombos.length === 0 || (_attributeCombos.length === 1 && _attributeCombos[0].categories?.length === 1 && _attributeCombos[0].categories[0].categoryOptions.length <= 1))
        return { value, attributeCombo: selectedAttrCombo, attributeOptionCombo: selectedAttrOptionCombo, isVisible }
    }
    
    const handleSingleCategoryCombo = (_attributeCombos) => {
        const singleCategoryCombo = _attributeCombos[0];
    
        if(singleCategoryCombo.categories?.length === 1 && singleCategoryCombo.categories[0].categoryOptions?.length === 1) {
            const category = singleCategoryCombo.categories[0]
            const categoryOptionMap = {}
            categoryOptionMap[category.id] = category.categoryOptions[0].id
            const _attributeOptionCombo = findAttributeOptionCombo(singleCategoryCombo, categoryOptionMap)
            
            return { isVisible: false, value: i18n.t('1 selection'), attributeCombo: singleCategoryCombo, attributeOptionCombo: _attributeOptionCombo }
        }
        
        return { isVisible: true, value: i18n.t('0 selections'), attributeCombo: singleCategoryCombo };
    };
    
    const resetAttributeComboState = () => {
        return { isVisible: false, value: i18n.t('0 selections'), attributeCombo: null };
    };
    
    useEffect(() => {
        // Fetch and set the category combos
        const _attributeCombos = getCategoryCombosByFilters(metadata, workflow, orgUnit, period, calendar)

        setAttributeCombos(_attributeCombos)
        
        let _attributeCombo = null
        let _attributeOptionCombo = null
    
        let isShowAttributeComboVisible = true;
        let attributeComboValue = i18n.t('0 selections')
        if (_attributeCombos.length === 0) {
            // Handle the case for no category combos
            const result = resetAttributeComboState()
            _attributeCombo = result.attributeCombo
            isShowAttributeComboVisible = result.isVisible;
            attributeComboValue = result.value;
        }
        else if (attributeOptionCombo) {
            // Initialize with the existing attribute option combo
            const result = initializeSelectedAttributeCombo(metadata, _attributeCombos, attributeOptionCombo.id);
            _attributeCombo = result.attributeCombo
            _attributeOptionCombo = result.attributeOptionCombo
            isShowAttributeComboVisible = result.isVisible
            attributeComboValue = result.value
        }
        else if (_attributeCombos.length === 1) {
            // Handle the case for a single category combo
            const result = handleSingleCategoryCombo(_attributeCombos)
            _attributeCombo = result.attributeCombo
            _attributeOptionCombo = result.attributeOptionCombo
            isShowAttributeComboVisible = result.isVisible
            attributeComboValue = result.value
        }
        else {
            _attributeOptionCombo = null
        }
        
        // Update states only if values have changed
        selectAttributeCombo(_attributeCombo);
        selectAttributeOptionCombo(_attributeOptionCombo);
        setShowed((prev) => (prev !== isShowAttributeComboVisible ? isShowAttributeComboVisible : prev));
        setAttrComboValue((prev) => (prev !== attributeComboValue ? attributeComboValue : prev));
    }, [workflow, orgUnit, period]);
    
    const onChange = (selectedAttrCombo, selectedCategoryItems, selectedAttrOptionCombo) => {
        selectAttributeOptionCombo(selectedAttrOptionCombo)
        setAttrComboValue(getAttributeOptionComboValue(selectedAttrCombo, selectedCategoryItems))
    }
    
    const getAttributeOptionComboValue = (selectedAttrCombo, selectedCategoryItems) => {
        if (selectedAttrCombo?.isDefault) {
            return ''
        }
        
        if (
            !Object.values(selectedCategoryItems).length ||
            !selectedAttrCombo
        ) {
            return i18n.t('0 selections')
        }
        
        if (selectedCategoryItems.length === 1) {
            const categoryId = selectedAttrCombo?.categories[0]
            const category = selectedAttrCombo.categories?.find((item => item.id == categoryId))
            return category?.displayName
        }
    
        const amount = Object.values(selectedCategoryItems).length
    
        if (amount === 1) {
            return i18n.t('1 selection')
        }
    
        return i18n.t('{{amount}} selections', {
            amount: Object.values(selectedCategoryItems).length,
        })
    }
    
    const onChangeCatCombo = (catComboId) => {
        const catCombo = findObject(attributeCombos, "id", catComboId)
        
        // Update the selected attribute combo and reset attribute combo value
        selectAttributeCombo(catCombo)
        
        // Automatically select the default option combo if applicable
        if( catCombo.isDefault || (catCombo.categories?.length === 1 && catCombo.categories[0].categoryOptions.length === 1) ) {
            selectAttributeOptionCombo(catCombo.categoryOptionCombos[0])
            setAttrComboValue(i18n.t('1 selection'))
        }
        else {
            setAttrComboValue(i18n.t('0 selections'))
        }
    }
    
    if (!workflow || Object.keys(workflow).length < 0) {
        return null // Renders nothing
    }
    
    return (
        <>
            {showed && <ContextSelect 
                dataTest="category-combo-context-select"
                prefix={attributeCombo?.displayName || i18n.t('Category Option Combo')}
                placeholder={attrComboValue || i18n.t('Choose a category option combo')}
                open={open}
                disabled={!(workflow?.id && period?.id && orgUnit?.id )}
                onOpen={() => setOpenedSelect(CAT_OPTION_COMBO)}
                onClose={() => setOpenedSelect('')}
                requiredValuesMessage={getMissingSelectionsMessage()}
                popoverMaxWidth={400}
            >
                {/* Renders a SingleSelectField for each category */}
                <div className={css.menu} style={{height: attributeCombos.length == 1 ? "250px" : "330px"}}>
                    {/* Only show Category Combo dropdown when there are more than one categoryCombo in the list */}
                    {attributeCombos.length > 1 && <div className={css.attributeComboSelect }>
                        <SingleSelect
                            placeholder={i18n.t('Choose a combination')}
                            selected={attributeCombo?.id}
                            onChange={({selected}) => onChangeCatCombo(selected)}
                        >
                            {attributeCombos.map((catCombo) => (
                                <SingleSelectOption
                                    key={`wf_${workflow?.id}_${catCombo?.id}`}
                                    value={catCombo.id}
                                    label={catCombo.displayName}
                                />
                            ))}
                        </SingleSelect>
                        <Divider className={css.divider} />
                    </div>}
                
                    {attributeCombo && (!attributeCombo.isDefault ) &&
                        <CategoySelect
                            key={`catCombo_${attributeCombo?.id}_${period?.id}_${orgUnit?.id}`}
                            categoryCombo={attributeCombo}
                            selected={attributeOptionCombo}
                            onChange={onChange}
                            onClose={() => setOpenedSelect('')}
                        />}
                
                </div>
            </ContextSelect>}
        </>
    )
}

export { AttributeComboSelect, CAT_OPTION_COMBO }