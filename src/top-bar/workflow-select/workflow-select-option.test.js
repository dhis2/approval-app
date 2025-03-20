import { shallow } from 'enzyme'
import React from 'react'
import { WorkflowSelectOption } from './workflow-select-option.js'

describe('<WorkflowSelectOption>', () => {
    it('renders a MenuItem with containing a name and periodType', () => {
        const wrapper = shallow(
            <WorkflowSelectOption id="123" name="test" periodType="period" />
        )
        const titleSpan = wrapper.dive().find('span.title')
        const subtitleSpan = wrapper.dive().find('span.subtitle')

        expect(titleSpan.containsMatchingElement('test')).toBe(true)
        expect(subtitleSpan.containsMatchingElement('period')).toBe(true)
    })

    it('sets MenuItem active state when active', () => {
        const wrapper = shallow(
            <WorkflowSelectOption
                id="123"
                name="test"
                periodType="period"
                active
            />
        )

        expect(wrapper.prop('active')).toBe(true)
    })

    it('calls onClick when MenuItem is clicked', () => {
        const onClick = jest.fn()
        shallow(
            <WorkflowSelectOption
                id="123"
                name="test"
                periodType="period"
                onClick={onClick}
            />
        ).simulate('click')

        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
