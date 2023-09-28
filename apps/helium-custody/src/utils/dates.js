import moment from 'moment'

export const dateWithinRange = (date, startDate, endDate) => {
    const momentDate = moment(date);
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(endDate);
  
    return momentDate.isSameOrAfter(momentStartDate) && momentDate.isSameOrBefore(momentEndDate);
}