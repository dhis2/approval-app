import { useConfig } from '@dhis2/app-runtime'
import { MenuItem, Menu } from '@dhis2/ui'
import { shallow } from 'enzyme'
import moment from 'moment'
import React from 'react'
import { useSelectionContext } from '../../selection-context/index.js'
import { PeriodMenu } from './period-menu.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(),
}))

jest.mock('../../selection-context/index.js', () => ({
    useSelectionContext: jest.fn(),
}))

describe('<PeriodMenu>', () => {
    it('renders MenuItems with the expected periods', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                dateFormat: 'yyyy-mm-dd',
            },
        }))
        useSelectionContext.mockImplementation(() => ({
            selectPeriod: () => {},
            workflow: {},
            period: {},
            orgUnit: {},
        }))
        const wrapper = shallow(<PeriodMenu periodType="Monthly" year={2018} />)

        expect(wrapper.find(Menu)).toHaveLength(1)
        expect(wrapper.find(MenuItem)).toHaveLength(12)
        expect(wrapper.find(MenuItem)).toMatchSnapshot()
    })

    it('sets MenuItem active state when active', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                dateFormat: 'yyyy-mm-dd',
            },
        }))
        useSelectionContext.mockImplementation(() => ({
            selectPeriod: () => {},
            workflow: {
                id: '123',
            },
            period: {
                id: '201804',
            },
            orgUnit: {},
        }))
        const wrapper = shallow(<PeriodMenu periodType="Monthly" year={2018} />)
        const activeMenuItem = wrapper.findWhere(
            (n) => n.type() === MenuItem && n.prop('active') === true
        )

        expect(activeMenuItem).toHaveLength(1)
        expect(activeMenuItem.prop('active')).toBe(true)
        expect(activeMenuItem.prop('label')).toBe('April 2018')
    })

    it('calls selectPeriod when MenuItem is clicked', () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                dateFormat: 'yyyy-mm-dd',
            },
        }))
        const selectPeriod = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            selectPeriod,
            workflow: {},
            period: {},
            orgUnit: {},
        }))
        const wrapper = shallow(<PeriodMenu periodType="Monthly" year={2018} />)

        wrapper.find(MenuItem).first().simulate('click')

        expect(selectPeriod).toHaveBeenCalledTimes(1)
        expect(selectPeriod).toHaveBeenCalledWith({
            displayName: 'December 2018',
            endDate: '2018-12-31',
            id: '201812',
            iso: '201812',
            startDate: '2018-12-01',
        })
    })

    describe('formats Daily periods according to the dateFormat setting', () => {
        it('supports format "yyyy-mm-dd"', () => {
            useConfig.mockImplementation(() => ({
                systemInfo: {
                    dateFormat: 'yyyy-mm-dd',
                },
            }))
            useSelectionContext.mockImplementation(() => ({
                selectPeriod: () => {},
                workflow: {},
                period: {},
                orgUnit: {},
            }))
            const wrapper = shallow(
                <PeriodMenu periodType="Daily" year={2018} />
            )

            wrapper.find(MenuItem).forEach((menuItem, index) => {
                const expectedDay = moment('2018-12-31', 'YYYY-MM-DD').subtract(
                    index,
                    'days'
                )
                expect(menuItem.prop('label')).toBe(
                    expectedDay.format('YYYY-MM-DD')
                )
            })
        })

        it('supports format "dd-mm-yyyy"', () => {
            useConfig.mockImplementation(() => ({
                systemInfo: {
                    dateFormat: 'dd-mm-yyyy',
                },
            }))
            useSelectionContext.mockImplementation(() => ({
                selectPeriod: () => {},
                workflow: {},
                period: {},
                orgUnit: {},
            }))
            const wrapper = shallow(
                <PeriodMenu periodType="Daily" year={2018} />
            )

            wrapper.find(MenuItem).forEach((menuItem, index) => {
                const expectedDay = moment('2018-12-31', 'YYYY-MM-DD').subtract(
                    index,
                    'days'
                )
                expect(menuItem.prop('label')).toBe(
                    expectedDay.format('DD-MM-YYYY')
                )
            })
        })
    })
})
