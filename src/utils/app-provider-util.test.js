import { normalizeMetadata } from './app-provider-util.js'

const getNormalizedCategoryOptions = (categoryOptions, userOrgUnitPaths) =>
    normalizeMetadata({
        originalCatCombos: [],
        originalCategories: [
            {
                id: 'category',
                categoryOptions,
            },
        ],
        originalCategoryOptionCombos: [],
        organisationUnits: userOrgUnitPaths.map((path) => ({ path })),
    }).categoryOptions

describe('normalizeMetadata category option organisation units', () => {
    it('does not mutate the original categories when normalizing repeatedly', () => {
        const originalCategories = [
            {
                id: 'category',
                displayName: 'Category',
                categoryOptions: [{ id: 'option', organisationUnits: [] }],
            },
        ]

        const originalCategoriesSnapshot = JSON.parse(
            JSON.stringify(originalCategories)
        )

        const metadata = {
            originalCatCombos: [],
            originalCategories,
            originalCategoryOptionCombos: [],
            organisationUnits: [],
        }

        const firstResult = normalizeMetadata(metadata)
        const secondResult = normalizeMetadata(metadata)

        expect(originalCategories).toEqual(originalCategoriesSnapshot)
        expect(secondResult).toEqual(firstResult)
    })

    it('includes an option assigned to a descendant of a user org unit', () => {
        const categoryOptions = getNormalizedCategoryOptions(
            [
                {
                    id: 'option',
                    organisationUnits: [{ path: '/root/parent/child' }],
                },
            ],
            ['/root/parent']
        )

        expect(categoryOptions).toHaveProperty('option')
    })

    it('excludes an option assigned only to an ancestor of a user org unit', () => {
        const categoryOptions = getNormalizedCategoryOptions(
            [
                {
                    id: 'option',
                    organisationUnits: [{ path: '/root/parent' }],
                },
            ],
            ['/root/parent/child']
        )

        expect(categoryOptions).not.toHaveProperty('option')
    })

    it('includes an option assigned to the same org unit as the user', () => {
        const categoryOptions = getNormalizedCategoryOptions(
            [
                {
                    id: 'option',
                    organisationUnits: [{ path: '/root/parent' }],
                },
            ],
            ['/root/parent']
        )

        expect(categoryOptions).toHaveProperty('option')
    })

    it('excludes an option assigned to an org unit with a similar path prefix', () => {
        const categoryOptions = getNormalizedCategoryOptions(
            [
                {
                    id: 'option',
                    organisationUnits: [{ path: '/root/parent-other' }],
                },
            ],
            ['/root/parent']
        )

        expect(categoryOptions).not.toHaveProperty('option')
    })

    it('includes an option without assigned org units', () => {
        const categoryOptions = getNormalizedCategoryOptions(
            [{ id: 'option', organisationUnits: [] }],
            ['/root/parent']
        )

        expect(categoryOptions).toHaveProperty('option')
    })
})
