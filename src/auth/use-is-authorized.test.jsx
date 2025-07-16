import { renderHook } from '@testing-library/react'
import React from 'react'
import { AppContext } from '../app-context/index.js'
import { useIsAuthorized } from './use-is-authorized.js'

describe('useIsAuthorized', () => {
    it('returns the correct object for unauthorised users', () => {
        const value = {
            authorities: ['dummy'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: false,
            hasApprovalAuthorities: false,
        })
    })

    it('returns the correct object for authorised users', () => {
        const value = {
            authorities: ['M_dhis-web-approval'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: true,
            hasApprovalAuthorities: false,
        })
    })

    it('returns the correct object for authorised users with F_APPROVE_DATA authority', () => {
        const value = {
            authorities: ['M_dhis-web-approval', 'F_APPROVE_DATA'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: true,
            hasApprovalAuthorities: true,
        })
    })

    it('returns the correct object for authorised users with F_APPROVE_DATA_LOWER_LEVELS authority', () => {
        const value = {
            authorities: ['M_dhis-web-approval', 'F_APPROVE_DATA_LOWER_LEVELS'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: true,
            hasApprovalAuthorities: true,
        })
    })

    it('returns the correct object for authorised users with F_ACCEPT_DATA_LOWER_LEVELS authority', () => {
        const value = {
            authorities: ['M_dhis-web-approval', 'F_ACCEPT_DATA_LOWER_LEVELS'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: true,
            hasApprovalAuthorities: true,
        })
    })

    it('returns the correct object for superusers', () => {
        const value = {
            authorities: ['ALL'],
        }

        const wrapper = ({ children }) => (
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
        )

        const { result } = renderHook(() => useIsAuthorized(), { wrapper })

        expect(result.current).toEqual({
            hasAppAccess: true,
            hasApprovalAuthorities: true,
        })
    })
})
