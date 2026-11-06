import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { shallow } from 'enzyme'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { ContextSelect } from '../context-select/context-select.jsx'
import { WorkflowSelectOption } from './workflow-select-option.jsx'
import { WORKFLOW, WorkflowSelect } from './workflow-select.jsx'

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
    },
    {
        displayName: 'Workflow B',
        id: 'rIUL3hYOjJc',
    },
]

const createWorkflows = (count) =>
    Array.from({ length: count }, (_, index) => ({
        displayName: `Workflow ${index + 1}`,
        id: `workflow-${index + 1}`,
    }))

beforeEach(() => {
    useAppContext.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
    }))
    readQueryParams.mockImplementation(() => ({}))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('<WorkflowSelect>', () => {
    it('renders a ContextSelect with WorkflowSelectOptions', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)

        expect(wrapper.type()).toBe(ContextSelect)
        expect(wrapper.find(WorkflowSelectOption)).toHaveLength(2)
    })

    it('renders a placeholder text when no workflow is selected', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: '',
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))
        const wrapper = shallow(<WorkflowSelect />)
        const placeholder = 'Choose a workflow'

        expect(wrapper.find(ContextSelect).prop('value')).toBe(undefined)
        expect(wrapper.find(ContextSelect).prop('placeholder')).toBe(
            placeholder
        )
        expect(
            wrapper.find(ContextSelect).shallow().text().includes(placeholder)
        ).toBe(true)
    })

    it('renders a the value when a workflow is selected', () => {
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
        useAppContext.mockImplementation(() => ({
            dataApprovalWorkflows: [],
        }))
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

    it('hides the search input when there are fewer than 10 workflows', () => {
        useAppContext.mockImplementation(() => ({
            dataApprovalWorkflows: createWorkflows(9),
        }))
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const { queryByRole } = render(<WorkflowSelect />)

        expect(queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('filters workflows as the search text is typed', async () => {
        useAppContext.mockImplementation(() => ({
            dataApprovalWorkflows: createWorkflows(12),
        }))
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const { getAllByRole, getByRole, queryByText } = render(
            <WorkflowSelect />
        )
        await userEvent.type(getByRole('textbox'), 'Workflow 3')

        expect(getAllByRole('menuitem')).toHaveLength(1)
        expect(queryByText('Workflow 2')).not.toBeInTheDocument()
    })

    it('shows a message when the search has no matching workflows', async () => {
        useAppContext.mockImplementation(() => ({
            dataApprovalWorkflows: createWorkflows(12),
        }))
        useSelectionContext.mockImplementation(() => ({
            workflow: null,
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect: () => {},
        }))

        const { getByRole, getByText } = render(<WorkflowSelect />)
        await userEvent.type(getByRole('textbox'), 'xyz')

        expect(getByText('No results found for xyz')).toBeInTheDocument()
    })

    it('clears the search when the dropdown closes and reopens', async () => {
        useAppContext.mockImplementation(() => ({
            dataApprovalWorkflows: createWorkflows(12),
        }))
        useSelectionContext.mockImplementation(() => {
            const [openedSelect, setOpenedSelect] = React.useState('')

            return {
                workflow: null,
                openedSelect,
                selectWorkflow: () => {},
                setOpenedSelect,
            }
        })

        const { getAllByRole, getByRole, queryByRole } = render(
            <WorkflowSelect />
        )
        await userEvent.click(
            document.querySelector(
                '[data-test="workflow-context-select-button"]'
            )
        )
        await userEvent.type(getByRole('textbox'), 'xyz')

        const backdrop = document.querySelector(
            '[data-test="dhis2-uicore-layer"] > .backdrop'
        )
        await userEvent.click(backdrop)

        expect(queryByRole('textbox')).not.toBeInTheDocument()

        await userEvent.click(
            document.querySelector(
                '[data-test="workflow-context-select-button"]'
            )
        )

        expect(getByRole('textbox')).toHaveValue('')
        expect(getAllByRole('menuitem')).toHaveLength(12)
    })

    it('calls the setOpenedSelect to open when clicking the ContextSelect button', () => {
        const setOpenedSelect = jest.fn()
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

    // Refactored from Enzyme
    it('calls the setOpenedSelect to close when clicking the backdrop', async () => {
        const setOpenedSelect = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            openedSelect: WORKFLOW,
            selectWorkflow: () => {},
            setOpenedSelect,
        }))

        render(<WorkflowSelect />)

        // Janky way to select the backdrop, since it uses a portal
        const backdrop = document.querySelector(
            '[data-test="dhis2-uicore-layer"] > .backdrop'
        )
        await userEvent.click(backdrop)

        expect(setOpenedSelect).toHaveBeenCalledTimes(1)
        expect(setOpenedSelect).toHaveBeenCalledWith('')
    })
})
