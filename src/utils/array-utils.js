export const cloneJSON = (object) => {
    /* eslint-disable no-undef */
    if (typeof structuredClone === 'function') {
        return structuredClone(object);
    }
    /* eslint-enable no-undef */
    return JSON.parse(JSON.stringify(object));
};

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
