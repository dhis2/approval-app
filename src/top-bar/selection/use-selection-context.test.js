import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useCurrentUser } from '../../current-user/index.js'
import { pushStateToHistory } from '../../navigation/push-state-to-history.js'
import { readQueryParams } from '../../navigation/read-query-params.js'
import { SelectionProvider } from './selection-provider.js'
import { useSelectionContext } from './use-selection-context.js'

jest.mock('../../navigation/push-state-to-history.js', () => ({
    pushStateToHistory: jest.fn(),
}))

jest.mock('../../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

jest.mock('../../current-user/index.js', () => ({
    useCurrentUser: jest.fn(),
}))

afterEach(() => {
    jest.resetAllMocks()
})

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

beforeEach(() => {
    useCurrentUser.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
    }))
})

describe('useSelectionContext', () => {
    const wrapper = ({ children }) => (
        <SelectionProvider>{children}</SelectionProvider>
    )

    it('returns the expected properties', () => {
        readQueryParams.mockImplementation(() => ({}))

        const { result } = renderHook(() => useSelectionContext(), { wrapper })

        expect(result.current).toEqual(
            expect.objectContaining({
                workflow: expect.any(Object),
                period: expect.any(Object),
                orgUnit: expect.any(Object),
                openedSelect: expect.any(String),
                clearAll: expect.any(Function),
                setOpenedSelect: expect.any(Function),
                selectWorkflow: expect.any(Function),
                selectPeriod: expect.any(Function),
                selectOrgUnit: expect.any(Function),
            })
        )
    })

    it('populates properties from query params', () => {
        readQueryParams.mockImplementation(() => ({
            wf: 'rIUL3hYOjJc',
            pe: '20110203',
            ou: 'abc',
        }))

        const { result } = renderHook(() => useSelectionContext(), { wrapper })
        expect(result.current.workflow).toEqual(mockWorkflows[1])
        expect(result.current.period).toEqual(
            expect.objectContaining({
                displayName: '2011-02-03',
                endDate: '2011-02-03',
                id: '20110203',
                iso: '20110203',
                startDate: '2011-02-03',
                year: 2011,
            })
        )
        expect(result.current.orgUnit).toEqual({ path: 'abc' })
        // TODO: add tests for dealing with invalid query params
        // once that has been implemented for org-units too.
    })
    describe('functions returned from the hook update the state and url', () => {
        it('setOpenedSelect', () => {
            const mock = jest.fn()
            readQueryParams.mockImplementation(() => ({}))
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            const expectedOpenedSelect = 'test'
            act(() => {
                result.current.setOpenedSelect(expectedOpenedSelect)
            })
            expect(result.current.openedSelect).toEqual(expectedOpenedSelect)
            // Not captured in URL
            expect(mock).toHaveBeenCalledTimes(0)
        })

        it('selectWorkflow', () => {
            const mock = jest.fn()
            readQueryParams.mockImplementation(() => ({}))
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            const expectedWorkflow = { id: '123' }
            act(() => {
                result.current.selectWorkflow(expectedWorkflow)
            })
            expect(result.current.workflow).toEqual(expectedWorkflow)
            expect(mock).toHaveBeenCalledTimes(1)
        })

        it('selectPeriod', () => {
            const mock = jest.fn()
            readQueryParams.mockImplementation(() => ({}))
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            const expectedPeriod = { id: '20210202' }
            act(() => {
                result.current.selectPeriod(expectedPeriod)
            })
            expect(result.current.period).toEqual(expectedPeriod)
            expect(mock).toHaveBeenCalledTimes(1)
        })

        it('selectOrgUnit', () => {
            const mock = jest.fn()
            readQueryParams.mockImplementation(() => ({}))
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            const expectedOrgUnit = { path: '123' }
            act(() => {
                result.current.selectOrgUnit(expectedOrgUnit)
            })
            expect(result.current.orgUnit).toEqual(expectedOrgUnit)
            expect(mock).toHaveBeenCalledTimes(1)
        })

        it('clearAll', () => {
            const mock = jest.fn()
            readQueryParams.mockImplementation(() => ({
                wf: 'i5m0JPw4DQi',
                pe: '20120402',
            }))
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            expect(result.current.workflow).toEqual(mockWorkflows[0])
            expect(result.current.period).toEqual(
                expect.objectContaining({
                    displayName: '2012-04-02',
                    endDate: '2012-04-02',
                    id: '20120402',
                    iso: '20120402',
                    startDate: '2012-04-02',
                    year: 2012,
                })
            )

            act(() => {
                result.current.clearAll()
            })
            expect(result.current.openedSelect).toEqual('')
            expect(result.current.workflow).toEqual({})
            expect(result.current.period).toEqual({})
            expect(result.current.orgUnit).toEqual({})
            expect(mock).toHaveBeenCalledTimes(1)
        })
    })
})
