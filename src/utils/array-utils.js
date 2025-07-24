export const cloneJSON = (object) => {
    return JSON.parse(JSON.stringify(object))
}

export const areListsEqual = (list1, list2) => {
    if (list1.length !== list2.length) {
        return false
    }

    const sortedList1 = [...list1].sort((a, b) => a.localeCompare(b))
    const sortedList2 = [...list2].sort((a, b) => a.localeCompare(b))

    return sortedList1.every((value, index) => value === sortedList2[index])
}

export const findObject = (list, property, value) => {
    return list.find((item) => item[property] === value)
}
