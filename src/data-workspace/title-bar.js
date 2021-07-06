import i18n from '@dhis2/d2-i18n'
import { IconDimensionDataSet16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusTag } from '../shared/status-tag/index.js'
import styles from './title-bar.module.css'

const TitleBar = ({ workflow }) => (
    <div className={styles.titleBar}>
        <span className={styles.workflowName}>{workflow.displayName}</span>
        <span className={styles.workflowDataSetsCount}>
            <IconDimensionDataSet16 />
            {i18n.t('{{dataSetsCount}} data sets', {
                dataSetsCount: workflow.dataSets.length,
            })}
        </span>
        <StatusTag approvalState={workflow.approvalStatus.state} />
    </div>
)

TitleBar.propTypes = {
    workflow: PropTypes.object.isRequired,
}

export { TitleBar }
