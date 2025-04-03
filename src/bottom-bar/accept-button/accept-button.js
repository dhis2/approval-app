import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useAcceptData } from './use-accept-data.js'

const AcceptButton = () => {
    const [acceptData, { loading, error }] = useAcceptData({
            onComplete: () => {
               refresh()
            },
            onError: (e) => console.log(e.message),
        })
    
    const { params, refresh } = useWorkflowContext()
    const { show } = useAlert(
        i18n.t('Acceptance failed: {{error}}', {
            error: error ? error.toString() : '',
            nsSeparator: '-:-',
        })
    )

    useEffect(() => {
           if (error?.message) {
               show()
           }
       }, [error?.message])
    
    const onAccept =() => {
        const { wf, pe, ou, aoc } = params
        
        const acceptances = [{"ou": ou, "aoc": aoc}]
        acceptData({ wf:[wf], pe:[pe], approvals: acceptances })
    }
    
    
    return (
        <Button
            small
            disabled={loading}
            onClick={onAccept}
        >
            {i18n.t('Accept')}
        </Button>
    )
}

export { AcceptButton }
