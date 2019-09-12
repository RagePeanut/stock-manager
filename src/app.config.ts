export default {
    date: {
        locale: {
            // tslint:disable-next-line: max-line-length
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // List of full day names (DDDD), starting with Sunday
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // List of short day names (DDD), starting with Sunday
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // List of full month names (MMMM), starting with January
            // tslint:disable-next-line: max-line-length
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']  // List of short month names (MMM), starting with January
        },
        mask: 'DD/MM/YYYY', // Available format tokens: https://quasar.dev/quasar-utils/date-utils#Format-for-display
    }
};

