momentHelper = {
    DATE_FORMAT_NO_MS: "YYYY-MM-DD HH:mm:ss",
    DATE_FORMAT: "YYYY-MM-DD HH:mm:ss.SSS",
    DATE_FORMAT_TZ_NO_MS: "YYYY-MM-DD HH:mm:ss Z",
    DATE_FORMAT_TZ: "YYYY-MM-DD HH:mm:ss.SSS Z",

    /*
     * Returns a new moment object in the users' timezone. If the argument is not a moment object, it will
     * return a moment object with the current time in user's timezone.
     */
    toUserTimeZone: function(momentDate) {
        var date;

        if ((momentDate == null) || !moment.isMoment(momentDate)) {
            date = moment();
        } else {
            date = moment(momentDate);
        }

        if (gl2UserTimeZoneOffset != null) {
            date.zone(gl2UserTimeZoneOffset);
        }

        return date;
    },

    _getAcceptedFormats: function() {
        return [
            momentHelper.DATE_FORMAT_TZ,
            momentHelper.DATE_FORMAT_TZ_NO_MS,
            moment.ISO_8601,
            momentHelper.DATE_FORMAT,
            momentHelper.DATE_FORMAT_NO_MS
        ];
    },

    /*
     * Parse the given string against the list of accepted formats and return a moment in the timezone
     * included in the date or the browser's local timezone.
     */
    parseFromString: function(dateString) {
        return moment(dateString, this._getAcceptedFormats(), true);
    },

    /* Parse the given string against the list of accepted formats and return a UTC moment. */
    parseUTCFromString: function(dateString) {
        return moment.utc(dateString, this._getAcceptedFormats(), true);
    },

    /* Parse the given string against the list of accepted formats and return a moment in the users' local timezone. */
    parseUserLocalFromString: function(dateString) {
        var parsedDate = this.parseUTCFromString(dateString);
        var userDate = this.toUserTimeZone(null);

        // I really don't want to use moment-timezone.js just for this
        userDate.year(parsedDate.year());
        userDate.month(parsedDate.month());
        userDate.date(parsedDate.date());
        userDate.hour(parsedDate.hour());
        userDate.minute(parsedDate.minute());
        userDate.second(parsedDate.second());
        userDate.millisecond(parsedDate.millisecond());

        return userDate;
    }
};