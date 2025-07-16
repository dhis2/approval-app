import { shallow } from 'enzyme'
import React from 'react'
import { useSelectionContext } from '../../selection-context/use-selection-context.js'
import { ClearAllButton } from './clear-all-button.jsx'

jest.mock('../../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

afterEach(() => {
    jest.resetAllMocks()
})

describe('<ClearAllButton>', () => {
    it('renders a button when workflow, period and org-unit are set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: '123',
            },
            period: {
                id: '20110203',
            },
            orgUnit: {
                path: 'abc',
            },
        }))
        const wrapper = shallow(<ClearAllButton />)
        const button = wrapper.dive().find({
            'data-test': 'dhis2-uicore-button',
        })
        expect(button).toHaveLength(1)
    })

    it('renders a button when workflow and period are set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: '123',
            },
            period: {
                id: '20110203',
            },
            orgUnit: {},
        }))
        const wrapper = shallow(<ClearAllButton />)
        const button = wrapper.dive().find({
            'data-test': 'dhis2-uicore-button',
        })
        expect(button).toHaveLength(1)
    })

    it('renders nothing when only workflow is set', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {
                id: '123',
            },
            period: {},
            orgUnit: {},
        }))
        const wrapper = shallow(<ClearAllButton />)
        expect(wrapper.type()).toEqual(null)
    })

    it('renders nothing when all properties are unset', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
        }))
        const wrapper = shallow(<ClearAllButton />)
        expect(wrapper.type()).toEqual(null)
    })

    it('calls clearAll when clicked', () => {
        const clearAll = jest.fn()
        useSelectionContext.mockImplementation(() => ({
            clearAll,
            workflow: {
                id: '123',
            },
            period: {
                id: '20110203',
            },
            orgUnit: {},
        }))

        shallow(<ClearAllButton />)
            .dive()
            .find({
                'data-test': 'dhis2-uicore-button',
            })
            .simulate('click')

        expect(clearAll).toHaveBeenCalledTimes(1)
    })
})
