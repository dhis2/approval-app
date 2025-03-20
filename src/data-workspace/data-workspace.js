import React from 'react'
import { useSelectionContext } from '../selection-context/index.js'
import { filterDataSetsByAttributeOptionComboAndOrgUnit } from '../utils/caterogy-combo-utils.js'
import { DataSetNavigation } from './data-set-navigation/index.js'
import { Display } from './display/index.js'
import { TitleBar } from './title-bar/index.js'
import { useSelectedDataSet } from './use-selected-data-set/index.js'
import { useAppContext } from '../app-context/use-app-context.js'

const DataWorkspace = () => {
    const { metadata } = useAppContext()
    const { workflow, orgUnit, attributeOptionCombo, selectDataSet } = useSelectionContext()
    const selectedDataSet = useSelectedDataSet()
    
    const dataSets = filterDataSetsByAttributeOptionComboAndOrgUnit(metadata, workflow, orgUnit, attributeOptionCombo)

    return (
        <>
            <TitleBar />
            <DataSetNavigation
                dataSets={dataSets}
                selected={selectedDataSet}
                onChange={selectDataSet}
            />
            <Display dataSetId={selectedDataSet} />
        </>
    )
}

export { DataWorkspace }
