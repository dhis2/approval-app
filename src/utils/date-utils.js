import { convertToIso8601 } from '@dhis2/multi-calendar-dates'

const GREGORY_CALENDARS = new Set(['gregory', 'gregorian', 'iso8601']) // calendars that can be parsed by JS Date
const DATE_ONLY_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

/**
 * Compares two dates and checks if `dateA` is greater than `dateB`.
 *
 * @param {{ date: string, calendar?: string }} dateA - The first date to compare (left side of `>` or `>=`).
 * @param {{ date: string, calendar?: string }} dateB - The second date to compare (right side of `>` or `>=`).
 * @param {{ inclusive?: boolean }} [options] - Comparison options.
 * @param {boolean} [options.inclusive=false] - If `true`, checks if `dateA >= dateB`; otherwise checks `dateA > dateB`.
 *
 * @returns {boolean | null} - Returns `true` if `dateA` is greater than (or equal to, if inclusive) `dateB`,
 * `false` if not, or `null` if either date is invalid.
 *
 * @example
 * isDateAGreaterThanDateB({ date: '2024-05-01' }, { date: '2024-04-30' });
 * // → true
 *
 * isDateAGreaterThanDateB({ date: '2024-05-01' }, { date: '2024-05-01' }, { inclusive: true });
 * // → true
 *
 * isDateAGreaterThanDateB({ date: '2024-05-01' }, { date: '2024-05-01' });
 * // → false
 */
export const isDateAGreaterThanDateB = (
    dateA,
    dateB,
    { inclusive = false } = {}
) => {
    return isDateALessThanDateB(dateB, dateA, { inclusive })
}

/**
 * Compares two dates to check if `dateA` is less than `dateB`.
 * Supports optional inclusiveness and calendar system specification.
 *
 * This function safely handles ISO date strings (`YYYY-MM-DD` or full ISO formats),
 * and ensures consistent comparison by appending `T00:00` to date-only strings to avoid UTC/local time mismatch.
 *
 * @param {Object} paramA - First date object.
 * @param {string} paramA.date - The first date string to compare (required).
 * @param {string} [paramA.calendar='gregory'] - The calendar system used for the first date (default is 'gregory').
 *
 * @param {Object} paramB - Second date object.
 * @param {string} paramB.date - The second date string to compare (required).
 * @param {string} [paramB.calendar='gregory'] - The calendar system used for the second date (default is 'gregory').
 *
 * @param {Object} [options={}] - Optional configuration.
 * @param {boolean} [options.inclusive=false] - If true, checks if dateA is less than or **equal to** dateB.
 *
 * @returns {boolean|null} - Returns `true` if dateA is less than (or equal to, if inclusive) dateB,
 * `false` otherwise. Returns `null` if either date is invalid.
 *
 * @example
 * isDateALessThanDateB({ date: '2024-01-01' }, { date: '2024-01-02' });
 * // → true
 *
 * isDateALessThanDateB({ date: '2024-01-02' }, { date: '2024-01-02' }, { inclusive: true });
 * // → true
 *
 * isDateALessThanDateB({ date: '2024-01-02' }, { date: '2024-01-02' });
 * // → false
 *
 * isDateALessThanDateB({ date: 'invalid-date' }, { date: '2024-01-01' });
 * // → null
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
    if (Number.isNaN(dateADate)) {
        console.error(`Invalid date: ${dateA}`, dateAString, dateAISO)
        return null
    }

    if (Number.isNaN(dateBDate)) {
        console.error(`Invalid date: ${dateB}`, dateBString, dateBISO)
        return null
    }

    if (inclusive) {
        return dateADate <= dateBDate
    } else {
        return dateADate < dateBDate
    }
}

/**
 * Converts a date string to an ISO 8601 `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss` format.
 *
 * If the input calendar is Gregorian or the date is already in ISO format, it returns the input date as-is.
 * Otherwise, it uses the `convertToIso8601` utility to transform the date portion while preserving the time component if present.
 *
 * @param {string} date - The input date string, potentially in a non-Gregorian format (e.g., `2024-01-01` or `2024-01-01T10:30:00`).
 * @param {string} calendar - The calendar system of the input date (e.g., `'gregory'`, `'buddhist'`, `'islamic'`, etc.).
 *
 * @returns {string | undefined} - Returns a date string in ISO 8601 format. Returns `undefined` if the input date is falsy.
 *
 * @example
 * convertToIso8601ToString('2024-01-01', 'gregory');
 * // → '2024-01-01'
 *
 * convertToIso8601ToString('1445-10-01', 'islamic');
 * // → '2024-03-12' (converted to Gregorian ISO format, assuming calendar mapping logic)
 *
 * convertToIso8601ToString('1445-10-01T08:30:00', 'islamic');
 * // → '2024-03-12T08:30:00'
 */
const convertToIso8601ToString = (date, calendar) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.has(calendar)) {
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
