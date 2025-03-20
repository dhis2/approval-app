import {
    initialWorkflowValue,
    initialPeriodValue,
    initialOrgUnitValue,
    initialDataSetValue,
} from './initial-values.js'

describe('initialWorkflowValue', () => {
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

    it('returns null by default', () => {
        expect(initialWorkflowValue([])).toEqual(null)
    })

    it('returns the workflow with the provided ID if it exists', () => {
        expect(initialWorkflowValue(mockWorkflows, 'i5m0JPw4DQi')).toEqual(
            mockWorkflows[0]
        )
    })

    it('returns null if the specified ID is not present on a workflow', () => {
        expect(initialWorkflowValue(mockWorkflows, 'invalid_value')).toEqual(
            null
        )
    })

    it('returns the only workflow if only one workflow exist and no ID is specified', () => {
        expect(initialWorkflowValue([mockWorkflows[0]])).toEqual(
            mockWorkflows[0]
        )
    })
})

describe('initialPeriodValue', () => {
    const initialWorkflow = {
        displayName: 'Workflow a',
        id: 'i5m0JPw4DQi',
        periodType: 'Daily',
    }
    it('returns null by default', () => {
        expect(initialPeriodValue()).toEqual(null)
    })
    it('returns null when provided with an invalid period ID', () => {
        const invalidPeriodID = 'invalidPeriodID'
        expect(initialPeriodValue(invalidPeriodID, initialWorkflow)).toEqual(
            null
        )
    })
    it('returns null if the periodId does not match the workflow periodType', () => {
        const monthlyPeriodId = '201204'
        expect(initialPeriodValue(monthlyPeriodId, initialWorkflow)).toEqual(
            null
        )
    })
    it('returns a parsed period object if the periodId matches the workflow periodType', () => {
        const dailyPeriodId = '20120404'
        expect(initialPeriodValue(dailyPeriodId, initialWorkflow)).toEqual(
            expect.objectContaining({
                displayName: '2012-04-04',
                endDate: '2012-04-04',
                id: '20120404',
                iso: '20120404',
                startDate: '2012-04-04',
                year: 2012,
            })
        )
    })
})

describe('initialOrgUnitValue', () => {
    it('returns null by default', () => {
        expect(initialOrgUnitValue()).toEqual(null)
    })
    it('returns null when not supplying a path', () => {
        expect(initialOrgUnitValue(undefined, 'test')).toEqual(null)
    })
    it('returns null when not supplying a displayName', () => {
        expect(initialOrgUnitValue('test', undefined)).toEqual(null)
    })
    it('returns an object when supplying both params', () => {
        expect(initialOrgUnitValue('/path', 'Display name')).toEqual({
            id: 'path',
            path: '/path',
            displayName: 'Display name',
        })
    })
})

describe('initialDataSetValue', () => {
    it('returns null by default', () => {
        expect(initialDataSetValue()).toEqual(null)
    })

    it('returns a string when supplying the params', () => {
        expect(initialDataSetValue('foo')).toEqual('foo')
    })
})
