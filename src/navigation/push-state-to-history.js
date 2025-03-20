import { stringify } from 'query-string'
import { history } from './history.js'

export const pushStateToHistory = (state) => {
    const paramString = stringify({
        wf: state.workflow?.id,
        pe: state.period?.id,
        ou: state.orgUnit?.path,
        aoc: state.attributeOptionCombo?.id,
        ouDisplayName: state.orgUnit?.displayName,

        // not an object, use "undefined" so there's no empty query param in
        // url
        dataSet: state.dataSet || undefined,
    })

    const search = paramString ? `?${paramString}` : ''

    // Only push if the search string changes
    if (search !== history.location.search) {
        history.push({
            pathname: '/',
            search,
        })
    }
}