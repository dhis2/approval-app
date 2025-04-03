import { shallow } from 'enzyme'
import React from 'react'
import { useSelectionContext } from '../../selection-context/use-selection-context.js'
import { ClearAllButton } from './clear-all-button.js'

jest.mock('../../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

afterEach(() => {
    jest.resetAllMocks()
})

describe('<ClearAllButton>', () => {
    it('renders a button when workflow, period, org-unit and category-option-combo are set', () => {
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
            attributeOptionCombo: {
                id: 'wertyuiopas',
            },
        }))
        const wrapper = shallow(<ClearAllButton />)
        const button = wrapper.dive().find({
            'data-test': 'dhis2-uicore-button',
        })
        expect(button).toHaveLength(1)
    })
    
    it('renders a button when workflow, period, org-unit and category-option-combo are set', () => {
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
            attributeOptionCombo: null,
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
            attributeOptionCombo: {},
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
            attributeOptionCombo: {},
        }))
        const wrapper = shallow(<ClearAllButton />)
        expect(wrapper.type()).toEqual(null)
    })

    it('renders nothing when all properties are unset', () => {
        useSelectionContext.mockImplementation(() => ({
            workflow: {},
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
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
            attributeOptionCombo: {},
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
