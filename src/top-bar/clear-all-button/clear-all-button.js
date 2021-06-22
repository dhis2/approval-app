import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSelection } from '../selection/index.js'
import classes from './clear-all-button.module.css'

const ClearAllButton = () => {
    const { clearAll } = useSelection()

    return (
        <Button className={classes.button} secondary onClick={clearAll}>
            {i18n.t('Clear selections')}
        </Button>
    )
}

export { ClearAllButton }