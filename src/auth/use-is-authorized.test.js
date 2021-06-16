import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { CurrentUserContext } from '../current-user'
import { useIsAuthorized } from './use-is-authorized.js'

describe('useIsAuthorized', () => {
    it('returns false for unauthorised users', () => {
        const value = {
            authorities: ['dummy'],
        }

        const wrapper = ({ children }) => (
            <CurrentUserContext.Provider value={value}>
                {children}
            </CurrentUserContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual(false)
    })

    it('returns true for authorised users', () => {
        const value = {
            authorities: ['M_dhis-web-approval'],
        }

        const wrapper = ({ children }) => (
            <CurrentUserContext.Provider value={value}>
                {children}
            </CurrentUserContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual(true)
    })

    it('returns true for superusers', () => {
        const value = {
            authorities: ['ALL'],
        }

        const wrapper = ({ children }) => (
            <CurrentUserContext.Provider value={value}>
                {children}
            </CurrentUserContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual(true)
    })
})
