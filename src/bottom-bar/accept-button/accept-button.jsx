import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useAcceptData } from './use-accept-data.js'

const AcceptButton = () => {
    const [acceptData, { loading, error }] = useAcceptData()
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

    return (
        <Button
            small
            disabled={loading}
            onClick={async () => {
                const { wf, pe, ou } = params
                await acceptData({ wf, pe, ou })
                refresh()
            }}
        >
            {i18n.t('Accept')}
        </Button>
    )
}

export { AcceptButton }
