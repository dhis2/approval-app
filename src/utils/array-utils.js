export const cloneJSON = (object) => {
    return JSON.parse(JSON.stringify(object));
}

export const hashById = (array) =>
    array.reduce((acc, curr) => {
        acc[curr.id] = curr
        return acc
    }, {})
    
export const hashArraysInObject = (result, hashFunction = hashById) =>
    Object.keys(result).reduce((acc, currKey) => {
        const prop = result[currKey]
        if (Array.isArray(prop)) {
            acc[currKey] = hashFunction(result[currKey])
        } else {
            acc[currKey] = prop
        }
        return acc
    }, {})
    
export const areListsEqual = (list1, list2) => {
    if (list1.length !== list2.length) {
        return false;
    }

    // Sort both lists and compare
    const sortedList1 = [...list1].sort();
    const sortedList2 = [...list2].sort();

    return sortedList1.every((value, index) => value === sortedList2[index]);
}

export const findObject = (list, property, value) => {
    return list.find(item => item[property] === value);
};