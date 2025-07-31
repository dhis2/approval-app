import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { useAppContext } from '../../app-context/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/context-select.js'
import { AttributeComboSelect } from './attribute-combo-select.js'

jest.mock('../../app-context/use-app-context', () => ({
    useAppContext: jest.fn(),
}))
jest.mock('../../selection-context/index', () => ({
    useSelectionContext: jest.fn(),
}))

jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

const mockDataSets = [
    {
        name: 'Data set 1',
        id: 'dataset_1',
        periodType: 'Daily',
        categoryCombo: {
            id: 'combo_1',
        },
        organisationUnits: [
            { id: 'ou-1', displayName: 'Org unit 1', path: '/ou-1' },
            { id: 'ou-2', displayName: 'Org unit 2', path: '/ou-2' },
        ],
    },
]

const mockWorkflows = [
    {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
        dataSets: mockDataSets,
    },
    {
        displayName: 'Workflow B',
        id: 'rIUL3hYOjJc',
        periodType: 'Daily',
        dataSets: [
            {
                name: 'Data set 2',
                id: 'dataset_2',
                periodType: 'Daily',
                categoryCombo: {
                    id: 'combo_1',
                },
                organisationUnits: [
                    { id: 'ou-1', displayName: 'Org unit 1' },
                    { id: 'ou-2', displayName: 'Org unit 2' },
                ],
            },
        ],
    },
]

const mockOrgUnitRoots = [
    {
        id: 'ou-1',
        path: '/ou-1',
        displayName: 'Org unit 1',
    },
]

const mockCategoryCombo = {
    id: 'combo_1',
    displayName: 'Combo 1',
    categories: [
        {
            id: 'category_1',
            displayName: 'Category 1',
            categoryOptions: [
                { id: '123', displayName: 'Option 1' },
                { id: '456', displayName: 'Option 2' },
            ],
        },
    ],
    categoryOptionCombos: [
        {
            id: 'wertyuiopas',
            displayName: 'Option Combo 1',
            categoryOptions: [{ id: '123' }],
        },
        {
            id: 'rewqtyuiops',
            displayName: 'Option Combo 2',
            categoryOptions: [{ id: '456' }],
        },
    ],
    isDefault: false,
}

beforeEach(() => {
    useAppContext.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
        organisationUnits: mockOrgUnitRoots,
        metadata: {
            categoryCombos: [mockCategoryCombo],
        },
    }))
    readQueryParams.mockImplementation(() => ({}))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('<AttributeComboSelect>', () => {
    it('does not render AttributeComboSelect if a workflow is not selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeCombo: () => {},
            selectAttributeOptionCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<AttributeComboSelect />)
        expect(wrapper.children()).toHaveLength(0)
    })

    it('does not render if a period and an orgUnit have not been set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: null,
            orgUnit: null,
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectPeriod: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<AttributeComboSelect />)

        expect(wrapper.children()).toHaveLength(0)
    })

    it('does not render if an orgUnit has not been set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: {
                id: '201204',
                displayName: 'April 2012',
            },
            orgUnit: null,
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectPeriod: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<AttributeComboSelect />)

        expect(wrapper.children()).toHaveLength(0)
    })

    it('does not render if a period has not been set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: null,
            orgUnit: {
                displayName: 'Sierra Leone',
                id: 'ImspTQPwCqd',
                path: '/ImspTQPwCqd',
            },
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const wrapper = shallow(<AttributeComboSelect />)

        expect(wrapper.children()).toHaveLength(0)
    })

    it('is enabled if workflow, period and orgUnit have been set', async () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: {
                id: '20120402',
            },
            orgUnit: mockOrgUnitRoots[0],
            attributeOptionCombo: null,
            openedSelect: 'CAT_OPTION_COMBO',
            selectAttributeOptionCombo: () => {},
            selectAttributeCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
            attributeCombo: mockCategoryCombo,
            showAttributeSelect: true,
            attributeCombos: [mockCategoryCombo],
            attrComboValue: '0 selections',
        }))

        const wrapper = mount(<AttributeComboSelect />)

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0))
            wrapper.update()
        })

        const contextSelect = wrapper.find(ContextSelect)
        expect(contextSelect.exists()).toBe(true) // Ensure the component exists
        expect(contextSelect.prop('disabled')).toBe(false)
        expect(contextSelect.prop('placeholder')).toBe('0 selections')
    })
})
