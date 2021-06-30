import { Popover, Layer } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { useCurrentUser } from '../../current-user/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { ContextSelect } from '../context-select/context-select.js'
import { useSelectionContext } from '../selection/index.js'
import { WorkflowSelectOption } from './workflow-select-option.js'
import { WORKFLOW, WorkflowSelect } from './workflow-select.js'

jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

jest.mock('../../current-user/index.js', () => ({
    useCurrentUser: jest.fn(),
}))

jest.mock('../selection/index.js', () => ({
    useSelectionContext: jest.fn(),
}))

afterEach(() => {
    jest.resetAllMocks()
})

describe('<WorkflowSelect>', () => {
    const mockWorkflows = [
        {
            displayName: 'Workflow a',
            id: 'i5m0JPw4DQi',
        },
        {
            displayName: 'Workflow B',
            id: 'rIUL3hYOjJc',
        },
    ]

    it('renders a ContextSelect with WorkflowSelectOptions', () => {
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(wrapper.type()).toBe(ContextSelect)
        expect(wrapper.find(WorkflowSelectOption)).toHaveLength(2)
    })

    it('renders a placeholder text when no workflow is selected', () => {
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(wrapper.find(ContextSelect).prop('value')).toBe(
            'Choose a workflow'
        )
    })

    it('renders a the value when a workflow is selected', () => {
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: '123',
                displayName: 'test',
            },
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(wrapper.find(ContextSelect).prop('value')).toBe('test')
    })

    it('opens the ContextSelect when the opened select matches "WORKFLOW"', () => {
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(wrapper.find(ContextSelect).prop('open')).toBe(true)
    })

    it('shows an info message when no workflows have been found', () => {
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: [],
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(
            wrapper
                .find('div.message')
                .containsMatchingElement(
                    'No workflows found. None may exist, or you may not have access to any.'
                )
        ).toBe(true)
    })

    it('calls the setOpenedSelect to open when clicking the ContextSelect button', () => {
        const setOpenedSelect = jest.fn()
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect,
        }))
        shallow(<WorkflowSelect />)
            .find(ContextSelect)
            .dive()
            .find('button')
            .simulate('click')

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith(WORKFLOW)
    })

    it('calls the selectWorkflow when clicking a WorkflowSelectOptions', () => {
        const selectWorkflow = jest.fn()
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: '',
            selectWorkflow,
            setOpenedSelect: () => {},
        }))

        shallow(<WorkflowSelect />)
            .find(WorkflowSelectOption)
            .first()
            .simulate('click')

        expect(selectWorkflow).toHaveBeenCalledTimes(1)
        expect(selectWorkflow).toHaveBeenCalledWith(mockWorkflows[0])
    })

    it('calls the setOpenedSelect to open when clicking the ContextSelect button', () => {
        const setOpenedSelect = jest.fn()
        useCurrentUser.mockImplementation(() => ({
            dataApprovalWorkflows: mockWorkflows,
        }))
        readQueryParams.mockImplementation(() => ({}))
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect,
        }))

        shallow(<WorkflowSelect />)
            .find(ContextSelect)
            .dive()
            .find(Popover)
            .dive()
            .find(Layer)
            .simulate('click')

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith('')
    })
})
