import { useAppContext } from '../app-context/index.js'
import { useSelectedWorkflow } from './use-selected-workflow.js'

const mockWorkflows = [
    {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
    },
    {
        displayName: 'Workflow B',
        id: 'rIUL3hYOjJc',
        periodType: 'Daily',
    },
]

jest.mock('../app-context/index.js', () => ({
    useAppContext: jest.fn(() => ({
        dataApprovalWorkflows: mockWorkflows,
    })),
}))

describe('useSelectedWorkflow', () => {
    it('returns the selected workflow if params.wf matches a workflow id', () => {
        expect(useSelectedWorkflow({ wf: 'i5m0JPw4DQi' })).toBe(
            mockWorkflows[0]
        )
    })
    it('returns an empty object if params.wf does not match the id of any workflows', () => {
        expect(useSelectedWorkflow({ wf: 'badID' })).toEqual({})
    })
    it('returns an empty object if params.wf is undefined', () => {
        expect(useSelectedWorkflow({ wf: undefined })).toEqual({})
        expect(useSelectedWorkflow()).toEqual({})
    })
    it('returns an empty object if no workflows are found', () => {
        useAppContext.mockImplementationOnce(() => ({
            dataApprovalWorkflows: [],
        }))
        expect(useSelectedWorkflow({ wf: 'i5m0JPw4DQi' })).toEqual({})
    })
    it('returns an empty object if workflows are undefined', () => {
        useAppContext.mockImplementationOnce(() => ({}))
        expect(useSelectedWorkflow({ wf: 'i5m0JPw4DQi' })).toEqual({})
    })
})
