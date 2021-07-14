import { useDataQuery } from '@dhis2/app-runtime'
import { Popover, Layer, OrganisationUnitTree, Tooltip } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { ContextSelect } from '../context-select/context-select.js'
import { useSelectionContext } from '../selection-context/index.js'
import { ORG_UNIT, OrgUnitSelect } from './org-unit-select.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataQuery: jest.fn(),
}))
jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

jest.mock('../../app-context/index.js', () => ({
    useAppContext: jest.fn(),
}))

jest.mock('../selection-context/index.js', () => ({
    useSelectionContext: jest.fn(),
}))

const mockWorkflows = [
    {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
    },
    {
        displayName: 'Workflow B',
        id: 'rIUL3hYOjJc',
        periodType: 'Daily',
    },
]
const mockOrgUnitRoots = [
    {
        id: 'ImspTQPwCqd',
        displayName: 'Sierra Leone',
    },
]

afterEach(() => {
    jest.resetAllMocks()
})

beforeEach(() => {
    useAppContext.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
        organisationUnits: mockOrgUnitRoots,
    }))
    readQueryParams.mockImplementation(() => ({}))
})

describe('<OrgUnitSelect>', () => {
    it('renders an OrganisationUnitTree in a ContextSelect', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)
        expect(wrapper.type()).toBe(ContextSelect)
        expect(wrapper.find(OrganisationUnitTree)).toHaveLength(1)
    })

    it('renders a placeholder text when no organisation unit is selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)

        expect(wrapper.find(ContextSelect).prop('value')).toBe(
            'Choose an organisation unit'
        )
    })

    it('renders the value when a organisation unit is selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {
                path: '/ImspTQPwCqd',
                displayName: 'test',
            },
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)

        expect(wrapper.find(ContextSelect).prop('value')).toBe('test')
    })

    it('opens the ContextSelect when the opened select matches "ORG_UNIT"', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {},
            openedSelect: ORG_UNIT,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)

        expect(wrapper.find(ContextSelect).prop('open')).toBe(true)
    })

    it('calls the setOpenedSelect to open when clicking the ContextSelect button', () => {
        const setOpenedSelect = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect,
        }))

        shallow(<OrgUnitSelect />)
            .find(ContextSelect)
            .dive()
            .find('button')
            .simulate('click')

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith(ORG_UNIT)
    })

    it('calls selectOrgUnit when clicking a node in the org unit tree', () => {
        useDataQuery.mockImplementation(() => ({
            error: null,
            loading: false,
            data: {
                ImspTQPwCqd: {
                    id: 'ImspTQPwCqd',
                    path: '/ImspTQPwCqd',
                    displayName: 'Sierra Leone',
                    children: [],
                },
            },
        }))
        const selectOrgUnit = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {},
            openedSelect: ORG_UNIT,
            selectOrgUnit,
        }))

        // This test is quite brittle due to this selector ¯\_(ツ)_/¯
        const clickableNode = shallow(<OrgUnitSelect />)
            .find(OrganisationUnitTree)
            .dive()
            .find('OrganisationUnitNode')
            .dive()
            .find('Node')
            .dive()
            .find('Label')
            .dive()
            .find('SingleSelectionLabel')
            .dive()
            .find('span')

        clickableNode.simulate('click')

        expect(selectOrgUnit).toHaveBeenCalledTimes(1)
        expect(selectOrgUnit).toHaveBeenCalledWith({
            displayName: 'Sierra Leone',
            id: 'ImspTQPwCqd',
            path: '/ImspTQPwCqd',
        })
    })

    it('calls the setOpenedSelect to close when clicking the backdrop', () => {
        const setOpenedSelect = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {},
            openedSelect: ORG_UNIT,
            selectWorkflow: () => {},
            setOpenedSelect,
        }))

        shallow(<OrgUnitSelect />)
            .find(ContextSelect)
            .dive()
            .find(Popover)
            .dive()
            .find(Layer)
            .simulate('click')

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith('')
    })

    it('displays the correct tooltip text when workflow and period have not been set yet', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const wrapper = shallow(<OrgUnitSelect />)
        const tooltip = wrapper.find(ContextSelect).dive().find(Tooltip)

        expect(tooltip.prop('content')).toBe(
            'Choose a workflow and period first'
        )
    })

    it('displays the correct tooltip text when period has not been set yet', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {},
            orgUnit: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const wrapper = shallow(<OrgUnitSelect />)
        const tooltip = wrapper.find(ContextSelect).dive().find(Tooltip)

        expect(tooltip.prop('content')).toBe('Choose a period first')
    })
})