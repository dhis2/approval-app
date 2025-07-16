import { TabBar, Tab } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const DataSetNavigation = ({ dataSets, selected, onChange }) =>
    dataSets && dataSets?.length > 0 ? (
        <TabBar scrollable>
            {dataSets.map((dataSet) => (
                <Tab
                    key={dataSet.id}
                    onClick={() => onChange(dataSet.id)}
                    selected={dataSet.id === selected}
                >
                    {dataSet.displayName}
                </Tab>
            ))}
        </TabBar>
    ) : null

DataSetNavigation.propTypes = {
    onChange: PropTypes.func.isRequired,
    dataSets: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string,
            id: PropTypes.string,
            periodType: PropTypes.string,
        })
    ),
    selected: PropTypes.string,
}

export { DataSetNavigation }
