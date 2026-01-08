import { renderHook } from '@testing-library/react'
import { useSelectionContext } from '../../selection-context/index.js'
import { useSelectedDataSet } from './use-selected-data-set.js'

jest.mock('../../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

describe('useSelectedDataSet', () => {
    it('should select the data set automatically if there is only one', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            dataSet: null,
            workflow: {
                dataSets: [
                    {
                        id: 'data-set-1',
                        displayName: 'Data set 1',
                        periodType: 'Monthly',
                    },
                ],
            },
        }))

        const { result } = renderHook(useSelectedDataSet)
        expect(result.current).toBe('data-set-1')
    })

    it('if there is more than one data set, do not select one automatically', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            dataSet: null,
            workflow: {
                dataSets: [
                    {
                        id: 'data-set-1',
                        displayName: 'Data set 1',
                        periodType: 'Monthly',
                    },
                    {
                        id: 'data-set-2',
                        displayName: 'Data set 2',
                        periodType: 'Monthly',
                    },
                ],
            },
        }))

        const { result } = renderHook(useSelectedDataSet)
        expect(result.current).toBe(null)
    })

    it('if there are no data sets, selection should be empty', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            dataSet: null,
            workflow: { dataSets: [] },
        }))

        const { result } = renderHook(useSelectedDataSet)
        expect(result.current).toBe(null)
    })

    it('should select the data set from the selection state', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            dataSet: 'data-set-2',
            workflow: {
                dataSets: [
                    {
                        id: 'data-set-1',
                        displayName: 'Data set 1',
                        periodType: 'Monthly',
                    },
                    {
                        id: 'data-set-2',
                        displayName: 'Data set 2',
                        periodType: 'Monthly',
                    },
                ],
            },
        }))
    })

    it('should ignore the data set from the selection state if it cannot be found', () => {
        useSelectionContext.mockImplementationOnce(() => ({
            dataSet: 'data-set-3',
            workflow: {
                dataSets: [
                    {
                        id: 'data-set-1',
                        displayName: 'Data set 1',
                        periodType: 'Monthly',
                    },
                    {
                        id: 'data-set-2',
                        displayName: 'Data set 2',
                        periodType: 'Monthly',
                    },
                ],
            },
        }))

        const { result } = renderHook(useSelectedDataSet)
        expect(result.current).toBe('data-set-2')
    })
})
