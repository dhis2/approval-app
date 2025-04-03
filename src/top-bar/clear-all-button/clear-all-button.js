import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSelectionContext } from '../../selection-context/index.js'
import classes from './clear-all-button.module.css'

const ClearAllButton = () => {
    const { clearAll, period, orgUnit, attributeOptionCombo } = useSelectionContext()

    return (period?.id || orgUnit?.path || attributeOptionCombo?.id ) ? (
        <Button small className={classes.button} secondary onClick={clearAll}>
            {i18n.t('Clear selections')}
        </Button>
    ) : null
}

export { ClearAllButton }
