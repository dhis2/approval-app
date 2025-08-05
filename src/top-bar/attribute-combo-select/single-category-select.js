import i18n from '@dhis2/d2-i18n'
import { Menu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../app-context/use-app-context.js'
import css from './single-category-select.module.css'

export default function SingleCategoryMenu({ category, selected, onChange }) {
    const { metadata } = useAppContext()
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {}, [selected])

    // Filter categoryOptions based on the search query
    const filteredCategoryOptions = category.categoryOptionIds
        .filter((catOptionId) => {
            const catOption = metadata.categoryOptions[catOptionId]
            return catOption.displayName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        })
        .map((catOptionId) => metadata.categoryOptions[catOptionId])

    return (
        <>
            {/* Search Input */}
            <div className={css.inputContainer}>
                <input
                    type="text"
                    placeholder={i18n.t('Type to filter options')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={css.searchInput}
                />
            </div>

            {filteredCategoryOptions.length === 0 ? (
                <div className={css.empty}>
                    <span>
                        {i18n.t('No results found for {{searchQuery}}')}
                    </span>
                </div>
            ) : (
                <Menu className={css.menu}>
                    {filteredCategoryOptions.map((catOption) => (
                        <MenuItem
                            key={`${category.id}-${catOption.id}`}
                            className={css.bordered}
                            active={selected[category.id] === catOption.id}
                            onClick={() => onChange(category.id, catOption.id)}
                            label={
                                <span data-value={catOption.id}>
                                    {catOption.displayName}
                                </span>
                            }
                        />
                    ))}
                </Menu>
            )}
        </>
    )
}

SingleCategoryMenu.propTypes = {
    category: PropTypes.shape({
        categoryOptionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
}
