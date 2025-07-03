import { parse } from 'query-string'
import { history } from './history.js'

export const readQueryParams = () => {
    const params = parse(history.location.search)

    // ensure only known params are returned
    return {
        wf: params.wf,
        pe: params.pe,
        ou: params.ou,
        aoc: params.aoc,
        ouDisplayName: params.ouDisplayName,
        dataSet: params.dataSet,
    }
}
