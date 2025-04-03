import { useMemo } from 'react'
import { useAppContext } from '../../app-context/use-app-context.js'
import { useSelectionContext } from '../../selection-context/index.js'
import { filterDataSetsByAttributeOptionComboAndOrgUnit } from '../../utils/caterogy-combo-utils.js'

export const useSelectedDataSet = () => {
    const { metadata } = useAppContext()
    const { workflow, dataSet, orgUnit, attributeOptionCombo} = useSelectionContext()
    const availableDataSets = filterDataSetsByAttributeOptionComboAndOrgUnit(metadata, workflow, orgUnit, attributeOptionCombo)
    
    return useMemo(() => {
        const dataSets = (!attributeOptionCombo) ? workflow?.dataSets : availableDataSets
        
        if (dataSets.length === 1) {
            return dataSets[0].id
        }

        if (dataSet) {
            const found = dataSets.find(({ id }) => id === dataSet)
            return found?.id
        }

        return null
    }, [workflow, dataSet])
}
