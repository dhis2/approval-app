import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useSelectionContext } from '../selection-context/index.js'
import { ErrorMessage, Loader, RetryButton } from '../shared/index.js'
import { WorkflowContext } from './workflow-context.js'

const query = {
    approvalStatus: {
        resource: 'dataApprovals',
        params: ({ workflow, period, orgUnit }) => ({
            wf: workflow.id,
            pe: period.id,
            ou: orgUnit.id,
        }),
    },
}

const WorkflowProvider = ({ children }) => {
    const { workflow, period, orgUnit } = useSelectionContext()
    const { fetching, error, data, called, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const fetchApprovalStatus = () => refetch({ workflow, period, orgUnit })

    useEffect(() => {
        if (workflow && period && orgUnit) {
            fetchApprovalStatus()
        }
    }, [workflow, period, orgUnit])

    if (!workflow || !period || !orgUnit) {
        return null
    }

    if (fetching || !called) {
        return <Loader />
    }

    if (error) {
        return (
            <ErrorMessage title={i18n.t('Could not load approval data')}>
                <p>{error.message}</p>
                <RetryButton onClick={fetchApprovalStatus}>
                    {i18n.t('Retry loading approval data')}
                </RetryButton>
            </ErrorMessage>
        )
    }

    const {
        state: approvalStatus,
        approvedBy,
        approvedAt,
        ...allowedActions
    } = data.approvalStatus

    return (
        <WorkflowContext.Provider
            value={{
                approvalStatus,
                approvedBy,
                approvedAt,
                allowedActions,
                refresh: refetch,
                params: {
                    wf: workflow.id,
                    pe: period.id,
                    ou: orgUnit.id,
                },
            }}
        >
            {children}
        </WorkflowContext.Provider>
    )
}

WorkflowProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { WorkflowProvider }
