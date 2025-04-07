"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoCalendarTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const serviceId = 10;
class ZohoCalendarTrigger {
    constructor() {
        this.description = {
            displayName: 'Zoho Calendar Trigger',
            name: 'zohoCalendarTrigger',
            icon: 'file:ZohoCalendar.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Zoho Calendar events occur',
            defaults: {
                name: 'Zoho Calendar Trigger',
            },
            inputs: [],
            outputs: ["main"],
            credentials: [
                {
                    name: 'zohoCalendarOAuth2Api',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Trigger On',
                    name: 'tiggerevents',
                    type: 'options',
                    default: '',
                    required: true,
                    options: [
                        {
                            name: 'Event created',
                            value: 'newEvent',
                            description: 'Triggers when an event is created.',
                        },
                        {
                            name: 'Event Updated',
                            value: 'editEvent',
                            description: 'Triggers when an event is updated.',
                        },
                        {
                            name: 'Event Deleted',
                            value: 'deleteEvent',
                            description: 'Triggers when an event is deleted.',
                        }
                    ]
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const webhookData = this.getWorkflowStaticData('node');
                    const events = this.getNodeParameter('tiggerevents');
                    const qs = {
                        serviceId: serviceId,
                        name: events
                    };
                    const endpoint = 'api/v1/webHooksPresence/external';
                    const collection = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'GET', endpoint, {}, qs);
                    for (const webhook of collection.notifyUrls) {
                        if (webhook.notifyUrl === webhookUrl) {
                            webhookData.webhookURI = webhook.notifyUrl;
                            return true;
                        }
                    }
                    return false;
                },
                async create() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const events = this.getNodeParameter('tiggerevents');
                    const qs = {
                        notifyUrl: webhookUrl,
                        serviceId: serviceId,
                        name: events
                    };
                    const endpoint = 'api/v1/webHooksPresence/external';
                    const responseData = await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'POST', endpoint, {}, qs);
                    if (responseData === undefined || responseData?.notifyId === undefined) {
                        return false;
                    }
                    webhookData.webhookURI = responseData.notifyId;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const events = this.getNodeParameter('tiggerevents');
                    const qs = {
                        notifyId: webhookData.webhookURI,
                        serviceId: serviceId,
                        name: events
                    };
                    if (webhookData.webhookURI !== undefined) {
                        try {
                            const endpoint = 'api/v1/webHooksPresence/external';
                            await GenericFunctions_1.zohoCalendarApiRequest.call(this, 'DELETE', endpoint, {}, qs);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookURI;
                    }
                    return true;
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.ZohoCalendarTrigger = ZohoCalendarTrigger;
//# sourceMappingURL=ZohoCalendarTrigger.node.js.map