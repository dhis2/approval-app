import React from 'react'
import { useSelectionContext } from '../selection-context/index.js'
import { DataSetNavigation } from './data-set-navigation/index.js'
import { Display } from './display/index.js'
import { TitleBar } from './title-bar/index.js'
import { useSelectedDataSet } from './use-selected-data-set/index.js'

const DataWorkspace = () => {
    const { workflow, selectDataSet } = useSelectionContext()
    const selectedDataSet = useSelectedDataSet()

    return (
        <>
            <TitleBar />
            <DataSetNavigation
                dataSets={workflow?.dataSets}
                selected={selectedDataSet}
                onChange={selectDataSet}
            />
            <Display dataSetId={selectedDataSet} />
        </>
    )
}

export { DataWorkspace }
