import { useConfig } from '@dhis2/app-runtime'
import { Tag, Tooltip } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { ApprovalStatusTag } from './approval-status-tag.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(() => ({
        systemInfo: {
            serverTimeZoneId: 'Etc/UTC',
        },
    })),
}))

describe('<ApprovalStatusTag>', () => {
    it('renders a tag for non-approved approvalStatuses', () => {
        const wrapper = shallow(
            <ApprovalStatusTag approvalStatus="UNAPPROVED_READY" />
        )

        expect(wrapper.find(Tag)).toHaveLength(1)
        expect(wrapper.find(Tooltip)).toHaveLength(0)
    })

    it('renders a tag in a tooltip when the approvalStatus is approved and approvedAt is present', () => {
        const wrapper = shallow(
            <ApprovalStatusTag
                approvalStatus="APPROVED_HERE"
                approvedAt="2021-08-24T18:55:03.165Z"
            />
        )

        expect(wrapper.find(Tag)).toHaveLength(1)
        expect(wrapper.find(Tooltip)).toHaveLength(1)
    })
})
