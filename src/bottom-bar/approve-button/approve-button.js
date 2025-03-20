import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { ApproveModal } from './approve-modal/index.js'
import { useApproveData } from './use-approve-data.js'

const ApproveButton = ({ disabled }) => {
    // state
    const [unexpectedError, setUnexpectedError] = useState(null)
    const [showApproveModal, setShowApproveModal] = useState(false)
    const { params, refresh } = useWorkflowContext()

    // callbacks
    const showApprovalDialog = () => setShowApproveModal(true)
    const hideApprovalDialog = () => setShowApproveModal(false)
    const onApprove = () => {
        const { wf, pe, ou, aoc } = params;
        
        const approvals = [{"ou": ou, "aoc": aoc}];
        approveData({ wf:[wf], pe:[pe], approvals })
    }

    // api
    const { show: showApprovalSuccess } = useAlert(i18n.t('Approval saved'), {
        success: true,
    })
    const [approveData, { loading, error: approveError }] = useApproveData({
        onComplete: () => {
            showApprovalSuccess()
            hideApprovalDialog()
            refresh()
        },
        onError: (e) => setUnexpectedError(e),
    })

    // derived state
    const error = approveError || unexpectedError
    
    return (
        <>
            <Button
                primary
                small
                disabled={disabled}
                onClick={showApprovalDialog}
            >
                {i18n.t('Approve')}
            </Button>

            {showApproveModal && (
                <ApproveModal
                    error={error}
                    loading={loading}
                    onApprove={onApprove}
                    onCancel={hideApprovalDialog}
                />
            )}
        </>
    )
}

ApproveButton.propTypes = {
    disabled: PropTypes.bool,
}

export { ApproveButton }
