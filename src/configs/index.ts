import {POLICIES_URL, TERM_URL} from "constants/system.constant";

export enum ENV {
    PRODUCTION = "production",
    DEVELOPMENT = "development"
}

/**
 *
 *
 * Thay đổi khi build or dev
 *
 *
 */


export const ENVIRONMENT: ENV = __DEV__ ? ENV.DEVELOPMENT : ENV.PRODUCTION

/**
 <<<<<<< src/configs/index.ts
 * Domain cho dev
 */
const DEVELOPER_DOMAIN = "https://backend.crm.appuni.io";
const DEVELOPER_DOMAIN_MEDIA = "https://backend.crm.appuni.io/api//media/download";
const DEVELOPER_DOMAIN_API = DEVELOPER_DOMAIN + "/api";
const DEVELOPER_DOMAIN_CHAT = "https://backend.crm.appuni.io";
const DEVELOPER_DOMAIN_CHAT_API = DEVELOPER_DOMAIN_CHAT + "/api";
const DEVELOPER_DOMAIN_SOCKET = "https://backend.crm.appuni.io";

/**
 * Domain cho production
 */
const PRODUCTION_DOMAIN = "https://backend.crm.appuni.io";
const PRODUCTION_DOMAIN_MEDIA = "https://backend.crm.appuni.io/api//media/download";
const PRODUCTION_DOMAIN_API = PRODUCTION_DOMAIN + "/api";
const PRODUCTION_DOMAIN_CHAT = "https://backend.crm.appuni.io";
const PRODUCTION_DOMAIN_CHAT_API = PRODUCTION_DOMAIN_CHAT + "/api";
const PRODUCTION_DOMAIN_SOCKET = "https://backend.crm.appuni.io";

const INIT_RUNTIME_DOMAIN_MEDIA = ENVIRONMENT === ENV.PRODUCTION ? PRODUCTION_DOMAIN_MEDIA : DEVELOPER_DOMAIN_MEDIA;
const INIT_RUNTIME_DOMAIN_API = ENVIRONMENT === ENV.PRODUCTION ? PRODUCTION_DOMAIN_API : DEVELOPER_DOMAIN_API;
const INIT_RUNTIME_DOMAIN_CHAT = ENVIRONMENT === ENV.PRODUCTION ? PRODUCTION_DOMAIN_CHAT : DEVELOPER_DOMAIN_CHAT;
const INIT_RUNTIME_DOMAIN_SOCKET = ENVIRONMENT === ENV.PRODUCTION ? PRODUCTION_DOMAIN_SOCKET : DEVELOPER_DOMAIN_SOCKET;
const INIT_RUNTIME_DOMAIN_CHAT_API = ENVIRONMENT === ENV.PRODUCTION ? PRODUCTION_DOMAIN_CHAT_API : DEVELOPER_DOMAIN_CHAT_API;

export let APP_URL = {
    env: ENVIRONMENT === ENV.PRODUCTION ? 'product' : 'develop', // or production
    APP_API_REQUEST_TIMEOUT: 15, // in second, NOT microseconds
    APP_AJAX_URL: INIT_RUNTIME_DOMAIN_API,
    LOGIN_APPLE:INIT_RUNTIME_DOMAIN_API+"/login/apple",
    LOGIN_GOOGLE:INIT_RUNTIME_DOMAIN_API+"/login/google",
    LOGIN_FACEBOOK:INIT_RUNTIME_DOMAIN_API+"/login/facebook",
    REGISTER:INIT_RUNTIME_DOMAIN_API+"/register",
    USER:INIT_RUNTIME_DOMAIN_API+"/user",
    MEDIA_UPLOAD:INIT_RUNTIME_DOMAIN_API+"/media/upload",
    CONTACT_FORM:INIT_RUNTIME_DOMAIN_API+"/contactform",
    MEDIA_DOWNLOAD:INIT_RUNTIME_DOMAIN_MEDIA,

    APP_CHAT_ROOT: INIT_RUNTIME_DOMAIN_CHAT,
    TERM: TERM_URL,
    POLICIES: POLICIES_URL
}

export function setUrlEnv(isProduction: boolean) {
    const RUNTIME_DOMAIN = isProduction ? PRODUCTION_DOMAIN : DEVELOPER_DOMAIN;
    const RUNTIME_DOMAIN_MEDIA = isProduction ? PRODUCTION_DOMAIN_MEDIA : DEVELOPER_DOMAIN_MEDIA;
    const RUNTIME_DOMAIN_API = isProduction ? PRODUCTION_DOMAIN_API : DEVELOPER_DOMAIN_API;
    const RUNTIME_DOMAIN_CHAT = isProduction ? PRODUCTION_DOMAIN_CHAT : DEVELOPER_DOMAIN_CHAT;
    const RUNTIME_DOMAIN_SOCKET = isProduction ? PRODUCTION_DOMAIN_SOCKET : DEVELOPER_DOMAIN_SOCKET;
    const RUNTIME_DOMAIN_CHAT_API = isProduction ? PRODUCTION_DOMAIN_CHAT_API : DEVELOPER_DOMAIN_CHAT_API;
    APP_URL = {
        env: isProduction ? 'product' : 'develop', // or production
        APP_API_REQUEST_TIMEOUT: 15, // in second, NOT microseconds
        APP_AJAX_URL: RUNTIME_DOMAIN_API,
        LOGIN_APPLE:RUNTIME_DOMAIN_API+"/login/apple",
        LOGIN_GOOGLE:RUNTIME_DOMAIN_API+"/login/google",
        LOGIN_FACEBOOK:RUNTIME_DOMAIN_API+"/login/facebook",
        REGISTER:RUNTIME_DOMAIN_API+"/register",
        USER:RUNTIME_DOMAIN_API+"/user",
        MEDIA_UPLOAD:RUNTIME_DOMAIN_API+"/media/upload",
        CONTACT_FORM:RUNTIME_DOMAIN_API+"/contactform",
        MEDIA_DOWNLOAD:RUNTIME_DOMAIN_MEDIA,

        APP_CHAT_ROOT: RUNTIME_DOMAIN_CHAT,
        TERM: TERM_URL,
        POLICIES: POLICIES_URL
    }
}
