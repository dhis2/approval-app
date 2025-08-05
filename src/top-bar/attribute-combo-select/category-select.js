import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useAppContext } from '../../app-context/use-app-context.js'
import { cloneJSON } from '../../utils/array-utils.js'
import {
    findAttributeOptionCombo,
    getCategoriesByCategoryCombo,
} from '../../utils/category-combo-utils.js'
import css from './category-option-select.module.css'
import MultipleCategoySelect from './multiple-category-select.js'
import SingleCategoryMenu from './single-category-select.js'

const HideButton = ({ onClick }) => (
    <Button secondary className={css.hideButton} onClick={onClick}>
        {i18n.t('Hide menu')}
    </Button>
)

HideButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

/**
 *
 * @param categoryCombo An object which has an array of category objects (JSON), each options (to be rendered in a menu).
 * @param orgUnit An object
 * @param selected {<attribute option combo>}
 * @param onChange A function to handle changes in the selected options.
 * @param onClose A function to close the menu.
 *
 */
export default function CategorySelect({
    categoryCombo,
    onChange,
    onClose,
    selected, // attributeOptionCombo
}) {
    const { metadata } = useAppContext()

    const mapSelectedCategories = () => {
        const categoryMap = {}

        if (!selected) {
            return categoryMap
        }

        const categoryOptionIds = selected.categoryOptionIds

        // Go through "Categories" of catCombo to find "CategoryOption" we need
        const categories = getCategoriesByCategoryCombo(categoryCombo, metadata)
        for (const category of categories) {
            const foundCatOptionId = category.categoryOptionIds.filter((id) =>
                categoryOptionIds.includes(id)
            )

            if (foundCatOptionId) {
                categoryMap[category.id] = foundCatOptionId[0]
            }
        }

        return categoryMap
    }

    const [selectedItem, setSelectedItem] = useState(() =>
        mapSelectedCategories()
    )

    const categoryItemOnChange = (categoryId, selectedOptionId) => {
        let updatedSelected = cloneJSON(selectedItem)
        if (selectedItem) {
            updatedSelected[categoryId] = selectedOptionId
        } else {
            updatedSelected = {
                ...selectedItem,
                [categoryId]: selectedOptionId,
            }
        }
        setSelectedItem(updatedSelected)

        const selectedCatOptionCombo = findAttributeOptionCombo(
            metadata,
            updatedSelected
        )
        onChange(selectedCatOptionCombo)
    }

    const categories = getCategoriesByCategoryCombo(categoryCombo, metadata)

    // Check if there's exactly one category in the categories array and that category has at least one categoryOption
    if (categories.length === 1) {
        // Extracts the single category from the categories array
        const category = categories[0]
        const categoryOptions =
            category.categoryOptionIds.map(
                (id) => metadata.categoryOptions[id]
            ) ?? []

        if (categoryOptions.length === 0) {
            return (
                <>
                    <NoticeBox
                        className={css.noOptionsBox}
                        error
                        title={i18n.t('No available options')}
                    >
                        {i18n.t(
                            `There are no options for {{categoryName}} for the selected period or organisation unit.`,
                            { categoryName: category.displayName }
                        )}
                    </NoticeBox>

                    <HideButton onClick={() => onClose()} />
                </>
            )
        }

        if (categoryOptions.length > 1) {
            // Renders a MenuSelect for the single category with more than one category options
            return (
                <>
                    <SingleCategoryMenu
                        category={category}
                        selected={selectedItem}
                        onChange={categoryItemOnChange}
                    />

                    <HideButton onClick={() => onClose()} />
                </>
            )
        }
    }

    return (
        <div className={css.container}>
            <MultipleCategoySelect
                categories={categories}
                selected={selectedItem}
                onChange={categoryItemOnChange}
            />

            <HideButton onClick={() => onClose()} />
        </div>
    )
}

CategorySelect.propTypes = {
    categoryCombo: PropTypes.shape({
        categoryIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isDefault: PropTypes.bool.isRequired,
    }).isRequired,

    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    selected: PropTypes.object,
}
