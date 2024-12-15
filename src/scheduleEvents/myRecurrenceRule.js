import schedule from "node-schedule";

export default class MyRecurrenceRule {

    /**
     * Create a new MyRecurrenceRule
     *  - second (0-59) or * for every second
     *  - minute (0-59) or * for every minute
     *  - hour (0-23) or * for every hour
     *  - date (1-31) or * for everyday
     *  - month (0-11) or * for every month
     *  - year or * for every year
     *  - dayOfWeek (0-6) Starting with Sunday or * for every day of the week
     *  - tz (Timezone) or * for every timezone
     */
    constructor(second, minute, hour, date, month, year, dayOfWeek, tz) {
        this.rule = new schedule.RecurrenceRule();
        if(second && second !== "*") this.rule.second = second;
        if(minute && minute !== "*") this.rule.minute = minute;
        if(hour && hour !== "*") this.rule.hour = hour;
        if(date && date !== "*") this.rule.date = date;
        if(month && month !== "*") this.rule.month = month;
        if(year && year !== "*") this.rule.year = year;
        if(dayOfWeek && dayOfWeek !== "*") this.rule.dayOfWeek = dayOfWeek;
        if(tz && tz !== "*") this.rule.tz = tz;
    }

    getRule() {
        return this.rule;
    }

    toString() {
        return `second: ${this.rule.second || '*'}, minute: ${this.rule.minute || '*'}, hour: ${this.rule.hour || '*'}, date: ${this.rule.date || '*'}, month: ${this.rule.month || '*'}, dayOfWeek: ${this.rule.dayOfWeek || '*'}, year: ${this.rule.year || '*'}`;
    }



}