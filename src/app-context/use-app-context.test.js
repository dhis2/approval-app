import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { AppContext } from './app-context.js'
import { useAppContext } from './use-app-context.js'

describe('useAppContext', () => {
    const value = {
        authorities: ['dummy'],
    }

    const wrapper = ({ children }) => (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )

    it('returns an object with current user properties', () => {
        const { result } = renderHook(() => useAppContext(), { wrapper })

        expect(result.current).toEqual(value)
    })
})
