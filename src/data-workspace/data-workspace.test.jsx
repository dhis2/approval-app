import { shallow } from 'enzyme'
import React from 'react'
import { useSelectionContext } from '../selection-context/index.js'
import { DataSetNavigation } from './data-set-navigation/index.js'
import { DataWorkspace } from './data-workspace.jsx'
import { Display } from './display/index.js'
import { TitleBar } from './title-bar/index.js'

jest.mock('../selection-context/use-selection-context.js', () => ({
    useSelectionContext: jest.fn(),
}))

describe('<DataWorkspace>', () => {
    const workflow = {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Monthly',
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
    }

    useSelectionContext.mockImplementation(() => ({
        workflow,
        selectDataSet: jest.fn(),
    }))

    it('renders a TitleBar, DataSetNavigation and Display', () => {
        const wrapper = shallow(<DataWorkspace />)

        expect(wrapper.find(TitleBar)).toHaveLength(1)
        expect(wrapper.find(DataSetNavigation)).toHaveLength(1)
        expect(wrapper.find(Display)).toHaveLength(1)
    })
})
