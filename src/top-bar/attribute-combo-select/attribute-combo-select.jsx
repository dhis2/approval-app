import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useAppContext } from '../../app-context/use-app-context.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { getAttributeComboById } from '../../utils/category-combo-utils.js'
import { ContextSelect } from '../context-select/context-select.jsx'
import css from './attribute-combo-select.module.css'
import CategorySelect from './category-select.jsx'

const CAT_OPTION_COMBO = 'CAT_OPTION_COMBO'

const AttributeComboSelect = () => {
    const {
        workflow,
        orgUnit,
        period,
        openedSelect,
        setOpenedSelect,
        attributeCombo,
        selectAttributeCombo,
        attributeOptionCombo,
        selectAttributeOptionCombo,
        attributeCombos,
        showAttributeSelect,
        attrComboValue,
    } = useSelectionContext()

    const { metadata } = useAppContext()

    const open = openedSelect === CAT_OPTION_COMBO
    const getMissingSelectionsMessage = () => {
        if (!period) {
            return i18n.t('Choose a period first')
        }

        if (!orgUnit) {
            return i18n.t('Choose an organisation unit first')
        }
    }

    const onChange = (selectedAttrOptionCombo) => {
        selectAttributeOptionCombo(selectedAttrOptionCombo)
    }

    const onChangeCatCombo = (catComboId) => {
        const catCombo = getAttributeComboById(metadata, catComboId)
        // Update the selected attribute combo and reset attribute combo value
        selectAttributeCombo(catCombo)
    }

    if (!workflow || Object.keys(workflow).length === 0) {
        return null
    }

    return (
        <>
            {showAttributeSelect && (
                <ContextSelect
                    dataTest="category-combo-context-select"
                    prefix={
                        attributeCombo?.displayName ||
                        i18n.t('Category Option Combo')
                    }
                    placeholder={
                        attrComboValue ||
                        i18n.t('Choose a category option combo')
                    }
                    open={open}
                    disabled={!(workflow?.id && period?.id && orgUnit?.id)}
                    onOpen={() => setOpenedSelect(CAT_OPTION_COMBO)}
                    onClose={() => setOpenedSelect('')}
                    requiredValuesMessage={getMissingSelectionsMessage()}
                    popoverMaxWidth={400}
                >
                    {/* Renders a SingleSelectField for each category */}
                    <div
                        className={css.menu}
                        style={{
                            height:
                                attributeCombos?.length == 1
                                    ? '250px'
                                    : '330px',
                        }}
                    >
                        {/* Only show Category Combo dropdown when there are more than one categoryCombo in the list */}
                        {attributeCombos?.length > 1 && (
                            <div className={css.attributeComboSelect}>
                                <SingleSelect
                                    placeholder={i18n.t('Choose a combination')}
                                    selected={attributeCombo?.id}
                                    onChange={({ selected }) =>
                                        onChangeCatCombo(selected)
                                    }
                                >
                                    {attributeCombos.map((catCombo) => (
                                        <SingleSelectOption
                                            key={`wf_${workflow?.id}_${catCombo?.id}`}
                                            value={catCombo.id}
                                            label={catCombo.displayName}
                                        />
                                    ))}
                                </SingleSelect>
                            </div>
                        )}

                        {attributeCombo && !attributeCombo.isDefault && (
                            <div className={css.categorySelectWrapper}>
                                <CategorySelect
                                    key={`catCombo_${workflow?.id}_${attributeCombo?.id}_${period?.id}_${orgUnit?.id}`}
                                    categoryCombo={attributeCombo}
                                    selected={attributeOptionCombo}
                                    onChange={onChange}
                                    onClose={() => setOpenedSelect('')}
                                />
                            </div>
                        )}
                    </div>
                </ContextSelect>
            )}
        </>
    )
}

export { AttributeComboSelect, CAT_OPTION_COMBO }
