"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwOnErrorStatus = throwOnErrorStatus;
exports.zohoCalendarApiRequest = zohoCalendarApiRequest;
exports.getPicklistCalendarOptions = getPicklistCalendarOptions;
exports.getPicklistEventOptions = getPicklistEventOptions;
exports.getDateAndTime = getDateAndTime;
exports.datesplit = datesplit;
exports.getAttendeesList = getAttendeesList;
exports.getEventDetails = getEventDetails;
exports.getDomain = getDomain;
const n8n_workflow_1 = require("n8n-workflow");
function throwOnErrorStatus(responseData) {
    if (responseData.error?.[0].description) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), responseData);
    }
}
async function zohoCalendarApiRequest(method, endpoint, body = {}, qs = {}, uri) {
    const { oauthTokenData } = await this.getCredentials('zohoCalendarOAuth2Api');
    const options = {
        body: {
            data: [body],
        },
        method,
        qs,
        uri: `https://calendar.${getDomain(oauthTokenData.api_domain)}/${endpoint}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    try {
        const responseData = await this.helpers.requestOAuth2?.call(this, 'zohoCalendarOAuth2Api', options);
        if (responseData === undefined)
            return [];
        throwOnErrorStatus.call(this, responseData);
        return responseData;
    }
    catch (error) {
        error = error;
        const args = error ? {
            message: error.error.error[0].message || 'The Zoho Calendar API returned an error.',
            description: JSON.stringify(error.error.error[0].description),
        }
            : undefined;
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, args);
    }
}
async function getPicklistCalendarOptions() {
    const responseData = (await zohoCalendarApiRequest.call(this, 'GET', 'api/v1/calendars', {}));
    const pickListOptions = responseData.calendars;
    if (!pickListOptions)
        return [];
    return pickListOptions.map((option) => ({
        name: option.name,
        value: option.uid,
    }));
}
async function getPicklistEventOptions(targetField) {
    const responseData = (await zohoCalendarApiRequest.call(this, 'GET', `api/v1/calendars/${targetField}/events`, {}));
    const pickListOptions = responseData.events;
    if (!pickListOptions)
        return [];
    return pickListOptions.map((option) => ({
        name: option.title,
        value: option.uid,
    }));
}
function getDateAndTime(date) {
    return date.split('T')[0];
}
function datesplit(date) {
    let dateTimeParts = date.split('T');
    let datePart = dateTimeParts[0].replace(/-/g, '');
    let timePart = dateTimeParts[1].replace(/:/g, '');
    return datePart + 'T' + timePart + 'Z';
}
function getAttendeesList(attendees) {
    attendees = attendees.toString().trim();
    const emailList = attendees.split(',').map((email) => {
        return { email: email.trim() };
    });
    return JSON.stringify(emailList);
}
async function getEventDetails(calendar, event) {
    const responseData = (await zohoCalendarApiRequest.call(this, 'GET', `api/v1/calendars/${calendar}/events/${event}`, {}));
    const etag = responseData.events[0]?.etag;
    if (etag) {
        return etag.toString();
    }
    else {
        throw new Error('Etag not found in events data.');
    }
}
function getDomain(domain) {
    const value = {
        ".com": "zoho.com",
        ".eu": "zoho.eu",
        ".com.cn": "zoho.com.cn",
        ".com.au": "zoho.com.au",
        ".in": "zoho.in",
        ".ca": "zohocloud.ca",
        ".sa": "zoho.sa",
        ".jp": "zoho.jp"
    };
    const suffixes = new Set(Object.keys(value));
    for (const key of suffixes) {
        if (domain.endsWith(key)) {
            return value[key];
        }
    }
    return undefined;
}
//# sourceMappingURL=GenericFunctions.js.map