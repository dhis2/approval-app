import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useSelectionContext } from '../selection-context/use-selection-context.js'
import { useWorkflowContext } from './use-workflow-context.js'
import { WorkflowProvider } from './workflow-provider.js'

jest.mock('../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

jest.mock('@dhis2/app-runtime', () => ({
    useDataQuery: jest.fn(() => ({
        loading: false,
        error: null,
        data: {
            approvalStatus: {
                state: 'SOME_STATE_LABEL',
                canApprove: true,
            },
        },
        called: true,
        refetch: () => {},
    })),
}))

describe('useWorkflowContext', () => {
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

    it('combines data from various hooks', () => {
        const wrapper = ({ children }) => (
            <WorkflowProvider>{children}</WorkflowProvider>
        )

        const { result } = renderHook(() => useWorkflowContext(), { wrapper })

        expect(result.current.refresh).toBeInstanceOf(Function)
        expect(result.current).toEqual(
            expect.objectContaining({
                allowedActions: {
                    canApprove: true,
                },
                approvalStatus: 'SOME_STATE_LABEL',
            })
        )
    })
})
