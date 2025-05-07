import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Select from 'react-select'
import css from './category-option-select.module.css'
import 'react-select/dist/react-select.css'

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
    // const [searchQueries, setSearchQueries] = useState({})

    useEffect(() => {}, [selected])

    // // Filter categoryOptions based on the search query
    // const filterCategoryOptions = (categoryId, categoryOptions) => {
    //     const searchKey = searchQueries[categoryId] || "";
    //     return categoryOptions.filter(
    //         (catOption) =>
    //             catOption.displayName
    //                 .toLowerCase()
    //                 .includes(searchKey.toLowerCase())
    //     )
    // }

    // const setSearchKey = (id, value) => {
    //     setSearchQueries((prev) => ({
    //         ...prev,
    //         [id]: value,
    //     }));

    // }

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
                        <label htmlFor={`search-${id}`} className={css.label}>
                            {displayName}
                        </label>
                        <Select
                            classNamePrefix="select"
                            id={`search-${id}`}
                            options={categoryOptions.map(item => ({
                                value: item.id,
                                label: item.displayName,
                                original: item, // optional: keep reference to original
                              }))}
                            onChange={(selected) => onChange(id, selected ? selected.original.id : null)}
                            value={selected[id]}
                            placeholder={displayName}
                            isSearchable
                            getOptionLabel={(e) => e.displayName}
                        />
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
