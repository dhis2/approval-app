import { IconChevronDown24, IconChevronUp24, Popover, Tooltip } from '@dhis2/ui'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { shallow } from 'enzyme'
import React from 'react'
import { ContextSelect } from './context-select.jsx'

describe('<ContextSelect>', () => {
    const baseProps = {
        prefix: 'prefix',
        placeholder: 'placeholder',
        value: 'value',
        onClose: () => {},
        onOpen: () => {},
        dataTest: 'context-select',
    }
    describe('base state - not open or disabled', () => {
        const onOpen = jest.fn()

        const wrapper = shallow(
            <ContextSelect {...baseProps} onOpen={onOpen}>
                children
            </ContextSelect>
        )

        it('renders the prefix in a span', () => {
            expect(
                wrapper.find('span.prefix').containsMatchingElement('prefix')
            ).toBe(true)
        })

        it('renders the value in a span', () => {
            expect(
                wrapper.find('span.value').containsMatchingElement('value')
            ).toBe(true)
        })

        it('does not render children in a popup', () => {
            const popover = wrapper.find(Popover)

            expect(popover).toHaveLength(0)
            expect(popover.containsMatchingElement('children')).toBe(false)
        })

        it('shows an icon pointing downwards', () => {
            expect(wrapper.find(IconChevronDown24)).toHaveLength(1)
        })

        it('does not have a tooltip', () => {
            expect(wrapper.find(Tooltip)).toHaveLength(0)
        })

        it('calls onOpen when the button is clicked', () => {
            wrapper.find('button').simulate('click')
            expect(onOpen).toHaveBeenCalledTimes(1)
        })
    })
    describe('opened state', () => {
        const onClose = jest.fn()

        const wrapper = shallow(
            <ContextSelect {...baseProps} open onClose={onClose}>
                children
            </ContextSelect>
        )

        it('renders children in a popover', () => {
            const popover = wrapper.find(Popover)

            expect(popover).toHaveLength(1)
            expect(popover.containsMatchingElement('children')).toBe(true)
        })

        it('shows an icon pointing upwards', () => {
            expect(wrapper.find(IconChevronUp24)).toHaveLength(1)
        })

        // Refactored from enzyme test
        it('calls onClose when the backdrop layer is clicked', async () => {
            render(
                <ContextSelect {...baseProps} open onClose={onClose}>
                    children
                </ContextSelect>
            )
            // Janky way to select the backdrop, since it uses a portal
            const backdrop = document.querySelector(
                '[data-test="dhis2-uicore-layer"] > .backdrop'
            )
            await userEvent.click(backdrop)

            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })

    describe('disabled state', () => {
        const wrapper = shallow(
            <ContextSelect
                {...baseProps}
                disabled
                requiredValuesMessage="tooltipcontent"
            >
                children
            </ContextSelect>
        )

        it('has a tooltip', () => {
            const tooltip = wrapper.find(Tooltip)

            expect(tooltip).toHaveLength(1)
            expect(tooltip.prop('content')).toBe('tooltipcontent')
        })

        it('does not render the span containing the value', () => {
            expect(wrapper.find('span.value')).toHaveLength(0)
        })
    })
})
