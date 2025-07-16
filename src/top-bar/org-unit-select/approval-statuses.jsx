import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { APPROVAL_STATUSES } from '../../shared/index.js'

const ApprovalStatusesContext = createContext()

const useApprovalStatusesContext = () => useContext(ApprovalStatusesContext)

class ApprovalStatusesMap {
    constructor(map) {
        this._map = map || new Map()
    }

    _serialiseKey({ workflowId, periodId, orgUnitId }) {
        return `${workflowId}-${periodId}-${orgUnitId}`
    }

    set(key, status) {
        this._map.set(this._serialiseKey(key), status)
    }

    get(key) {
        return this._map.get(this._serialiseKey(key))
    }

    clone() {
        return new ApprovalStatusesMap(new Map(this._map))
    }
}

const useFetchApprovalStatus = ({ updateApprovalStatuses }) => {
    const engine = useDataEngine()
    const requestQueue = useRef([])
    const fetchApprovalStatuses = useDebouncedCallback(() => {
        const batchedQueries = []
        requestQueue.current.forEach((query) => {
            const existingBatchedQuery = batchedQueries.find(
                ({ workflowId, periodId }) => {
                    return (
                        workflowId === query.workflowId &&
                        periodId === query.periodId
                    )
                }
            )
            if (existingBatchedQuery) {
                existingBatchedQuery.orgUnitIds.push(query.orgUnitId)
            } else {
                batchedQueries.push({
                    workflowId: query.workflowId,
                    periodId: query.periodId,
                    orgUnitIds: [query.orgUnitId],
                })
            }
        })
        requestQueue.current = []

        batchedQueries.forEach(async ({ workflowId, periodId, orgUnitIds }) => {
            updateApprovalStatuses({
                periodId,
                workflowId,
                approvalStatusUpdates: orgUnitIds.reduce(
                    (statuses, orgUnitId) => {
                        statuses[orgUnitId] = APPROVAL_STATUSES.LOADING
                        return statuses
                    },
                    {}
                ),
            })

            const updateObject = {}
            try {
                const { approvalStatuses } = await engine.query({
                    approvalStatuses: {
                        resource: 'dataApprovals/approvals',
                        params: {
                            wf: workflowId,
                            pe: periodId,
                            ou: orgUnitIds,
                        },
                    },
                })
                approvalStatuses.forEach(({ ou, state }) => {
                    updateObject[ou] = state || APPROVAL_STATUSES.UNAPPROVABLE
                })
            } catch (error) {
                orgUnitIds.forEach((orgUnitId) => {
                    updateObject[orgUnitId] = APPROVAL_STATUSES.ERROR
                })
            }
            updateApprovalStatuses({
                periodId,
                workflowId,
                approvalStatusUpdates: updateObject,
            })
        })
    }, 10)

    return ({ workflowId, periodId, orgUnitId }) => {
        requestQueue.current.push({
            periodId,
            workflowId,
            orgUnitId,
        })
        fetchApprovalStatuses()
    }
}

export const ApprovalStatusesProvider = ({ children }) => {
    const [approvalStatuses, setApprovalStatuses] = useState(
        new ApprovalStatusesMap()
    )
    const updateApprovalStatuses = ({
        workflowId,
        periodId,
        approvalStatusUpdates,
    }) => {
        setApprovalStatuses((approvalStatuses) => {
            const newApprovalStatuses = approvalStatuses.clone()
            for (const [orgUnitId, status] of Object.entries(
                approvalStatusUpdates
            )) {
                newApprovalStatuses.set(
                    { workflowId, periodId, orgUnitId },
                    status
                )
            }
            return newApprovalStatuses
        })
    }
    const fetchApprovalStatus = useFetchApprovalStatus({
        updateApprovalStatuses,
    })

    return (
        <ApprovalStatusesContext.Provider
            value={{ approvalStatuses, fetchApprovalStatus }}
        >
            {children}
        </ApprovalStatusesContext.Provider>
    )
}

ApprovalStatusesProvider.propTypes = {
    children: PropTypes.node,
}

export const useApprovalStatus = () => {
    const { approvalStatuses, fetchApprovalStatus } =
        useApprovalStatusesContext()

    return {
        getApprovalStatus: ({ workflowId, periodId, orgUnitId }) => {
            return approvalStatuses.get({
                workflowId,
                periodId,
                orgUnitId,
            })
        },
        fetchApprovalStatus,
    }
}
