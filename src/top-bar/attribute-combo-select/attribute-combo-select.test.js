import { CustomDataProvider } from '@dhis2/app-runtime'
import { Popover, OrganisationUnitTree, Tooltip } from '@dhis2/ui'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { useAppContext } from '../../app-context/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/context-select.js'
import { CAT_OPTION_COMBO, AttributeComboSelect } from './attribute-combo-select.js'

// Mock dependencies
jest.mock('../../app-context/use-app-context', () => ({
    useAppContext: jest.fn(),
}));
jest.mock('../../selection-context/index', () => ({
    useSelectionContext: jest.fn(),
}));

jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

const mockWorkflows = [
    {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
        dataSets: [
            {
                name: "Data set 1",
                id: "dataset_1",
                periodType: "Daily",
                categoryCombo: {
                    id: "combo_1"
                },
            }
        ]
    },
    {
        displayName: 'Workflow B',
        id: 'rIUL3hYOjJc',
        periodType: 'Daily',
        dataSets: [
            {
                name: "Data set 2",
                id: "dataset_2",
                periodType: "Daily",
                categoryCombo: {
                    id: "combo_1"
                },
            }
        ]
    },
]
const mockOrgUnitRoots = [
    {
        id: 'ImspTQPwCqd',
        path: '/ImspTQPwCqd',
        displayName: 'Sierra Leone',
    },
]


beforeEach(() => {
    useAppContext.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
        organisationUnits: mockOrgUnitRoots,
        metadata: {
            categoryCombos: [
                {
                    displayName: "Combo 1",
                    id: "combo_1",
                    categories: [
                        {
                            name: "Category 1",
                            displayName: "Category 1",
                            id: "category_1",
                            categoryOptions: [
                                {
                                    displayName: "Option 1",
                                    id: "123"
                                },
                                {
                                    displayName: "Option 2",
                                    id: "456"
                                },
                            ]
                        }
                    ], 
                    categoryOptionCombos: [
                        {
                            categoryOptions: [{id: "123" }],
                            displayName: "Option Combo 1",
                            id: "wertyuiopas"
                        },
                        {
                            categoryOptions: [{id: "456" }],
                            displayName: "Option Combo 2",
                            id: "rewqtyuiops"
                        }
                    ],
                    isDefault: false
                },
            ]
        }
    }))
    readQueryParams.mockImplementation(() => ({}))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('<AttributeComboSelect>', () => {
    it('Do not render AttributeComboSelect if a workflow is not selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<AttributeComboSelect />)
        expect(wrapper.children()).toHaveLength(0);
    })
    
    it('is disabled if a period and an orgUnit have not been set', () => {
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
        
        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(true)
    })
    
    it('is disabled if an orgUnit has not been set', () => {
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

        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(true)
        wrapper.find(ContextSelect).shallow().text().includes('Choose an organisation unit first')
    })

    it('is disabled if a period has not been set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: null,
            orgUnit: {
                displayName: 'Sierra Leone',
                id: 'ImspTQPwCqd',
                path: '/ImspTQPwCqd'
            },
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        
        const wrapper = shallow(<AttributeComboSelect />)
        
        wrapper.find(ContextSelect).shallow().text().includes('Choose a period first')
    })
    
    it('is enabled if workflow, period and orgUnit have been set', async() => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: {
                id: '20120402',
            },
            orgUnit: mockOrgUnitRoots[0],
            attributeOptionCombo: {},
            openedSelect: '',
            selectAttributeOptionCombo: () => {},
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        
        const wrapper = mount(<AttributeComboSelect />)
        // Wait for the useEffect to execute
        await act(async () => {
            wrapper.update(); // Ensure updates are applied without delay
        });
       
        // Assert that ContextSelect is enabled (not disabled)
        const contextSelect = wrapper.find(ContextSelect)
        expect(contextSelect.exists()).toBe(true);  // Ensure the component exists
        expect(contextSelect.prop('disabled')).toBe(false) // Assert the disabled prop is false
        expect(contextSelect.prop("placeholder")).toBe('0 selections')
    })
    
    // it('renders the value when a category option combo is selected', async() => {
    //     useSelectionContext.mockImplementation(() => ({
    //         workflow: {
    //             id: 'i5m0JPw4DQi',
    //         },
    //         period: {
    //             id: '20120402',
    //         },
    //         orgUnit: mockOrgUnitRoots[0],
    //         attributeOptionCombo: {
    //             id: "wertyuiopas",
    //             displayName: "Option Combo 1",
    //             categoryOptions: [{
    //                 id: "123"
    //             }]
    //         },
    //         openedSelect: '',
    //         selectAttributeOptionCombo: () => {},
    //         selectWorkflow: () => {},
    //         setOpenedSelect: () => {},
    //     }))
    //     // const wrapper = shallow(<AttributeComboSelect />)
    //     // // Wait for the useEffect to execute
    //     // await act(async () => {
    //     //     wrapper.update(); // Ensure updates are applied without delay
    //     // });
        
    //     // expect(wrapper.find(ContextSelect).shallow().text().includes('1 selection')).toBe(true)
        
    //     const wrapper = mount(<AttributeComboSelect />)
    //     // Wait for the useEffect to execute
    //     await act(async () => {
    //         wrapper.update(); // Ensure updates are applied without delay
    //     });
       
    //     // Assert that ContextSelect is enabled (not disabled)
    //     const contextSelect = wrapper.find(ContextSelect)
    //     expect(contextSelect.exists()).toBe(true);  // Ensure the component exists
    //     expect(contextSelect.prop("placeholder")).toBe('1 selections')
    // })

})
