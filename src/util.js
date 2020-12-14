import moment from 'moment';

export const getFormattedLocalDateTime = (gmtEpoc, timezone) => {
    let localTime = moment.unix(gmtEpoc).utcOffset(timezone / 60);
    return localTime.format("DD MMM YYYY H:mm a");
};

export const getFormattedLocalDate = (gmtEpoc, timezone) => {
    let localTime = moment.unix(gmtEpoc).utcOffset(timezone / 60);
    return localTime.format("DD MMM YYYY");
};

export const getDayOfWeek = (gmtEpoc, timezone) => {
    let localTime = moment.unix(gmtEpoc).utcOffset(timezone / 60);
    return localTime.format("dddd");
};

/**
* Convert Kelvin to Celsius. Celsius = Kelvin - 273.15 
* @param ktemp Kevin temparature  
* @return Celsius
*/
export const Kelvin2Celsius = (ktemp) => {
    return Math.floor(ktemp - 273.15);
}
