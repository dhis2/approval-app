import { CustomDataProvider } from '@dhis2/app-runtime'
import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useAppContext } from '../../app-context/index.js'
import { SelectionContext } from '../../selection-context/index.js'
import { Display } from './display.js'

jest.mock('../../app-context/index.js', () => ({
    useAppContext: jest.fn(),
}))

beforeEach(() => {
    useAppContext.mockImplementation(() => ({
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
                    ],
                    isDefault: false
                },
            ]
        }
    }))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('<Display>', () => {
    const dataSetOne = {
        displayName: 'Mortality < 5 years',
        id: 'pBOMPrpg1QX',
        periodType: 'Monthly',
        categoryCombo: {
            id: "combo_1"
        }
    }

    const dataSetTwo = {
        displayName: 'Mortality > 4 years',
        id: 'pBOMPrpg1QZ',
        periodType: 'Monthly',
        categoryCombo: {
            displayName: "Combo 1",
            id: "combo_1"
        }
    }

    it('asks the user to select a data set if none is selected', () => {
        render(
            <CustomDataProvider options={{ loadForever: true }}>
                <SelectionContext.Provider
                    value={{
                        workflow: {
                            dataApprovalLevels: [],
                            dataSets: [dataSetOne, dataSetTwo],
                            displayName: 'Workflow 1',
                            id: 'foo',
                            periodType: 'Monthly',
                        },
                    }}
                >
                    <Display dataSetId={null} />
                </SelectionContext.Provider>
            </CustomDataProvider>
        )

        expect(screen.getByRole('heading')).toHaveTextContent(
            'Choose a data set to review'
        )
        expect(
            screen.getByText(
                `Workflow 1 has multiple data sets. Choose a data set from the tabs above.`
            )
        ).toBeInTheDocument()
    })

    it('shows a message if the workflow has no data sets', () => {
        render(
            <CustomDataProvider options={{ loadForever: true }}>
                <SelectionContext.Provider
                    value={{
                        workflow: {
                            dataApprovalLevels: [],
                            dataSets: [],
                            displayName: 'Workflow 1',
                            id: 'foo',
                            periodType: 'Monthly',
                        },
                    }}
                >
                    <Display dataSetId={null} />
                </SelectionContext.Provider>
            </CustomDataProvider>
        )
        expect(
            screen.getByText(`This workflow does not contain any data sets.`)
        ).toBeInTheDocument()
    })

    it('renders a loading spinner if a data set is selected', () => {
        render(
            <CustomDataProvider options={{ loadForever: true }}>
                <SelectionContext.Provider
                    value={{
                        attributeOptionCombo: {
                            id: "wertyuiopas",
                            displayName: "Option Combo 1",
                            categoryOptions: [{
                                id: "123"
                            }]
                        },
                        orgUnit: {
                            id: 'ou-2',
                            path: '/ou-2',
                            displayName: 'Org unit 2',
                        },
                        period: {
                            displayName: 'January 2021',
                            startDate: '2021-01-01',
                            endDate: '2021-01-31',
                            year: 2021,
                            iso: '202101',
                            id: '202101',
                        },
                        workflow: {
                            dataSets: [dataSetOne, dataSetTwo],
                            dataApprovalLevels: [],
                            displayName: 'Workflow 1',
                            periodType: 'Monthly',
                            id: 'foo',
                        },
                    }}
                >
                    <Display dataSetId="pBOMPrpg1QX" />
                </SelectionContext.Provider>
            </CustomDataProvider>
        )

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
        expect(screen.getByText('Loading data set')).toBeInTheDocument()
    })

    it('shows an error notice with a retry button if there was an error fetching the data set report', async () => {
        const data = {}
        render(
            <CustomDataProvider data={data}>
                <SelectionContext.Provider
                    value={{
                        attributeOptionCombo: {
                            id: "wertyuiopas",
                            displayName: "Option Combo 1",
                            categoryOptions: [{
                                id: "123"
                            }]
                        },
                        orgUnit: {
                            id: 'ou-2',
                            path: '/ou-2',
                            displayName: 'Org unit 2',
                        },
                        period: {
                            displayName: 'January 2021',
                            startDate: '2021-01-01',
                            endDate: '2021-01-31',
                            year: 2021,
                            iso: '202101',
                            id: '202101',
                        },
                        workflow: {
                            dataSets: [dataSetOne, dataSetTwo],
                            dataApprovalLevels: [],
                            displayName: 'Workflow 1',
                            periodType: 'Monthly',
                            id: 'foo',
                        },
                    }}
                >
                    <Display dataSetId="pBOMPrpg1QX" />
                </SelectionContext.Provider>
            </CustomDataProvider>
        )

        await waitFor(() => screen.getByRole('heading'))

        expect(screen.getByRole('heading')).toHaveTextContent(
            'There was a problem displaying this data set'
        )
        expect(
            screen.getByText(
                `This data set couldn't be loaded or displayed. Try again, or contact your system administrator.`
            )
        ).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveTextContent(
            'Retry loading data set'
        )

        data.dataSetReport = []
        userEvent.click(screen.getByRole('button', 'Retry loading data set'))
        await waitFor(() => screen.getByRole('progressbar'))

        await waitFor(() => {
            expect(
                screen.queryByRole(
                    'heading',
                    'There was a problem displaying this data set'
                )
            ).not.toBeInTheDocument()
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
        })
    })

    it('shows a message if the data set report has no data for the seleted period and organisation unit', async () => {
        const data = {
            dataSetReport: [],
        }
        render(
            <CustomDataProvider data={data}>
                <SelectionContext.Provider
                    value={{
                        attributeOptionCombo: {
                            id: "wertyuiopas",
                            displayName: "Option Combo 1",
                            categoryOptions: [{
                                id: "123"
                            }]
                        },
                        orgUnit: {
                            id: 'ou-2',
                            path: '/ou-2',
                            displayName: 'Org unit 2',
                        },
                        period: {
                            displayName: 'January 2021',
                            startDate: '2021-01-01',
                            endDate: '2021-01-31',
                            year: 2021,
                            iso: '202101',
                            id: '202101',
                        },
                        workflow: {
                            dataSets: [dataSetOne, dataSetTwo],
                            dataApprovalLevels: [],
                            displayName: 'Workflow 1',
                            periodType: 'Monthly',
                            id: 'foo',
                        },
                    }}
                >
                    <Display dataSetId="pBOMPrpg1QX" />
                </SelectionContext.Provider>
            </CustomDataProvider>
        )

        await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

        expect(
            screen.getByText(
                `This data set doesn't have any data for January 2021 in Org unit 2.`
            )
        ).toBeInTheDocument()
    })

    describe('display for custom datasets', () => {
        it('renders a table for a custom dataset with safely sanitised HTML and CSS', async () => {
            const data = {
                dataSetReport: [
                    {
                        title: 'Custom Data set',
                        headers: [
                            {
                                name: '<b><span style="color:#00b050">2024/25</span></b>',
                                column: '<b><span style="color:#00b050">2024/25</span></b>',
                                type: 'java.lang.String',
                                hidden: false,
                                meta: false,
                            },
                            {
                                name: '<span style="color:black">NATIONAL DEPARTMENT OF HEALTH</span>',
                                column: '<span style="color:black">NATIONAL DEPARTMENT OF HEALTH</span>',
                                type: 'java.lang.String',
                                hidden: false,
                                meta: false,
                            },
                        ],
                        rows: [
                            [
                                '<span style="color:black">Programme 6: Performance Indicator</span>',
                            ],
                        ],
                    },
                ],
            }
            render(
                <CustomDataProvider data={data}>
                    <SelectionContext.Provider
                        value={{
                            attributeOptionCombo: {
                                id: "wertyuiopas",
                                displayName: "Option Combo 1",
                                categoryOptions: [{
                                    id: "123"
                                }]
                            },
                            orgUnit: {
                                id: 'ou-2',
                                path: '/ou-2',
                                displayName: 'Org unit 2',
                            },
                            period: {
                                displayName: 'January 2021',
                                startDate: '2021-01-01',
                                endDate: '2021-01-31',
                                year: 2021,
                                iso: '202101',
                                id: '202101',
                            },
                            workflow: {
                                dataSets: [
                                    {
                                        displayName: 'Another',
                                        id: 'custom',
                                        periodType: 'Monthly',
                                        formType: 'CUSTOM',
                                    },
                                ],
                                dataApprovalLevels: [],
                                displayName: 'Workflow 1',
                                periodType: 'Monthly',
                                id: 'foo',
                            },
                        }}
                    >
                        <Display dataSetId="custom" />
                    </SelectionContext.Provider>
                </CustomDataProvider>
            )

            await waitForElementToBeRemoved(() =>
                screen.getByRole('progressbar')
            )

            expect(screen.getByText('2024/25')).toHaveStyle({
                color: 'rgb(0, 176, 80)',
            })
            expect(screen.getByText('2024/25').parentElement.tagName).toBe('B')

            expect(
                screen.getByText('NATIONAL DEPARTMENT OF HEALTH')
            ).toHaveStyle({
                color: 'black',
            })

            expect(
                screen.getByText('Programme 6: Performance Indicator')
            ).toHaveStyle({
                color: 'black',
            })
        })

        it('renders HTML and CSS encoded for non-custom dataset', async () => {
            const data = {
                dataSetReport: [
                    {
                        title: 'Custom Data set',
                        headers: [
                            {
                                name: '<span style="color:black">NATIONAL DEPARTMENT OF HEALTH</span>',
                                column: '<span style="color:black">NATIONAL DEPARTMENT OF HEALTH</span>',
                                type: 'java.lang.String',
                                hidden: false,
                                meta: false,
                            },
                        ],
                        rows: [
                            [
                                '<span style="color:black">Programme 6: Performance Indicator</span>',
                            ],
                        ],
                    },
                ],
            }
            render(
                <CustomDataProvider data={data}>
                    <SelectionContext.Provider
                        value={{
                            attributeOptionCombo: {
                                id: "wertyuiopas",
                                displayName: "Option Combo 1",
                                categoryOptions: [{
                                    id: "123"
                                }]
                            },
                            orgUnit: {
                                id: 'ou-2',
                                path: '/ou-2',
                                displayName: 'Org unit 2',
                            },
                            period: {
                                displayName: 'January 2021',
                                startDate: '2021-01-01',
                                endDate: '2021-01-31',
                                year: 2021,
                                iso: '202101',
                                id: '202101',
                            },
                            workflow: {
                                dataSets: [
                                    {
                                        displayName: 'Another',
                                        id: 'custom',
                                        periodType: 'Monthly',
                                        formType: 'Default',
                                        categoryCombo: {
                                            id: "combo_1"
                                        }
                                    },
                                ],
                                dataApprovalLevels: [],
                                displayName: 'Workflow 1',
                                periodType: 'Monthly',
                                id: 'foo',
                            },
                        }}
                    >
                        <Display dataSetId="custom" />
                    </SelectionContext.Provider>
                </CustomDataProvider>
            )

            await waitForElementToBeRemoved(() =>
                screen.getByRole('progressbar')
            )

            expect(screen.getByRole('table')).toContainHTML(
                '&lt;span style="color:black"&gt;Programme 6: Performance Indicator&lt;/span&gt;'
            )
        })
    })
})
