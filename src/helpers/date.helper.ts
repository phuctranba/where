/**
 * Get first day of week
 * @param currentDate
 */

import dayjs from "dayjs";

enum SERVICE_UNIT {
    second = "second",
    minute = "minute",
    hour = "hour",
    day = "day",
}

export function getFirstDayOfWeek(currentDate: Date): Date {
    let first = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
    return new Date(new Date().setMonth(currentDate.getMonth(), first));
}

/**
 * Get last day of week
 * @param currentDate
 */
export function getLastDayOfWeek(currentDate: Date): Date {
    let first = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    return new Date(new Date().setDate(last));
}

/**
 * Calculate age from date
 * @param birthday
 */
export function calculateAge(birthday: Date) { // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Convert second to mm:ss
 * @param second
 */
export function secondToMMSS(second: number): string {
    let minutes = Math.floor((second) / 60);
    let seconds = second % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds));
}

/**
 * Jamviet.comm added: Check if date is valid or not and get valid date
 * @param date Anything
 * @returns boolean
 */
export function dateIsValid(date) {
    return date instanceof Date;
}

export function getValidDate(_date) {
    let date = new Date(_date);
    if (!dateIsValid(date) || _date === "") {
        date = new Date();
    }
    return date;
}

/**
 *  Find user's sign by birthday
 * Jamviet.com fixed: if date is null or undefined
 * @param date
 */
export function findSignByDate(_date: string): string {
    let date = getValidDate(_date);
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Virgo", "Leo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];
    let month = date.getMonth();
    let day = date.getDate();
    if (month == 0 && day <= 20) {
        month = 11;
    } else if (day < days[month]) {
        month--;
    }
    return signs[month];
}


/**
 * Convert value time to other time by unit time
 * Jamviet.com Fixed: add return string because of toFixed() function
 * @param preUnit
 * @param afterUnit
 * @param valueTime
 */
export function convertUnitTime(preUnit: SERVICE_UNIT, afterUnit: SERVICE_UNIT, valueTime: number): number | string {

    if (preUnit === afterUnit)
        return valueTime;

    //default unit is second
    let result: number = valueTime;

    switch (preUnit) {
        case SERVICE_UNIT.minute:
            result = valueTime * 60;
            break;
        case SERVICE_UNIT.hour:
            result = valueTime * 60 * 60;
            break;
        case SERVICE_UNIT.day:
            result = valueTime * 60 * 60 * 24;
            break;
    }

    switch (afterUnit) {
        case SERVICE_UNIT.minute:
            result = valueTime / 60;
            break;
        case SERVICE_UNIT.hour:
            result = valueTime / 60 / 60;
            break;
        case SERVICE_UNIT.day:
            result = valueTime / 60 / 60 / 24;
            break;
    }

    if (result % 1 === 0) {
        return result;
    } else {
        return result.toFixed(2);
    }
}

export function convertUnitTimeString(preUnit: SERVICE_UNIT, afterUnit: SERVICE_UNIT, valueTime: number): string {
    let result = convertUnitTime(preUnit, afterUnit, valueTime);
    return `${result} ${afterUnit}${result === 1 ? "" : "s"}`;
}

export function getFormatDayMessage(time: Date | string, sameDay = "HH:mm", sameYear = "HH:mm DD/MM", diffYear = "DD/MM/YYYY") {
    if (!time) {
        return "";
    }
    const IsSameDay = dayjs(new Date()).isSame(time, "day");
    const IsSameYear = dayjs(new Date()).isSame(time, "year");
    return IsSameDay
        ? dayjs(time).format(sameDay)
        : IsSameYear
            ? dayjs(time).format(sameYear)
            : dayjs(time).format(diffYear);
}

export function checkAvailableTime(time: Date | string, currentHour = 24) {
    if (!time) {
        return 0;
    }
    const duration = dayjs().diff(dayjs(time), "minutes");
    // check by day
    if (duration > currentHour * 60) {
        return 0;
    }
    return (currentHour * 60 - duration) / (currentHour * 60);
}

export const convertTimeToNow = (time = "") => {
    if (!time) {
        return "";
    }

    let timeMinuteCount = dayjs(new Date()).diff(dayjs(time), "minute");

    if (timeMinuteCount < 60) {
        return Math.round(timeMinuteCount) + " m";
    }

    if (timeMinuteCount < 1440) {
        return Math.round(timeMinuteCount / 60) + " h";
    }

    if (timeMinuteCount < 10080) {
        return Math.round(timeMinuteCount / 1440) + " d";
    }

    if (timeMinuteCount < 43200) {
        return Math.round(timeMinuteCount / 10080) + " w";
    }

    if (timeMinuteCount < 518400) {
        return Math.round(timeMinuteCount / 43200) + " M";
    }

    return Math.round(timeMinuteCount / 518400) + " Y";
};

export const convertTimeDisplay = (time = "") => {
    if (!time) {
        return "";
    }

    const sameYear = dayjs().isSame(dayjs(time), "year");

    if (!sameYear) {
        return dayjs(time).format("MMM DD, YYYY");
    }

    const sameMonth = dayjs().isSame(dayjs(time), "month");

    if (!sameMonth) {
        return dayjs(time).format("MMM DD");
    }

    const sameDay = dayjs().isSame(dayjs(time), "day");

    if (!sameDay) {
        return `${dayjs().diff(dayjs(time), "day") + 1} d`;
    }

    const sameHour = dayjs().isSame(dayjs(time), "hour");

    if (!sameHour) {
        return `${dayjs().diff(dayjs(time), "hour") + 1} h`;
    }

    return `${dayjs().diff(dayjs(time), "minute") + 1} m`;
};

export const convertNumberView = (number) => {
    if (!number) {
        return 0;
    }

    if (number < 1000) {
        return number;
    }

    if (number < 1000000) {
        return `${Math.round(number / 100) / 10} K`;
    }

    return `${Math.round(number / 100000) / 10} M`;
};
