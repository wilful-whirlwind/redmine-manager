const VersionInfo = require("../entity/versionInfo");
const GasApi = require("../api/gasApi");
const User = require("../entity/user");


module.exports = class GasLogic {
    /**
     * User情報を取得
     * @return {Promise<User[]>}
     */
    async getUserList() {
        try {
            const responseUserList = await GasApi.getUserList();
            let userList = [];
            for (let i = 0; i < responseUserList.length; i++) {
                userList.push(new User(
                    responseUserList[i].id,
                    responseUserList[i].name,
                    responseUserList[i].redmine_user_id,
                    responseUserList[i].timecard_user_id,
                    responseUserList[i].mail_address,
                ));
            }
            return userList;
        } catch (e) {
            console.log(e)
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
    }

    async getTemplateTicketList() {
        try {
            return await GasApi.getTemplateTicketList();
        } catch (e) {
            console.log(e)
            throw new Error("テンプレートチケット情報の取得に失敗しました。");
        }
    }

    async getCustomFieldList() {
        try {
            return await GasApi.getCustomFieldList();
        } catch (e) {
            console.log(e)
            throw new Error("カスタムフィールド情報の取得に失敗しました。");
        }
    }


    async getScheduleListFromEventMaster() {
        try {
            return await GasApi.getScheduleList();
        } catch (e) {
            console.log(e)
            throw new Error("スケジュール情報の取得に失敗しました。");
        }
    }

    async getScheduleListFromGoogleCalendar(versionName) {
        try {
            return await GasApi.getScheduleListFromGoogleCalendar("2022-10-01", "2025-12-31", versionName);
        } catch (e) {
            console.log(e)
            throw new Error("スケジュール情報の取得に失敗しました。");
        }
    }

    /**
     * versionをタイトルから除去（テンプレートとのマッチングのため）
     * @param scheduleList
     * @param versionName
     * @return {*[]|*}
     */
    convertScheduleList(scheduleList, versionName) {
        if (!Array.isArray(scheduleList)) {
            return [];
        }
        for (let i = 0; i < scheduleList.length; i++) {
            scheduleList[i].title = scheduleList[i].title.replace(versionName, "");
        }
        return scheduleList;
    }

    async postScheduleList(eventDateTimeList, major, minor, maintenance) {
        let versionInfo = new VersionInfo(major, minor, maintenance, null);
        const versionName = versionInfo.getVersionName("ver.", ".", "_");
        try {
            let currentEvent = null;
            for (let i = 0; i < eventDateTimeList.length; i++) {
                currentEvent = eventDateTimeList[i];
                if (typeof currentEvent?.name === "undefined") {
                    continue;
                }
                if (typeof currentEvent?.ymd === "undefined") {
                    continue;
                }
                await GasApi.deleteGoogleCalendarSchedule("2022-10-01", "2025-12-31", currentEvent.name, versionName);
                currentEvent.name = versionName + currentEvent.name;
                if (
                    typeof currentEvent?.from === "undefined" &&
                    typeof currentEvent?.to === "undefined"
                ) {
                    await GasApi.postGoogleCalendarScheduleForAllDays(currentEvent.ymd, currentEvent.name);
                }
                if (
                    typeof currentEvent?.from === "string" &&
                    typeof currentEvent?.to === "string"
                ) {
                    await GasApi.postGoogleCalendarScheduleForMeeting(currentEvent.ymd, currentEvent.name, currentEvent.from, currentEvent.to);
                }
            }
        } catch (e) {
            console.log(e)
            throw new Error("スケジュール情報の登録に失敗しました。");
        }
    }

    async createTestDocument(data, folderId) {
        if (!data.phase_test) {
            return;
        }
        return await GasApi.postTemplateTestSheet(folderId);
    }

    async createGoogleDrive(data) {
        if (!data.phase_plan && !data.phase_test) {
            return;
        }
        return await GasApi.postGoogleDrive(data.task_name);
    }
}