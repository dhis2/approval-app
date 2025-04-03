
export const transformDataValues = (dataSet, dataValues) =>  {
    return dataSet.dataSetElements.map((dataSetElement) => {
        const de = dataSetElement.dataElement
        // Filter values corresponding to the current data element
        const valuesForDE = dataValues.filter((dv) => dv.dataElement === de.id)
        
        // Calculate the total value or assign an empty string if no values exist
        const totalValue = valuesForDE.length > 0 
          ? valuesForDE.reduce((sum, dv) => sum + parseFloat(dv.value), 0)
          : "" // Set to an empty string if no values are found
        
        // Return the desired structure
        return [de.displayName, totalValue]
    });
}