import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useAppContext } from '../app-context/index.js'
import { pushStateToHistory } from '../navigation/push-state-to-history.js'
import { readQueryParams } from '../navigation/read-query-params.js'
import { SelectionProvider } from './selection-provider.js'
import { useSelectionContext } from './use-selection-context.js'

jest.mock('../navigation/push-state-to-history.js', () => ({
    pushStateToHistory: jest.fn(),
}))

jest.mock('../navigation/read-query-params.js', () => ({
    readQueryParams: jest.fn(),
}))

jest.mock('../app-context/index.js', () => ({
    useAppContext: jest.fn(),
}))

// expect.any(Object) works with `null`, exect.any(String) does not
expect.extend({
    string(received) {
        const message = () =>
            `expected null or string, but received ${this.utils.printReceived(
                received
            )}`

        if (received === null) {
            return { pass: true, message }
        }

        const pass = typeof received == 'string' || received instanceof String
        return { pass, message }
    },
})
const metadata = {
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
            ],
            isDefault: false
        },
    ]
};

const dataSetOne = {
                name: "Data set 1",
                id: "dataset_1",
                periodType: "Daily",
                categoryCombo: {
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
                    ],
                    isDefault: false
                },
            }
const mockWorkflows = [
    {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
        dataSets: [
            dataSetOne
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
                    ],
                    isDefault: false
                },
                organisationUnits: [
                    {id: 'ou-1', displayName: 'Org unit 1', path: '/ou-1'},
                    {id: 'ou-2', displayName: 'Org unit 2', path: '/ou-2'},
                ]
            }
        ]
    },
]

beforeEach(() => {
    useAppContext.mockImplementation(() => ({
        dataApprovalWorkflows: mockWorkflows,
        metadata
    }))
    readQueryParams.mockImplementation(() => ({}))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('useSelectionContext', () => {
    const wrapper = ({ children }) => (
        <SelectionProvider>{children}</SelectionProvider>
    )

    it('returns the expected properties', () => {
        const { result } = renderHook(() => useSelectionContext(), { wrapper })

        expect(result.current).toEqual({
            workflow: null,
            period: null,
            orgUnit: null,
            attributeCombo: undefined,
            attributeOptionCombo: undefined,
            dataSet: null,
            openedSelect: expect.any(String),
            clearAll: expect.any(Function),
            setOpenedSelect: expect.any(Function),
            selectWorkflow: expect.any(Function),
            selectPeriod: expect.any(Function),
            selectOrgUnit: expect.any(Function),
            selectAttributeOptionCombo: expect.any(Function),
            selectAttributeCombo: expect.any(Function),
            selectDataSet: expect.any(Function),
        })
    })

    it('populates properties from query params', () => {
        readQueryParams.mockImplementation(() => ({
            wf: 'rIUL3hYOjJc',
            pe: '20110203',
            ou: '/ou-1',
            aoc: "wertyuiopas",
            dataSet: dataSetOne.id,
            ouDisplayName: 'Org unit 1',
        }))

        const { result } = renderHook(() => useSelectionContext(), { wrapper })
        expect(result.current.dataSet).toEqual('dataset_1')
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
        expect(result.current.orgUnit).toEqual({
           id: 'ou-1', 
           displayName: 'Org unit 1', 
           path: '/ou-1',
        })

        expect(result.current.attributeOptionCombo).toEqual({
            categoryOptions: [ { id: '123' } ],
            displayName: 'Option Combo 1',
            id: 'wertyuiopas'
        })

    })

    describe('functions returned from the hook update the state and url', () => {
        it('setOpenedSelect', () => {
            const mock = jest.fn()
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
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })

            act(() => {
                result.current.selectDataSet(dataSetOne)
            })
            expect(result.current.dataSet.id).toBe(dataSetOne.id)
            mock.mockClear()

            const expectedWorkflow = mockWorkflows[1];
            act(() => {
                result.current.selectWorkflow(expectedWorkflow)
            })
            expect(result.current).toEqual(
                expect.objectContaining({
                    workflow: expectedWorkflow,
                    dataSet: null,
                })
            )
            expect(mock).toHaveBeenCalledTimes(1)
        })

        it('selectPeriod', () => {
            const mock = jest.fn()
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })

            act(() => {
                result.current.selectDataSet(dataSetOne)
            })
            expect(result.current.dataSet.id).toBe(dataSetOne.id)
            mock.mockClear()

            const expectedPeriod = { id: '20210202' }
            act(() => {
                result.current.selectPeriod(expectedPeriod)
            })
            expect(result.current).toEqual(
                expect.objectContaining({
                    period: expectedPeriod,
                    dataSet: null,
                })
            )
            expect(mock).toHaveBeenCalledTimes(1)
        })

        it('selectOrgUnit', () => {
            const mock = jest.fn()
            pushStateToHistory.mockImplementation(mock)
            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })
            act(() => {
                result.current.selectDataSet(dataSetOne)
            })
            expect(result.current.dataSet.id).toBe(dataSetOne.id)
            mock.mockClear()

            const expectedOrgUnit = {id: 'ou-1', displayName: 'Org unit 1', path: '/ou-1'}
         
            act(() => {
                result.current.selectWorkflow(mockWorkflows[1])
                result.current.selectPeriod({ id: '20210202' })
                result.current.selectOrgUnit(expectedOrgUnit)
            })
                     
            expect(result.current).toEqual(
                expect.objectContaining({
                    orgUnit: expectedOrgUnit,
                    dataSet: null,
                })
            )
            expect(mock).toHaveBeenCalledTimes(1)
        })


        it('selectAttributeOptionCombo', () => {
            const mock = jest.fn()
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })

            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            const expectedAttributeOptionCombo = { id: 'wertyuiopas' }
            act(() => { 
                result.current.selectWorkflow(mockWorkflows[1])
                result.current.selectPeriod({ id: '20210202' })
                result.current.selectOrgUnit({id: 'ou-1', displayName: 'Org unit 1', path: '/ou-1'})
                result.current.selectAttributeOptionCombo(expectedAttributeOptionCombo)
            })
            expect(result.current).toEqual(
                expect.objectContaining({
                    attributeOptionCombo: expectedAttributeOptionCombo
                })
            )
            expect(mock).toHaveBeenCalledTimes(1)
        })


        it('selectDataSet', () => {
            const mock = jest.fn()
            pushStateToHistory.mockImplementation(mock)

            const { result } = renderHook(() => useSelectionContext(), {
                wrapper,
            })

            // Reset count to 0 because the function is also called on initial render
            mock.mockClear()

            act(() => {
                result.current.selectDataSet(dataSetOne)
            })
            expect(result.current.dataSet.id).toBe(dataSetOne.id)
            
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
            expect(result.current.workflow).toEqual(null)
            expect(result.current.period).toEqual(null)
            expect(result.current.orgUnit).toEqual(null)
            expect(result.current.attributeOptionCombo).toEqual(null)
            expect(mock).toHaveBeenCalledTimes(1)
        })
    })
})
