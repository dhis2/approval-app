import { useDataQuery } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import { shallow } from 'enzyme'
import React from 'react'
import { useSelectionContext } from '../selection-context/index.js'
import { ErrorMessage, Loader } from '../shared/index.js'
import { useWorkflowContext } from './use-workflow-context.js'
import { WorkflowProvider } from './workflow-provider.js'

jest.mock('../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => ({
    useDataQuery: jest.fn(),
}))

describe('<WorkflowProvider>', () => {
    const workflow = {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
        dataSets: [{ id: '123', displayName: 'Dataset Z' }],
    }

    const period = {
        displayName: '2012-04-04',
        endDate: '2012-04-04',
        id: '20120404',
        iso: '20120404',
        startDate: '2012-04-04',
    }

    const orgUnit = {
        id: '456',
        path: '/456',
        displayName: 'Org unit 456',
    }
    
    const attributeOptionCombo = { id: "wertyuiopas" }
    
    useSelectionContext.mockImplementation(() => ({
        workflow,
        period,
        orgUnit,
        attributeOptionCombo,
    }))

    it('shows a spinner when fetching', () => {
        useDataQuery.mockImplementation(() => ({
            fetching: true,
            called: true,
            refetch: () => {},
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.find(Loader)).toHaveLength(1)
    })

    it('shows an error message if there is an error fetching', () => {
        const message = 'Something went wrong'
        const error = new Error(message)

        useDataQuery.mockImplementation(() => ({
            fetching: false,
            called: true,
            refetch: () => {},
            error,
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.find(ErrorMessage)).toHaveLength(1)
    })

    it('renders the children once data has been received', () => {
        useDataQuery.mockImplementation(() => ({
            fetching: false,
            error: undefined,
            called: true,
            data: {
                approvalStatus: {
                    state: 'SOME_STATE_LABEL',
                    canApprove: true,
                },
            },
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.text()).toEqual(expect.stringContaining('Child'))
    })

    it('renders a loading spinner if called is false', () => {
        useDataQuery.mockImplementation(() => ({
            fetching: false,
            called: false,
            refetch: () => {},
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)

        expect(wrapper.find(Loader)).toHaveLength(1)
    })

    it('renders null if workflow is null', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            workflow: null,
            period,
            orgUnit,
            attributeOptionCombo,
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.type()).toBe(null)
    })

    it('renders null if period is null', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            workflow,
            period: null,
            orgUnit,
            attributeOptionCombo,
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.type()).toBe(null)
    })

    it('renders null if orgUnit is null', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            workflow,
            period,
            orgUnit: null,
            attributeOptionCombo: null,
        }))

        const wrapper = shallow(<WorkflowProvider>Child</WorkflowProvider>)
        expect(wrapper.type()).toBe(null)
    })

    it('refetches when the "refresh" callback is called', async () => {
        const refetch = jest.fn()

        useDataQuery.mockImplementation(() => ({
            refetch,
            error: null,
            fetching: false,
            called: true,
            data: {
                approvalStatus: {
                    state: 'APPROVABLE',
                    mayApprove: true,
                },
            },
        }))

        const wrapper = WorkflowProvider
        const { result } = renderHook(useWorkflowContext, { wrapper })

        expect(refetch).toHaveBeenCalledTimes(1) // initially called once
        result.current.refresh()
        expect(refetch).toHaveBeenCalledTimes(2)
    })
})
