import {getUserAction} from "./action/GetUserAction";
import {getScheduleAction} from "./action/GetScheduleAction";
import {getTicketTemplateAction} from "./action/GetTicketTemplateAction";
import {postCalendarScheduleAction} from "./action/PostCalendarScheduleAction";
import {getScheduleFromCalendarAction} from "./action/GetScheduleFromCalendarAction";
import {deleteScheduleFromCalendarAction} from "./action/DeleteScheduleFromCalendarAction";
import {getCustomFieldsAction} from "./action/GetCustomFieldsAction";

export function frontController(params: any, httpMethod: string): any
{
    let target = params?.target;
    if (typeof target === "undefined") {
        target = "undefined";
    }

    let res = {};
    if (httpMethod === 'get') {
        switch (target) {
            case "user":
                res = getUserAction(params);
                break;
            case "schedule":
                res = getScheduleAction(params);
                break;
            case "template_ticket":
                res = getTicketTemplateAction(params);
                break;
            case "calendar":
                res = getScheduleFromCalendarAction(params);
                break;
            case "custom_field":
                res = getCustomFieldsAction(params);
                break;
            default:
        }
    } else if (httpMethod === 'post') {
        switch (target) {
            case "calendar":
                res = postCalendarScheduleAction(params);
                break;
            case "delete_event":
                res = deleteScheduleFromCalendarAction(params);
                break;
            default:
        }
    }

    return res;
}