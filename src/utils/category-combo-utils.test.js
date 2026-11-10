import { findAttributeOptionCombo } from './category-combo-utils.js'

describe('findAttributeOptionCombo', () => {
    it('finds a matching option combo regardless of ID order without changing input arrays', () => {
        const categoryCombo = {
            id: 'category-combo',
            categoryIds: ['category-b', 'category-a'],
        }
        const matchingOptionCombo = {
            id: 'matching-option-combo',
            categoryCombo: { id: 'category-combo' },
            categoryOptionIds: ['option-b', 'option-a'],
        }
        const categoryIdsBefore = [...categoryCombo.categoryIds]
        const optionIdsBefore = [...matchingOptionCombo.categoryOptionIds]

        const result = findAttributeOptionCombo({
            metadata: {
                categoryOptionCombos: {
                    [matchingOptionCombo.id]: matchingOptionCombo,
                },
            },
            categoryCombo,
            categoryOptionMap: {
                'category-a': 'option-a',
                'category-b': 'option-b',
            },
        })

        expect(result).toBe(matchingOptionCombo)
        expect(categoryCombo.categoryIds).toEqual(categoryIdsBefore)
        expect(matchingOptionCombo.categoryOptionIds).toEqual(optionIdsBefore)
    })

    it('returns null when no option combo matches without changing input arrays', () => {
        const categoryCombo = {
            id: 'category-combo',
            categoryIds: ['category-b', 'category-a'],
        }
        const otherOptionCombo = {
            id: 'other-option-combo',
            categoryCombo: { id: 'category-combo' },
            categoryOptionIds: ['other-option-a', 'other-option-b'],
        }
        const categoryIdsBefore = [...categoryCombo.categoryIds]
        const optionIdsBefore = [...otherOptionCombo.categoryOptionIds]

        const result = findAttributeOptionCombo({
            metadata: {
                categoryOptionCombos: {
                    [otherOptionCombo.id]: otherOptionCombo,
                },
            },
            categoryCombo,
            categoryOptionMap: {
                'category-a': 'option-a',
                'category-b': 'option-b',
            },
        })

        expect(result).toBeNull()
        expect(categoryCombo.categoryIds).toEqual(categoryIdsBefore)
        expect(otherOptionCombo.categoryOptionIds).toEqual(optionIdsBefore)
    })
})
