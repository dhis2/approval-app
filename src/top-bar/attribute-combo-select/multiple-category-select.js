import i18n from '@dhis2/d2-i18n'
import { NoticeBox, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
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
    onChange,
}) {
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
                    <div className={css.selectContainer}>
                        <SingleSelectField
                            filterable
                            label={displayName}
                            noMatchText={i18n.t('No options found')}
                            selected={selected[id] || null}
                            onChange={(selectedItem) =>
                                onChange(id, selectedItem.selected)
                            }
                        >
                            {categoryOptions.map((item) => (
                                <SingleSelectOption
                                    key={item.id}
                                    label={item.displayName}
                                    value={item.id}
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
