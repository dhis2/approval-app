import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useWorkflowContext } from '../../workflow-context/index.js'
import { useUnacceptData } from './use-unaccept-data.js'

const UnacceptButton = () => {
    const [unacceptData, { loading, error }] = useUnacceptData()
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

    return (
        <Button
            small
            disabled={loading}
            onClick={async () => {
                const { wf, pe, ou } = params
                await unacceptData({ wf, pe, ou })
                refresh()
            }}
        >
            {i18n.t('Unaccept')}
        </Button>
    )
}

export { UnacceptButton }
