import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { createHref } from '../../navigation/index.js'
import classes from './workflow-select-option.module.css'

const WorkflowSelectOption = ({ id, name, periodType, active, onClick }) => {
    const label = (
        <div className={classes.option}>
            <span className={classes.title}>{name}</span>
            <span className={classes.subtitle}>
                {periodType || 'UNAVAILABLE'}
            </span>
        </div>
    )

    return (
        <MenuItem
            href={createHref({ wf: id })}
            className={classes.bordered}
            active={active}
            onClick={onClick}
            label={label}
        />
    )
}

WorkflowSelectOption.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    periodType: PropTypes.string,
    onClick: PropTypes.func,
}

export { WorkflowSelectOption }
