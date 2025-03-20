import { useConfig } from '@dhis2/app-runtime'
import { Menu, MenuItem } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { createHref } from '../../navigation/index.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { getFixedPeriodsByTypeAndYear } from '../../shared/index.js'
import classes from './period-menu.module.css'

const PeriodMenu = ({ periodType, year }) => {
    const {
        workflow,
        period: selectedPeriod,
        orgUnit,
        selectPeriod,
    } = useSelectionContext()
    const {
        systemInfo: { dateFormat },
    } = useConfig()
    const periods = getFixedPeriodsByTypeAndYear({
        periodType,
        year,
        formatYyyyMmDd: (date) => {
            if (periodType === 'Daily') {
                // moment format tokens are case sensitive
                // see https://momentjs.com/docs/#/parsing/string-format/
                return moment(date).format(dateFormat.toUpperCase())
            }
            return moment(date).format('YYYY-MM-DD')
        },
        config: {
            reversePeriods: true,
        },
    })

    return (
        <Menu dense className={classes.menu}>
            {periods.map((period) => (
                <MenuItem
                    active={period.id === selectedPeriod?.id}
                    key={period.id}
                    href={createHref({
                        wf: workflow?.id,
                        ou: orgUnit?.path,
                        pe: period.id,
                    })}
                    label={period.displayName}
                    onClick={() => selectPeriod(period)}
                />
            ))}
        </Menu>
    )
}

PeriodMenu.propTypes = {
    periodType: PropTypes.string,
    year: PropTypes.number,
}

export { PeriodMenu }
