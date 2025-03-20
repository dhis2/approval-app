import { Button } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { YearNavigator } from './year-navigator.js'

describe('<YearNavigator>', () => {
    it('renders two buttons and a span', () => {
        const year = 2018
        const wrapper = shallow(<YearNavigator year={year} />)

        expect(wrapper.find(Button)).toHaveLength(2)
        expect(wrapper.find('span.year')).toHaveLength(1)
        expect(wrapper.find('span.year').text()).toBe(year.toString())
    })

    it('disables the back button when the year is 1970', () => {
        const year = 1970
        const wrapper = shallow(<YearNavigator year={year} />)

        expect(wrapper.find(Button).first().prop('disabled')).toBe(true)
        expect(wrapper.find(Button).last().prop('disabled')).toBe(false)
    })

    it('disables the forward button when the year is equal to the maxYear', () => {
        const wrapper = shallow(<YearNavigator year={2020} maxYear={2020} />)

        expect(wrapper.find(Button).first().prop('disabled')).toBe(false)
        expect(wrapper.find(Button).last().prop('disabled')).toBe(true)
    })

    it('calls onYearChange with year minus one when back button is clicked', () => {
        const onYearChange = jest.fn()
        const wrapper = shallow(
            <YearNavigator
                periodType="Monthly"
                year={2012}
                onYearChange={onYearChange}
            />
        )

        const backButton = wrapper.find(Button).first()

        backButton.simulate('click')
        expect(onYearChange).toHaveBeenCalledTimes(1)
        expect(onYearChange).toHaveBeenCalledWith(2011)
    })

    it('calls onYearChange with year plus one when forward button is clicked', () => {
        const onYearChange = jest.fn()
        const wrapper = shallow(
            <YearNavigator
                periodType="Monthly"
                year={2012}
                onYearChange={onYearChange}
            />
        )

        const forwardButton = wrapper.find(Button).last()

        forwardButton.simulate('click')
        expect(onYearChange).toHaveBeenCalledTimes(1)
        expect(onYearChange).toHaveBeenCalledWith(2013)
    })
})
