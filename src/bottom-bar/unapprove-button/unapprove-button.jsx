import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useUnapproveData } from './use-unapprove-data.js'

const UnapproveButton = () => {
    const [unapproveData, { loading, error }] = useUnapproveData()
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

    return (
        <Button
            small
            disabled={loading}
            onClick={async () => {
                const { wf, pe, ou } = params
                await unapproveData({ wf, pe, ou })
                refresh()
            }}
        >
            {i18n.t('Unapprove')}
        </Button>
    )
}

export { UnapproveButton }
