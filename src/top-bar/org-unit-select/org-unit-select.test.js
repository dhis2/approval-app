import { CustomDataProvider } from '@dhis2/app-runtime'
import { Popover, OrganisationUnitTree, Tooltip } from '@dhis2/ui'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { shallow } from 'enzyme'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/context-select.js'
import { ApprovalStatusesProvider } from './approval-statuses.js'
import { ORG_UNIT, OrgUnitSelect } from './org-unit-select.js'

jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

jest.mock('../../app-context/index.js', () => ({
    useAppContext: jest.fn(),
}))

jest.mock('../../selection-context/index.js', () => ({
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
        path: '/ImspTQPwCqd',
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
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)
        expect(wrapper.type()).toBe(ContextSelect)
        expect(wrapper.find(OrganisationUnitTree)).toHaveLength(1)
    })

    it('is enabled if workflow and period have been set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: {
                id: '20120402',
            },
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)

        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(false)
    })

    it('is disabled if workflow and period have not been set yet', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)

        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(true)
    })

    it('renders a placeholder text when enabled but no organisation unit is selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: mockWorkflows[0],
            period: {
                id: '20120402',
            },
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)
        const placeholder = 'Choose an organisation unit'

        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(false)
        expect(wrapper.find(ContextSelect).prop('value')).toBe(undefined)
        expect(wrapper.find(ContextSelect).prop('placeholder')).toBe(
            placeholder
        )
        expect(
            wrapper.find(ContextSelect).shallow().text().includes(placeholder)
        ).toBe(true)
    })

    it('does not render placeholder text when disabled and no organisation unit is selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<OrgUnitSelect />)
        const placeholder = 'Choose an organisation unit'

        expect(wrapper.find(ContextSelect).prop('disabled')).toBe(true)
        expect(wrapper.find(ContextSelect).prop('value')).toBe(undefined)
        expect(wrapper.find(ContextSelect).prop('placeholder')).toBe(
            placeholder
        )
        expect(
            wrapper.find(ContextSelect).shallow().text().includes(placeholder)
        ).toBe(false)
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
            attributeOptionCombo: {
                id: "wertyuiopas"
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
            attributeOptionCombo: {},
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
            attributeOptionCombo: {},
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

    it('calls selectOrgUnit when clicking a node in the org unit tree', async () => {
        const selectOrgUnit = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: 'i5m0JPw4DQi',
            },
            period: {
                id: '20120402',
            },
            orgUnit: {},
            attributeOptionCombo: {},
            openedSelect: ORG_UNIT,
            selectOrgUnit,
        }))

        render(
            <CustomDataProvider
                data={{
                    organisationUnits: {
                        id: 'ImspTQPwCqd',
                        path: '/ImspTQPwCqd',
                        displayName: 'Sierra Leone',
                        children: [],
                    },
                }}
            >
                <ApprovalStatusesProvider>
                    <OrgUnitSelect />
                </ApprovalStatusesProvider>
            </CustomDataProvider>
        )

        await waitFor(() => screen.getByText('Sierra Leone'))
        userEvent.click(screen.getByText('Sierra Leone'))

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
            attributeOptionCombo: {},
            openedSelect: ORG_UNIT,
            selectWorkflow: () => {},
            setOpenedSelect,
        }))

        shallow(<OrgUnitSelect />)
            .find(ContextSelect)
            .dive()
            .find(Popover)
            .dive()
            .simulate('click')

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith('')
    })

    it('displays the correct tooltip text when workflow and period have not been set yet', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
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
            attributeOptionCombo: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const wrapper = shallow(<OrgUnitSelect />)
        const tooltip = wrapper.find(ContextSelect).dive().find(Tooltip)

        expect(tooltip.prop('content')).toBe('Choose a period first')
    })
})
