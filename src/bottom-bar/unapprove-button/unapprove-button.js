import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useUnapproveData } from './use-unapprove-data.js'

const UnapproveButton = () => {
    const [unapproveData, { loading, error }] = useUnapproveData({
            onComplete: () => {
                refresh()
            },
            onError: (e) => console.log(e.message),
        })
    const { params, refresh } = useWorkflowContext()
    const { show } = useAlert(
        i18n.t('Unapproval failed: {{error}}', {
            error: error ? error.toString() : '',
            nsSeparator: '-:-',
        })
    )

    useEffect(() => {
        if (error?.message) {
            show()
        }
    }, [error?.message])
    
    const onUnapprove =() => {
        const { wf, pe, ou, aoc } = params
        
        const unapprovals = [{"ou": ou, "aoc": aoc}]
        unapproveData({ wf:[wf], pe:[pe], approvals: unapprovals })
        // refresh()
    }

    return (
        <Button
            small
            disabled={loading}
            onClick={onUnapprove}
        >
            {i18n.t('Unapprove')}
        </Button>
    )
}

export { UnapproveButton }
