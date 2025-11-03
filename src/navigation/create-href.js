import queryString from 'query-string'

export const createHref = (state) => `/#/?${queryString.stringify(state)}`
