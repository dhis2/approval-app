import {
    isValidPeriodType,
    getYearWithOffset,
    getFixedPeriodType,
    getFixedPeriodTypes,
    getFixedPeriodsForTypeAndDateRange,
    getYearOffsetFromNow,
    parsePeriodId,
    getMostRecentCompletedYear,
} from './fixed-periods.js'

describe('Fixed period utilities', () => {
    beforeAll(() =>
        // 2019-06-17
        jest.spyOn(Date, 'now').mockImplementation(() => 1560765600000)
    )

    describe('Daily period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'Daily' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of days in 2019', () => {
            expect(periods.length).toEqual(365)
        })

        it('should return the correct object for 1 jan 2019 day', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-01-01',
                iso: '20190101',
                id: '20190101',
            })
            expect(periods[0].displayName).toEqual('2019-01-01')
        })

        it('should return the correct object for 31 dec 2019 day', () => {
            expect(periods[364]).toMatchObject({
                startDate: '2019-12-31',
                endDate: '2019-12-31',
                iso: '20191231',
                id: '20191231',
            })

            expect(periods[364].displayName).toEqual('2019-12-31')
        })
    })

    describe('Weekly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'Weekly' })

            periods = option.getPeriods({
                offset: 2009 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of weeks in 2009', () => {
            expect(periods.length).toEqual(53)
        })

        it('should return the correct object for week 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2008-12-29',
                endDate: '2009-01-04',
                iso: '2009W1',
                id: '2009W1',
            })
            expect(periods[0].displayName).toEqual(
                'Week 1 - 2008-12-29 - 2009-01-04'
            )
        })

        it('should return the correct object for week 53', () => {
            expect(periods[52]).toMatchObject({
                startDate: '2009-12-28',
                endDate: '2010-01-03',
                iso: '2009W53',
                id: '2009W53',
            })
            expect(periods[52].displayName).toEqual(
                'Week 53 - 2009-12-28 - 2010-01-03'
            )
        })

        describe('-> Weekly Wednesday', () => {
            beforeAll(() => {
                const option = getFixedPeriodType({
                    periodType: 'WeeklyWednesday',
                })

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly wednesday in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly wednesday 27', () => {
                expect(periods[26]).toMatchObject({
                    startDate: '2019-07-03',
                    endDate: '2019-07-09',
                    iso: '2019WedW27',
                    id: '2019WedW27',
                })
                expect(periods[26].displayName).toEqual(
                    'Week 27 - 2019-07-03 - 2019-07-09'
                )
            })
        })

        describe('-> Weekly Thursday', () => {
            beforeAll(() => {
                const option = getFixedPeriodType({
                    periodType: 'WeeklyThursday',
                })

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly thursday in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly thursday 27', () => {
                expect(periods[26]).toMatchObject({
                    startDate: '2019-07-04',
                    endDate: '2019-07-10',
                    iso: '2019ThuW27',
                    id: '2019ThuW27',
                })
                expect(periods[26].displayName).toEqual(
                    'Week 27 - 2019-07-04 - 2019-07-10'
                )
            })
        })

        describe('-> Weekly Saturday', () => {
            beforeAll(() => {
                const option = getFixedPeriodType({
                    periodType: 'WeeklySaturday',
                })

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly saturdays in 2019', () => {
                expect(periods.length).toEqual(53)
            })

            it('should return the correct object for weekly saturday 10', () => {
                expect(periods[9]).toMatchObject({
                    startDate: '2019-03-02',
                    endDate: '2019-03-08',
                    iso: '2019SatW10',
                    id: '2019SatW10',
                })

                expect(periods[9].displayName).toEqual(
                    'Week 10 - 2019-03-02 - 2019-03-08'
                )
            })
        })

        describe('-> Weekly Sunday', () => {
            beforeAll(() => {
                const option = getFixedPeriodType({
                    periodType: 'WeeklySunday',
                })

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly sundays in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly sunday 10', () => {
                expect(periods[10]).toMatchObject({
                    startDate: '2019-03-10',
                    endDate: '2019-03-16',
                    iso: '2019SunW11',
                    id: '2019SunW11',
                })
                expect(periods[10].displayName).toEqual(
                    'Week 11 - 2019-03-10 - 2019-03-16'
                )
            })
        })
    })

    describe('Bi-weekly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'BiWeekly' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of bi-weeks in 2019', () => {
            expect(periods.length).toEqual(26)
        })

        it('should return the correct object for bi-week 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2018-12-31',
                endDate: '2019-01-13',
                iso: '2019BiW1',
                id: '2019BiW1',
            })
            expect(periods[0].displayName).toEqual(
                'Bi-Week 1 - 2018-12-31 - 2019-01-13'
            )
        })

        it('should return the correct object for bi-week 26', () => {
            expect(periods[25]).toMatchObject({
                startDate: '2019-12-16',
                endDate: '2019-12-29',
                iso: '2019BiW26',
                id: '2019BiW26',
            })
            expect(periods[25].displayName).toEqual(
                'Bi-Week 26 - 2019-12-16 - 2019-12-29'
            )
        })
    })

    describe('Monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'Monthly' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of months in 2019', () => {
            expect(periods.length).toEqual(12)
        })

        it('should return the correct object for month 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-01-31',
                iso: '201901',
                id: '201901',
            })
            expect(periods[0].displayName).toEqual('January 2019')
        })

        it('should return the correct object for month 12', () => {
            expect(periods[11]).toMatchObject({
                startDate: '2019-12-01',
                endDate: '2019-12-31',
                iso: '201912',
                id: '201912',
            })
            expect(periods[11].displayName).toEqual('December 2019')
        })
    })

    describe('Bi-Monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'BiMonthly' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of bi-months in 2019', () => {
            expect(periods.length).toEqual(6)
        })

        it('should return the correct object for bi-month 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-02-28',
                iso: '201901B',
                id: '201901B',
            })
            expect(periods[0].displayName).toEqual('January - February 2019')
        })

        it('should return the correct object for bi-month 3', () => {
            expect(periods[2]).toMatchObject({
                startDate: '2019-05-01',
                endDate: '2019-06-30',
                iso: '201903B',
                id: '201903B',
            })
            expect(periods[2].displayName).toEqual('May - June 2019')
        })

        it('should return the correct object for bi-month 6', () => {
            expect(periods[5]).toMatchObject({
                startDate: '2019-11-01',
                endDate: '2019-12-31',
                iso: '201906B',
                id: '201906B',
            })
            expect(periods[5].displayName).toEqual('November - December 2019')
        })
    })

    describe('Quarterly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'Quarterly' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of quarters in 2019', () => {
            expect(periods.length).toEqual(4)
        })

        it('should return the correct object for quarter 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-03-31',
                iso: '2019Q1',
                id: '2019Q1',
            })
            expect(periods[0].displayName).toEqual('January - March 2019')
        })

        it('should return the correct object for quarter 4', () => {
            expect(periods[3]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2019-12-31',
                iso: '2019Q4',
                id: '2019Q4',
            })
            expect(periods[3].displayName).toEqual('October - December 2019')
        })
    })

    describe('Six-monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'SixMonthly' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of six-month periods in 2019', () => {
            expect(periods.length).toEqual(2)
        })

        it('should return the correct object for six-monthly 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-06-30',
                iso: '2019S1',
                id: '2019S1',
            })
            expect(periods[0].displayName).toEqual('January - June 2019')
        })

        it('should return the correct object for six-monthly 2', () => {
            expect(periods[1]).toMatchObject({
                startDate: '2019-07-01',
                endDate: '2019-12-31',
                iso: '2019S2',
                id: '2019S2',
            })
            expect(periods[1].displayName).toEqual('July - December 2019')
        })
    })

    describe('Six-monthly April period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'SixMonthlyApril' })

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of six-monthly April periods in 2019', () => {
            expect(periods.length).toEqual(2)
        })

        it('should return the correct object for six-monthly April 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-04-01',
                endDate: '2019-09-30',
                iso: '2019AprilS1',
                id: '2019AprilS1',
            })
            expect(periods[0].displayName).toEqual('April - September 2019')
        })

        it('should return the correct object for six-monthly April 2', () => {
            expect(periods[1]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2020-03-31',
                iso: '2019AprilS2',
                id: '2019AprilS2',
            })
            expect(periods[1].displayName).toEqual('October 2019 - March 2020')
        })
    })

    describe('Yearly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'Yearly' })

            periods = option.getPeriods({
                offset: 10, // 2020 - 2029
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of yearly periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for yearly period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2020-01-01',
                endDate: '2020-12-31',
                iso: '2020',
                id: '2020',
            })
            expect(periods[0].displayName).toEqual('2020')
        })

        it('should return the correct object for yearly period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2029-01-01',
                endDate: '2029-12-31',
                iso: '2029',
                id: '2029',
            })
            expect(periods[9].displayName).toEqual('2029')
        })
    })

    describe('Financial November period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'FinancialNov' })

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial November periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial November period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-11-01',
                endDate: '2020-10-31',
                id: '2019Nov',
            })
            expect(periods[0].displayName).toEqual(
                'November 2019 - October 2020'
            )
        })

        it('should return the correct object for financial November period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-11-01',
                endDate: '2029-10-31',
                id: '2028Nov',
            })
            expect(periods[9].displayName).toEqual(
                'November 2028 - October 2029'
            )
        })
    })

    describe('Financial October period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'FinancialOct' })

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial October periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial October period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2020-09-30',
                id: '2019Oct',
            })
            expect(periods[0].displayName).toEqual(
                'October 2019 - September 2020'
            )
        })

        it('should return the correct object for financial October period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-10-01',
                endDate: '2029-09-30',
                id: '2028Oct',
            })
            expect(periods[9].displayName).toEqual(
                'October 2028 - September 2029'
            )
        })
    })

    describe('Financial July period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'FinancialJuly' })

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial July periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial July 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-07-01',
                endDate: '2020-06-30',
                id: '2019July',
            })
            expect(periods[0].displayName).toEqual('July 2019 - June 2020')
        })

        it('should return the correct object for financial July period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-07-01',
                endDate: '2029-06-30',
                id: '2028July',
            })
            expect(periods[9].displayName).toEqual('July 2028 - June 2029')
        })
    })

    describe('Financial April period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodType({ periodType: 'FinancialApril' })

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial April periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial April 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-04-01',
                endDate: '2020-03-31',
                id: '2019April',
            })
            expect(periods[0].displayName).toEqual('April 2019 - March 2020')
        })

        it('should return the correct object for financial April period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-04-01',
                endDate: '2029-03-31',
                id: '2028April',
            })
            expect(periods[9].displayName).toEqual('April 2028 - March 2029')
        })
    })

    /*
     * PERIOD ID PARSER
     */
    describe('Period id parser', () => {
        it('should parse daily periods correctly', () => {
            const period = parsePeriodId('20140101')
            expect(period.periodType.type).toEqual('Daily')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly periods correctly', () => {
            const period = parsePeriodId('2014W9')
            expect(period.periodType.type).toEqual('Weekly')
            expect(period).toMatchSnapshot()
        })

        it('should parse bi-weekly periods correctly', () => {
            const period = parsePeriodId('2014BiW9')
            expect(period.periodType.type).toEqual('BiWeekly')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-wednessday periods correctly', () => {
            const period = parsePeriodId('2014WedW9')
            expect(period.periodType.type).toEqual('WeeklyWednesday')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-thursday periods correctly', () => {
            const period = parsePeriodId('2014ThuW9')
            expect(period.periodType.type).toEqual('WeeklyThursday')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-saturday periods correctly', () => {
            const period = parsePeriodId('2014SatW9')
            expect(period.periodType.type).toEqual('WeeklySaturday')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-sunday periods correctly', () => {
            const period = parsePeriodId('2014SunW9')
            expect(period.periodType.type).toEqual('WeeklySunday')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-sunday periods correctly', () => {
            const period = parsePeriodId('2014SunW9')
            expect(period.periodType.type).toEqual('WeeklySunday')
            expect(period).toMatchSnapshot()
        })

        it('should parse monthly periods correctly', () => {
            const period = parsePeriodId('201406')
            expect(period.periodType.type).toEqual('Monthly')
            expect(period).toMatchSnapshot()
        })

        it('should parse bimonthly periods correctly', () => {
            const period = parsePeriodId('201406B')
            expect(period.periodType.type).toEqual('BiMonthly')
            expect(period).toMatchSnapshot()
        })

        it('should parse quarterly periods correctly', () => {
            const period = parsePeriodId('2014Q1')
            expect(period.periodType.type).toEqual('Quarterly')
            expect(period).toMatchSnapshot()
        })

        it('should parse six-monthly periods correctly', () => {
            const period = parsePeriodId('2014S1')
            expect(period.periodType.type).toEqual('SixMonthly')
            expect(period).toMatchSnapshot()
        })

        it('should parse six-monthly-april periods correctly', () => {
            const period = parsePeriodId('2014AprilS1')
            expect(period.periodType.type).toEqual('SixMonthlyApril')
            expect(period).toMatchSnapshot()
        })

        it('should parse yearly periods correctly', () => {
            const period = parsePeriodId('2014')
            expect(period.periodType.type).toEqual('Yearly')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-november periods correctly', () => {
            const period = parsePeriodId('2014Nov')
            expect(period.periodType.type).toEqual('FinancialNov')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-october periods correctly', () => {
            const period = parsePeriodId('2014Oct')
            expect(period.periodType.type).toEqual('FinancialOct')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-july periods correctly', () => {
            const period = parsePeriodId('2014July')
            expect(period.periodType.type).toEqual('FinancialJuly')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-april periods correctly', () => {
            const period = parsePeriodId('2014April')
            expect(period.periodType.type).toEqual('FinancialApril')
            expect(period).toMatchSnapshot()
        })
    })

    /*
     * HELPERS
     */
    describe('Helper functions', () => {
        describe('getFixedPeriodType', () => {
            // Behaviour for valid period tpes is tested via the generators
            it('should throw an error if an invalid period type is provided', () => {
                expect(() =>
                    getFixedPeriodType({ periodType: 'INVALID' })
                ).toThrowError(
                    'Invalid period type "INVALID" supplied to "getFixedPeriodType"'
                )
            })
        })

        describe('getYearOffsetFromNow', () => {
            it('should throw an error if an invalid year value is provided', () => {
                expect(() => getYearOffsetFromNow()).toThrowError(
                    'Invalid year "undefined" passed to "getYearOffsetFromNow"'
                )
                expect(() => getYearOffsetFromNow('INVALID')).toThrowError(
                    'Invalid year "INVALID" passed to "getYearOffsetFromNow"'
                )
            })
            it('should process future offsets correctly', () => {
                expect(getYearOffsetFromNow('2025')).toEqual(6)
            })
            it('should process past offsets correctly', () => {
                expect(getYearOffsetFromNow('2014')).toEqual(-5)
            })
        })

        describe('isValidPeriodType', () => {
            it('returns true for valid period types', () => {
                expect(isValidPeriodType('Daily')).toBe(true)
                expect(isValidPeriodType('Weekly')).toBe(true)
                expect(isValidPeriodType('WeeklyWednesday')).toBe(true)
                expect(isValidPeriodType('WeeklyThursday')).toBe(true)
                expect(isValidPeriodType('WeeklySaturday')).toBe(true)
                expect(isValidPeriodType('WeeklySunday')).toBe(true)
                expect(isValidPeriodType('BiWeekly')).toBe(true)
                expect(isValidPeriodType('Monthly')).toBe(true)
                expect(isValidPeriodType('BiMonthly')).toBe(true)
                expect(isValidPeriodType('Quarterly')).toBe(true)
                expect(isValidPeriodType('SixMonthly')).toBe(true)
                expect(isValidPeriodType('SixMonthlyApril')).toBe(true)
                expect(isValidPeriodType('Yearly')).toBe(true)
                expect(isValidPeriodType('FinancialApril')).toBe(true)
                expect(isValidPeriodType('FinancialJuly')).toBe(true)
                expect(isValidPeriodType('FinancialOct')).toBe(true)
                expect(isValidPeriodType('FinancialNov')).toBe(true)
            })
            it('returns false for an invalid period type', () => {
                expect(isValidPeriodType('INVALID')).toBe(false)
            })
        })

        describe('getYearWithOffset', () => {
            it('should return the current year if offset is zero', () => {
                expect(getYearWithOffset(0)).toEqual(2019)
                expect(getYearWithOffset('0')).toEqual(2019)
            })
            it('should return the current year if the offset cannot be parsed as an int', () => {
                expect(getYearWithOffset('WHOOT')).toEqual(2019)
                expect(getYearWithOffset({})).toEqual(2019)
            })
            it('should return the correct year if a valid offset is passed', () => {
                expect(getYearWithOffset(-10)).toEqual(2009)
                expect(getYearWithOffset('-10')).toEqual(2009)
            })
            it('negative offsets return years in the past and positive in the future', () => {
                expect(getYearWithOffset(-10)).toEqual(2009)
                expect(getYearWithOffset(10)).toEqual(2029)
            })
        })

        describe('getFixedPeriodTypes', () => {
            it('should return a list of available period ranges', () => {
                const periodIds = getFixedPeriodTypes().map(
                    (option) => option.type
                )

                expect(periodIds).toEqual([
                    'Daily',
                    'Weekly',
                    'WeeklyWednesday',
                    'WeeklyThursday',
                    'WeeklySaturday',
                    'WeeklySunday',
                    'BiWeekly',
                    'Monthly',
                    'BiMonthly',
                    'Quarterly',
                    'SixMonthly',
                    'SixMonthlyApril',
                    'Yearly',
                    'FinancialNov',
                    'FinancialOct',
                    'FinancialJuly',
                    'FinancialApril',
                ])
            })
        })

        describe('getFixedPeriodsForTypeAndDateRange', () => {
            it('should return an empty array if the period exceeds the date range', () => {
                expect(
                    getFixedPeriodsForTypeAndDateRange(
                        'Yearly',
                        '2021-04-08',
                        '2021-06-06'
                    )
                ).toEqual([])
            })
            it('should return the expected result even when the date range spans multiple years', () => {
                expect(
                    getFixedPeriodsForTypeAndDateRange(
                        'Weekly',
                        '2021-04-01',
                        '2021-04-30'
                    )
                ).toEqual([
                    {
                        displayName: 'Week 13 - 2021-03-29 - 2021-04-04',
                        endDate: '2021-04-04',
                        id: '2021W13',
                        iso: '2021W13',
                        startDate: '2021-03-29',
                    },
                    {
                        displayName: 'Week 14 - 2021-04-05 - 2021-04-11',
                        endDate: '2021-04-11',
                        id: '2021W14',
                        iso: '2021W14',
                        startDate: '2021-04-05',
                    },
                    {
                        displayName: 'Week 15 - 2021-04-12 - 2021-04-18',
                        endDate: '2021-04-18',
                        id: '2021W15',
                        iso: '2021W15',
                        startDate: '2021-04-12',
                    },
                    {
                        displayName: 'Week 16 - 2021-04-19 - 2021-04-25',
                        endDate: '2021-04-25',
                        id: '2021W16',
                        iso: '2021W16',
                        startDate: '2021-04-19',
                    },
                ])
            })
            it('should return the expected result even when the date range spans multiple years', () => {
                expect(
                    getFixedPeriodsForTypeAndDateRange(
                        'Monthly',
                        '2020-08-08',
                        '2021-06-06'
                    )
                ).toEqual([
                    {
                        displayName: 'August 2020',
                        endDate: '2020-08-31',
                        id: '202008',
                        iso: '202008',
                        startDate: '2020-08-01',
                    },
                    {
                        displayName: 'September 2020',
                        endDate: '2020-09-30',
                        id: '202009',
                        iso: '202009',
                        startDate: '2020-09-01',
                    },
                    {
                        displayName: 'October 2020',
                        endDate: '2020-10-31',
                        id: '202010',
                        iso: '202010',
                        startDate: '2020-10-01',
                    },
                    {
                        displayName: 'November 2020',
                        endDate: '2020-11-30',
                        id: '202011',
                        iso: '202011',
                        startDate: '2020-11-01',
                    },
                    {
                        displayName: 'December 2020',
                        endDate: '2020-12-31',
                        id: '202012',
                        iso: '202012',
                        startDate: '2020-12-01',
                    },
                    {
                        displayName: 'January 2021',
                        endDate: '2021-01-31',
                        id: '202101',
                        iso: '202101',
                        startDate: '2021-01-01',
                    },
                    {
                        displayName: 'February 2021',
                        endDate: '2021-02-28',
                        id: '202102',
                        iso: '202102',
                        startDate: '2021-02-01',
                    },
                    {
                        displayName: 'March 2021',
                        endDate: '2021-03-31',
                        id: '202103',
                        iso: '202103',
                        startDate: '2021-03-01',
                    },
                    {
                        displayName: 'April 2021',
                        endDate: '2021-04-30',
                        id: '202104',
                        iso: '202104',
                        startDate: '2021-04-01',
                    },
                    {
                        displayName: 'May 2021',
                        endDate: '2021-05-31',
                        id: '202105',
                        iso: '202105',
                        startDate: '2021-05-01',
                    },
                ])
            })
        })

        describe('getMostRecentCompletedYear', () => {
            it('throws an error if no periodType is specified', () => {
                expect(() =>
                    getMostRecentCompletedYear('INVALID')
                ).toThrowError(
                    'Invalid periodType "INVALID" supplied to "getMostRecentCompletedYear"'
                )
            })
            it('returns the current year (2019) for a Monthly periodType', () => {
                // Given the fact that today is 2019-06-17,
                // there are completed Monthly periods in this year
                expect(getMostRecentCompletedYear('Monthly')).toEqual(2019)
            })
            it('returns the previous year (2018) for a Yearly periodType', () => {
                // Given the fact that today is 2019-06-17,
                // there are no completed Yearly periods in this year
                expect(getMostRecentCompletedYear('Yearly')).toEqual(2018)
            })
            it('returns the previous year (2018) for a Monthly periodType if January has not completed', () => {
                // 2019-01-10
                jest.spyOn(Date, 'now').mockImplementationOnce(
                    () => 1547078400000
                )
                expect(getMostRecentCompletedYear('Monthly')).toEqual(2018)
            })
            it('returns the previous year (2018) for a FinancialOct periodType', () => {
                expect(getMostRecentCompletedYear('FinancialOct')).toEqual(2018)
            })
        })
    })
})
