import { useDataQuery } from '@dhis2/app-runtime'
import { Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader } from '../shared/index.js'
import { AppContext } from './app-context.js'

const query = {
    me: {
        resource: 'me',
        params: {
            fields: ['authorities', 'organisationUnits[id,path]'],
        },
    },
    dataApprovalWorkflows: {
        // This is generic enpoint but will only return
        // workflows a user is allowed to see
        resource: 'dataApprovalWorkflows',
        params: {
            paging: false,
            fields: [
                'id',
                'displayName',
                'dataApprovalLevels',
                'periodType',
                'dataSets[id,displayName,periodType,formType,categoryCombo[id],organisationUnits[id,path]]'
            ],
        },
    },
    metadata: {
        resource: 'categoryCombos',
        params: {
            paging: false,
            fields: [
                'id',
                'displayName',
                'isDefault',
                'categories[displayName,name,id,categoryOptions[id,displayName,name,startDate,endDate,organisationUnits[id,path]]]',
                'categoryOptionCombos[id,displayName,categoryOptions[id,displayName,name,startDate,endDate,organisationUnits[id,path]]]',
            ],
        },
    }
}

const AppProvider = ({ children }) => {
    const { data, fetching, error } = useDataQuery(query)

    if (fetching) {
        return (
            <Layer>
                <Loader />
            </Layer>
        )
    }

    if (error) {
        /**
         * The app can't continue if this fails, because it doesn't
         * have any data, so throw the error and let it be caught by
         * the error boundary in the app-shell
         */
        throw error
    }

    const { authorities, organisationUnits } = data.me
    const { dataApprovalWorkflows } = data.dataApprovalWorkflows
    const { metadata } = data
    const providerValue = {
        authorities,
        organisationUnits,
        dataApprovalWorkflows,
        metadata
    }

    return (
        <AppContext.Provider value={providerValue}>
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AppProvider }
