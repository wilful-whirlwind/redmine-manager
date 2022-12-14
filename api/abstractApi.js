const axios = require('axios');
const Store = require('electron-store')
const store = new Store();

module.exports = class AbstractApi {

    /**
     * execute post api
     * @param uri
     * @param headers
     * @param request
     * @return {Promise<null>}
     */
    static async callPostApi(uri, headers, request) {
        let response = null;
        headers = this.setBasicAuth(headers);
        try {
            response = await axios.post(uri, request, {headers: headers});
        } catch (e) {
            console.error(e);
            throw new Error("APIの実行に失敗しました。")
        }
        return response;
    }

    /**
     * execute get api
     * @param uri
     * @param headers
     * @param query
     * @return {Promise<null>}
     */
    static async callGetApi(uri, headers, query) {
        let response = null;
        headers = this.setBasicAuth(headers);
        try {
            response = await axios.get(uri, {params: query, headers: headers});
            console.log(response);
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }

    static setBasicAuth(headers) {
        const basicAuthUserId = store.get("basicAuthUserId") ?? "";
        const basicAuthPassWord = store.get("basicAuthPassWord") ?? "";
        if (basicAuthUserId.length > 0 && basicAuthPassWord.length > 0) {
            if (typeof headers === "undefined" || headers === null) {
                headers = {}
            }
            headers.Authorization = 'Basic ' + new Buffer(basicAuthUserId + ':' + basicAuthPassWord).toString('base64');
        }
        return headers;
    }
}