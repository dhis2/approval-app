import {
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'

const GREGORY_CALENDARS = ['gregory', 'gregorian', 'iso8601'] // calendars that can be parsed by JS Date
const DATE_ONLY_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

// testing (a < b) is equivalent to testing (b > a), so we reuse the other function
export const isDateAGreaterThanDateB = (
    dateA,
    dateB,
    { inclusive = false } = {}
) => {
    return isDateALessThanDateB(dateB, dateA, { inclusive })
}

/**
 * 
 * isDateALessThanDateB({ date: '2024-01-02' }, { date: '2024-01-02' }, { inclusive: true } ) ==> Output: true
 * isDateALessThanDateB({ date: '2024-01-02' },, {} ) ==> Output: false
 * 
 */
export const isDateALessThanDateB = (
    { date: dateA, calendar: calendarA = 'gregory' } = {},
    { date: dateB, calendar: calendarB = 'gregory' } = {},
    { inclusive = false } = {}
) => {
    // If either dateA or dateB is missing, return false immediately.
    if (!dateA || !dateB) {
        return false
    }
    // we first convert dates to ISO strings
    const dateAISO = convertToIso8601ToString(dateA, calendarA)
    const dateBISO = convertToIso8601ToString(dateB, calendarB)

    // if date is in format 'YYYY-MM-DD', when passed to JavaScript Date() it will give us 00:00 in UTC time (not client time)
    // dates with time information are interpreted in client time
    // we need the dates to be parsed in consistent time zone (i.e. client), so we add T00:00 to YYYY-MM-DD dates
    const dateAString = DATE_ONLY_REGEX.test(dateAISO)
        ? dateAISO + 'T00:00'
        : dateAISO
    const dateBString = DATE_ONLY_REGEX.test(dateBISO)
        ? dateBISO + 'T00:00'
        : dateBISO

    const dateADate = new Date(dateAString)
    const dateBDate = new Date(dateBString)

    // if dates are invalid, return null
    if (isNaN(dateADate)) {
        console.error(`Invalid date: ${dateA}`, dateAString, dateAISO)
        return null
    }

    if (isNaN(dateBDate)) {
        console.error(`Invalid date: ${dateB}`, dateBString, dateBISO)
        return null
    }

    if (inclusive) {
        return dateADate <= dateBDate
    } else {
        return dateADate < dateBDate
    }
}


const convertToIso8601ToString = (date, calendar) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.includes(calendar)) {
        return date
    }

    // separate the YYYY-MM-DD and time portions of the string
    const inCalendarDateString = date.substring(0, 10)
    const timeString = date.substring(11)

    const { year, month, day } = convertToIso8601(
        inCalendarDateString,
        calendar
    )

    return `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(
        day,
        2
    )}${timeString ? 'T' + timeString : ''}`
}


const padWithZeros = (startValue, minLength) => {
    try {
        const startString = String(startValue)
        return startString.padStart(minLength, '0')
    } catch (e) {
        console.error(e)
        return startValue
    }
}