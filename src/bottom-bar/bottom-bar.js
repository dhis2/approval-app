import React from 'react'
import { useIsAuthorized } from '../auth/use-is-authorized.js'
import { ApprovalStatusTag, APPROVAL_STATUSES } from '../shared/index.js'
import { useWorkflowContext } from '../workflow-context/index.js'
import { AcceptButton } from './accept-button/index.js'
import { ApproveButton } from './approve-button/index.js'
import { BottomBarItem } from './bottom-bar-item.js'
import styles from './bottom-bar.module.css'
import { UnacceptButton } from './unaccept-button/index.js'
import { UnapproveButton } from './unapprove-button/index.js'

const approvedStatuses = new Set([
    APPROVAL_STATUSES.APPROVED_HERE,
    APPROVAL_STATUSES.APPROVED_ABOVE,
    APPROVAL_STATUSES.ACCEPTED_HERE,
])

const BottomBar = () => {
    const { allowedActions, approvalStatus, approvedBy, approvedAt } =
        useWorkflowContext()
    const { hasApprovalAuthorities } = useIsAuthorized()
    const { mayAccept, mayApprove, mayUnaccept, mayUnapprove } = allowedActions
    const disableApproveBtn =
        /* We want to signal that the user can't approve or unapprove anything 
           by showing a disabled button rather than an empty space */
        (!mayApprove && !mayUnapprove) ||
        (mayApprove && approvedStatuses.has(approvalStatus))

    return (
        <>
            <div className={styles.bottomBar} data-test="bottom-bar">
                <BottomBarItem>
                    <ApprovalStatusTag
                        approvalStatus={
                            hasApprovalAuthorities
                                ? approvalStatus
                                : APPROVAL_STATUSES.UNAUTHORIZED
                        }
                        approvedBy={approvedBy}
                        approvedAt={approvedAt}
                    />
                </BottomBarItem>

                {(mayApprove || disableApproveBtn) && (
                    <BottomBarItem>
                        <ApproveButton disabled={disableApproveBtn} />
                    </BottomBarItem>
                )}

                {mayAccept && (
                    <BottomBarItem>
                        <AcceptButton />
                    </BottomBarItem>
                )}

                {mayUnapprove && (
                    <BottomBarItem>
                        <UnapproveButton />
                    </BottomBarItem>
                )}

                {mayUnaccept && (
                    <BottomBarItem>
                        <UnacceptButton />
                    </BottomBarItem>
                )}
            </div>
        </>
    )
}

export { BottomBar }