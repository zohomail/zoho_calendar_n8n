"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoCalendar = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class ZohoCalendar {
    constructor() {
        this.description = {
            displayName: 'Zoho Calendar',
            name: 'zohoCalendar',
            icon: 'file:ZohoCalendar.png',
            group: ['transform'],
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            version: 1,
            description: 'Consume Zoho Calendar API',
            defaults: {
                name: 'Zoho Calendar',
            },
            usableAsTool: true,
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'zohoCalendarOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'Event',
                            value: 'event',
                        },
                    ],
                    default: 'event',
                },
                ...descriptions_1.eventOperations,
                ...descriptions_1.eventFields
            ],
        };
        this.methods = {
            loadOptions: {
                async getListCalendar() {
                    return await GenericFunctions_1.getPicklistCalendarOptions.call(this);
                },
                async getListEvent() {
                    const calendarId = this.getCurrentNodeParameter('calendar_id', { extractValue: true });
                    ;
                    return await GenericFunctions_1.getPicklistEventOptions.call(this, calendarId.toString());
                }
            }
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'event') {
                    if (operation === 'create') {
                        var start = (0, GenericFunctions_1.datesplit)(this.getNodeParameter('start', i));
                        var end = (0, GenericFunctions_1.datesplit)(this.getNodeParameter('end', i));
                        if (this.getNodeParameter('isallday', i) !== undefined && this.getNodeParameter('isallday', i) !== null && this.getNodeParameter('isallday', i) === true) {
                            start = (0, GenericFunctions_1.getDateAndTime)(start);
                            end = (0, GenericFunctions_1.getDateAndTime)(end);
                        }
                        var title = this.getNodeParameter('title', i);
                        var eventdata = `{"dateandtime": {"start": "${start}","end": "${end}"},"title": "${title}"`;
                        if (this.getNodeParameter('isallday', i) !== undefined && this.getNodeParameter('isallday', i) !== null) {
                            eventdata += `, "isallday": "${this.getNodeParameter('isallday', i)}"`;
                        }
                        if (this.getNodeParameter('color', i) !== '' && this.getNodeParameter('color', i) !== undefined && this.getNodeParameter('color', i) !== null) {
                            eventdata += `, "color": "${this.getNodeParameter('color', i)}"`;
                        }
                        if (this.getNodeParameter('description', i) !== '' && this.getNodeParameter('description', i) !== undefined && this.getNodeParameter('description', i) !== null) {
                            eventdata += `, "description": "${this.getNodeParameter('description', i)}"`;
                        }
                        if (this.getNodeParameter('location', i) !== '' && this.getNodeParameter('location', i) !== undefined && this.getNodeParameter('location', i) !== null) {
                            eventdata += `, "location": "${this.getNodeParameter('location', i)}"`;
                        }
                        if (this.getNodeParameter('isprivate', i) !== undefined && this.getNodeParameter('isprivate', i) !== null) {
                            eventdata += `, "isprivate": "${this.getNodeParameter('isprivate', i)}"`;
                        }
                        if (this.getNodeParameter('transparency', i) !== undefined && this.getNodeParameter('transparency', i) !== null) {
                            eventdata += `, "transparency": "${this.getNodeParameter('transparency', i)}"`;
                        }
                        if (this.getNodeParameter('attendees', i) !== '' && this.getNodeParameter('attendees', i) !== undefined && this.getNodeParameter('attendees', i) != null) {
                            eventdata += `, "attendees": ${(0, GenericFunctions_1.getAttendeesList)(this.getNodeParameter('attendees', i))}`;
                        }
                        if (this.getNodeParameter('allowForwarding', i) !== undefined && this.getNodeParameter('allowForwarding', i) !== null) {
                            eventdata += `, "allowForwarding": "${this.getNodeParameter('allowForwarding', i)}"`;
                        }
                        eventdata += '}';
                        const qs = { eventdata };
                        responseData = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'POST', `api/v1/calendars/${this.getNodeParameter('calendar_id', i)}/events`, {}, qs);
                        responseData = responseData.events;
                    }
                    else if (operation === 'delete') {
                        var eventdata = `{"etag": "${await GenericFunctions_1.getEventDetails.call(this, this.getNodeParameter('calendar_id', i), this.getNodeParameter('event', i))}"}`;
                        const qs = { eventdata };
                        responseData = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'DELETE', `api/v1/calendars/${this.getNodeParameter('calendar_id', i)}/events/${this.getNodeParameter('event', i)}`, {}, qs);
                        responseData = responseData.events;
                    }
                    else if (operation === 'update') {
                        var start = (0, GenericFunctions_1.datesplit)(this.getNodeParameter('start', i));
                        var end = (0, GenericFunctions_1.datesplit)(this.getNodeParameter('end', i));
                        if (this.getNodeParameter('isallday', i) !== undefined && this.getNodeParameter('isallday', i) !== null && this.getNodeParameter('isallday', i) === true) {
                            start = (0, GenericFunctions_1.getDateAndTime)(start);
                            end = (0, GenericFunctions_1.getDateAndTime)(end);
                        }
                        var title = this.getNodeParameter('title', i);
                        var eventdata = `{"dateandtime": {"start": "${start}","end": "${end}"},"title": "${title}","etag": "${await GenericFunctions_1.getEventDetails.call(this, this.getNodeParameter('calendar_id', i), this.getNodeParameter('event', i))}"`;
                        if (this.getNodeParameter('isallday', i) !== undefined && this.getNodeParameter('isallday', i) !== null) {
                            eventdata += `, "isallday": "${this.getNodeParameter('isallday', i)}"`;
                        }
                        if (this.getNodeParameter('color', i) !== '' && this.getNodeParameter('color', i) !== undefined && this.getNodeParameter('color', i) !== null) {
                            eventdata += `, "color": "${this.getNodeParameter('color', i)}"`;
                        }
                        if (this.getNodeParameter('description', i) !== '' && this.getNodeParameter('description', i) !== undefined && this.getNodeParameter('description', i) !== null) {
                            eventdata += `, "description": "${this.getNodeParameter('description', i)}"`;
                        }
                        if (this.getNodeParameter('location', i) !== '' && this.getNodeParameter('location', i) !== undefined && this.getNodeParameter('location', i) !== null) {
                            eventdata += `, "location": "${this.getNodeParameter('location', i)}"`;
                        }
                        if (this.getNodeParameter('isprivate', i) !== undefined && this.getNodeParameter('isprivate', i) !== null) {
                            eventdata += `, "isprivate": "${this.getNodeParameter('isprivate', i)}"`;
                        }
                        if (this.getNodeParameter('transparency', i) !== undefined && this.getNodeParameter('transparency', i) !== null) {
                            eventdata += `, "transparency": "${this.getNodeParameter('transparency', i)}"`;
                        }
                        if (this.getNodeParameter('attendees', i) !== '' && this.getNodeParameter('attendees', i) !== undefined && this.getNodeParameter('attendees', i) != null) {
                            eventdata += `, "attendees": ${(0, GenericFunctions_1.getAttendeesList)(this.getNodeParameter('attendees', i))}`;
                        }
                        if (this.getNodeParameter('allowForwarding', i) !== undefined && this.getNodeParameter('allowForwarding', i) !== null) {
                            eventdata += `, "allowForwarding": "${this.getNodeParameter('allowForwarding', i)}"`;
                        }
                        eventdata += '}';
                        const qs = { eventdata };
                        responseData = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'PUT', `api/v1/calendars/${this.getNodeParameter('calendar_id', i)}/events/${this.getNodeParameter('event', i)}`, {}, qs);
                        responseData = responseData.events;
                    }
                    else if (operation === 'quick_event') {
                        const saddtext = this.getNodeParameter('saddtext', i);
                        const qs = { "saddtext": saddtext };
                        responseData = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'POST', 'api/v1/smartadd', {}, qs);
                        responseData = responseData.events;
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message, json: {} });
                    continue;
                }
                throw error;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.ZohoCalendar = ZohoCalendar;
//# sourceMappingURL=ZohoCalendar.node.js.map