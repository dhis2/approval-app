export const cloneJSON = (object) => {
    if (typeof structuredClone === 'function') {
        return structuredClone(object)
    }

    return JSON.parse(JSON.stringify(object))
}

export const areListsEqual = (list1, list2) => {
    if (list1.length !== list2.length) {
        return false
    }

    sortList(list1)
    sortList(list2)

    return list1.every((value, index) => value === list2[index])
}

export const sortList = (list) => {
    list.sort((a, b) => a.localeCompare(b))
}
