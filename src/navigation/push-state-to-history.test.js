import { history } from './history.js'
import { pushStateToHistory } from './push-state-to-history.js'

jest.mock('./history.js', () => {
    const actualHistoryModule = jest.requireActual('./history.js')
    return {
        history: {
            ...actualHistoryModule.history,
            push: jest.fn(),
        },
    }
})

describe('pushStateToHistory', () => {
    it('updates broswer history when state and query params differ', () => {
        const mock = jest.fn()
        history.push.mockImplementation(mock)

        pushStateToHistory({
            workflow: { id: '123' },
            period: { id: '455' },
            orgUnit: { path: '789' },
            attributeOptionCombo: { id: "wertyuiopas" },
        })

        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith({
            pathname: '/',
            search: '?aoc=wertyuiopas&ou=789&pe=455&wf=123',
        })
    })
    it('updates broswer history when state and query params are equivalent', () => {
        const mock = jest.fn()
        history.push.mockImplementation(mock)

        pushStateToHistory({
            workflow: {},
            period: {},
            orgUnit: {},
            attributeOptionCombo: {},
        })

        expect(mock).toHaveBeenCalledTimes(0)
    })
})
