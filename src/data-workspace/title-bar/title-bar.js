import i18n from '@dhis2/d2-i18n'
import { IconDimensionDataSet16 } from '@dhis2/ui'
import React from 'react'
import { useSelectionContext } from '../../selection-context/index.js'
import { ApprovalStatusTag } from '../../shared/approval-status/index.js'
import { filterDataSetsByAttributeOptionComboAndOrgUnit } from '../../utils/caterogy-combo-utils.js'
import { useWorkflowContext } from '../../workflow-context/index.js'
import styles from './title-bar.module.css'
import { useAppContext } from '../../app-context/use-app-context.js'

const TitleBar = () => {
    const { metadata } = useAppContext()
    const { approvalStatus, approvedBy, approvedAt } = useWorkflowContext()
    const { workflow, orgUnit, attributeOptionCombo } = useSelectionContext()
    const { displayName: name } = workflow
    const dataSets = filterDataSetsByAttributeOptionComboAndOrgUnit(metadata, workflow, orgUnit, attributeOptionCombo)
    const dataSetsCount = dataSets.length

    return (
        <div className={styles.titleBar}>
            <span className={styles.workflowName}>{name}</span>
            <span className={styles.workflowDataSetsCount}>
                <IconDimensionDataSet16 />

                {dataSetsCount === 1 &&
                    i18n.t('1 data set', {
                        dataSetsCount,
                    })}

                {dataSetsCount !== 1 &&
                    i18n.t('{{dataSetsCount}} data sets', {
                        dataSetsCount,
                    })}
            </span>
            <ApprovalStatusTag
                approvalStatus={approvalStatus}
                approvedBy={approvedBy}
                approvedAt={approvedAt}
            />
        </div>
    )
}

export { TitleBar }
