import { TabBar, Tab } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { DataSetNavigation } from './data-set-navigation.js'

describe('<DataSetNavigation>', () => {
    const onChange = jest.fn()
    const props = {
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
        selected: 'data-set-1',
        onChange,
    }
    it('renders dataSets as Tabs in a TabBar', () => {
        const wrapper = shallow(<DataSetNavigation {...props} />)

        expect(wrapper.find(TabBar)).toHaveLength(1)
        expect(wrapper.find(Tab)).toHaveLength(2)
        expect(wrapper.find(Tab).first().prop('children')).toBe('Data set 1')
        expect(wrapper.find(Tab).last().prop('children')).toBe('Data set 2')
    })

    it('renders a tab as selected when the data set id matches the selected prop', () => {
        const wrapper = shallow(<DataSetNavigation {...props} />)

        expect(wrapper.find(Tab).first().prop('selected')).toBe(true)
    })

    it('calls the onChange callback when a tab is click', () => {
        const wrapper = shallow(<DataSetNavigation {...props} />)

        wrapper.find(Tab).last().simulate('click')
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('data-set-2')
    })

    it('renders null if no dataSets are provided', () => {
        const wrapperUndefined = shallow(
            <DataSetNavigation onChange={() => {}} />
        )
        const wrapperEmptyArray = shallow(
            <DataSetNavigation onChange={() => {}} dataSets={[]} />
        )

        expect(wrapperUndefined.type()).toBe(null)
        expect(wrapperEmptyArray.type()).toBe(null)
    })
})
