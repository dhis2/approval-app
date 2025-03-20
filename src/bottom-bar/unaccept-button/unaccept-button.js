import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useUnacceptData } from './use-unaccept-data.js'

const UnacceptButton = () => {
    const [unacceptData, { loading, error }] = useUnacceptData({
            onComplete: () => {
                refresh()
            },
            onError: (e) => console.log(e.message),
        })
    const { params, refresh } = useWorkflowContext()
    const { show } = useAlert(
        i18n.t('Unacceptance failed: {{error}}', {
            error: error ? error.toString() : '',
            nsSeparator: '-:-',
        })
    )

    useEffect(() => {
        if (error?.message) {
            show()
        }
    }, [error?.message])

    const onUnaccept =() => {
        const { wf, pe, ou, aoc } = params
        
        const unapprovals = [{"ou": ou, "aoc": aoc}]
        unacceptData({ wf:[wf], pe:[pe], approvals: unapprovals })
        // refresh()
    }
    
    return (
        <Button
            small
            disabled={loading}
            onClick={onUnaccept}
        >
            {i18n.t('Unaccept')}
        </Button>
    )
}

export { UnacceptButton }
