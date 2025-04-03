import i18n from '@dhis2/d2-i18n'
import {
    NoticeBox,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import css from './category-option-select.module.css'

/**
 * 
 * @param categoryCombo An object which has an array of category objects (JSON), each options (to be rendered in a menu).
 * @param orgUnit An object
 * @param selected {<categoryId_1>: <catOptionId_1>, <categoryId_2>: <catOptionId_2>, ...}
 * @param onChange A function to handle changes in the selected options.
 * @param onClose A function to close the menu.
 * 
 */
export default function MultipleCategoySelect({
    categories,
    selected,
    onChange
}) {
    // const [selectedItem, setSelectedItem] = useState(selected)
    useEffect(() => {
        
    }, [selected])
    
    return (
        <div className={css.inputs}>
            {/* Categories Dropdown */}
            {categories.map(({ id, displayName, categoryOptions }) => 
                categoryOptions.length === 0 ? (
                    <NoticeBox
                        className={css.noOptionsBox}
                        error
                        title={i18n.t('No available options')}
                    >
                        {i18n.t(
                            `There are no options for {{categoryName}} for the selected period or organisation unit.`,
                            { categoryName: displayName }
                        )}
                    </NoticeBox>
                ) : (
                    // Renders a SingleSelectField for each category
                    <div className={css.inputWrapper} key={id}>
                        <SingleSelectField
                            label={displayName} // The category's displayName.
                            selected={selected[id]} // Current selected option ID.
                            onChange={({ selected }) => onChange(id, selected)}
                        >
                            {categoryOptions.map(({ id, displayName }) => (
                                <SingleSelectOption
                                    key={id}
                                    value={id}
                                    label={displayName}
                                    className={css.dropdown}
                                />
                            ))}
                        </SingleSelectField>
                    </div>
                )
            )}
            
        </div>
    )
}

MultipleCategoySelect.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            categoryOptions: PropTypes.arrayOf(
                PropTypes.shape({
                    displayName: PropTypes.string.isRequired,
                    id: PropTypes.string.isRequired,
                })
            ).isRequired,
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })
    ).isRequired,

    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
}