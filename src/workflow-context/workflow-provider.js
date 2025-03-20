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
        params: ({ workflow, period, orgUnit, attributeOptionCombo }) => ({
            wf: workflow.id,
            pe: period.id,
            ou: orgUnit.id,
            aoc: attributeOptionCombo.id
        }),
    },
}

const WorkflowProvider = ({ children }) => {
    const { workflow, period, orgUnit, attributeOptionCombo } = useSelectionContext();
    const { fetching, error, data, called, refetch } = useDataQuery(query, {
        lazy: true,
    });
    
    const fetchApprovalStatus = () => refetch({ workflow, period, orgUnit, attributeOptionCombo });

    useEffect(() => {
        if (workflow && period && orgUnit && attributeOptionCombo) {
            fetchApprovalStatus();
        }
    }, [workflow, period, orgUnit, attributeOptionCombo]);
    
    // Handle workflow without datasets
    if(workflow && workflow.dataSets.length == 0 ) {
        return (
            <ErrorMessage title={i18n.t('Could not load approval data')}>
                <p>{i18n.t('The selected workflow "{{workflowName}}" does not have any associated data sets.', {
                        workflowName: workflow?.displayName,
                        nsSeparator: '-:-',
                    })}</p>
                <p>{i18n.t("Please verify the workflow configuration or select a different workflow that includes data sets.")}</p>
            </ErrorMessage>
        )   
    }
    
    // Handle Fetching approval data errors
    if (error) {
        return (
            <ErrorMessage title={i18n.t('Could not load approval data')}>
                <p>{error?.message}</p>
                <RetryButton onClick={fetchApprovalStatus}>
                    {i18n.t('Retry loading approval data')}
                </RetryButton>
            </ErrorMessage>
        )
    }
    
    // Handle missing required selections
    if (!workflow || !period || !orgUnit || (workflow.dataSets.length > 0 && !attributeOptionCombo)) {
        return null;
    }

    // Handle loading state
    if ((workflow.dataSets.length > 0 && attributeOptionCombo && fetching) || !called) {
        return <Loader />;
    }
    
    // Destructure response data
    const {
        state: approvalStatus,
        approvedBy,
        approvedAt,
        acceptedBy,
        acceptedAt,
        ...allowedActions
    } = data?.approvalStatus || {}

    return (
        <WorkflowContext.Provider
            value={{
                approvalStatus,
                approvedBy,
                approvedAt,
                acceptedBy,
                acceptedAt,
                allowedActions,
                refresh: refetch,
                params: {
                    wf: workflow.id,
                    pe: period.id,
                    ou: orgUnit.id,
                    aoc: attributeOptionCombo?.id,
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
