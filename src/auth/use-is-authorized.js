import { useAppContext } from '../app-context/index.js'

export const useIsAuthorized = () => {
    const { authorities } = useAppContext()
    const hasAppAccess = authorities.some(
        (authority) =>
            authority === 'ALL' || authority === 'M_dhis-web-approval'
    )

    const hasApprovalAuthorities = authorities.some(
        (authority) =>
            authority === 'ALL' ||
            authority === 'F_APPROVE_DATA' ||
            authority === 'F_APPROVE_DATA_LOWER_LEVELS' ||
            authority === 'F_ACCEPT_DATA_LOWER_LEVELS'
    )

    return { hasAppAccess, hasApprovalAuthorities }
}
