import { createAsyncThunk, createSlice, isFulfilled, isRejected } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "configs";
import { serializeAxiosError } from "configs/reducer.config";
import { getFCMToken } from "helpers/firebase.helper";
import { cleanEntity } from "helpers/object.helper";
import {
  TypedLoginEmailPasswordParams,
  TypedLoginSSOParams,
  TypedPlan,
  TypedSignUpEmailPasswordParams,
  TypedTransaction,
  TypedUser
} from "models/user.model";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { clearAllStorage } from "helpers/storage.helper";
import { GlobalPopupHelper } from "helpers/index";

/**
 * Jamviet.com refactor. Add updating state...
 */
interface InitialState {
  isAuthenticated: boolean
  account: TypedUser
  errorMessage: string | null
  loading: boolean,
  submitting: boolean,
}

export const initialState: InitialState = {
  isAuthenticated: false,
  account: {},
  errorMessage: null,
  loading: false,
  submitting: false
};

/**
 * JamDev: getCurrentUser
 */
export const getCurrentUser = createAsyncThunk("user/getcurrentuser", async (id: string, thunkAPI) => {
  const requestUrl = `${APP_URL.APP_AJAX_URL}/user/detail/${id}`;
  const res = await axios.get<TypedUser>(requestUrl);
  // thunkAPI.dispatch(getListSubscribe({ id }))
  // thunkAPI.dispatch(getListTransactions(id));
  return res;
});

export const removeUser = createAsyncThunk(
  "user/removeUser",
  async ({ id }: { id: string }) => {
    const responseData = await axios.delete(`${APP_URL.APP_AJAX_URL}/user/delete/${id}`);
    return responseData;
  },
  { serializeError: serializeAxiosError }
);

export const getListPlan = createAsyncThunk("user/getlistplan", async (_, thunkAPI) => {
  const requestUrl = `${APP_URL.APP_AJAX_URL}/plan/list-plan?version=${Platform.OS == "android" ? "android-" : "ios-"}1.0.0`;
  return axios.get<TypedPlan[]>(requestUrl);
});

/**
 * JamDev: Logout
 */
export const logout = createAsyncThunk("user/logout", async ({ callApi = true }: { callApi?: boolean }, thunkAPI) => {
  try {
    if (callApi) {
      const requestUrl = `${APP_URL.APP_AJAX_URL}/user/logout`;
      // thunkAPI.dispatch(resetNotification());
      await axios.get(requestUrl);
    }

    clearAllStorage();
  } catch (e) {

  }

  return;
});

export const createUserPrompt = createAsyncThunk(
  "user/createUserPrompt",
  async (data: { user_id: string, prompt_id: string, question: string, answer: string }) => {
    return await axios.post<TypedUser>(`${APP_URL.APP_AJAX_URL}/post-user/create-user-prompt`, cleanEntity(data));
  },
  { serializeError: serializeAxiosError }
);

export const getListUserPrompt = createAsyncThunk(
  "user/getListUserPrompt",
  async (data: { user_id: string, prompt_id?: string, page: number, limit?: number, from?: string }) => {
    return await axios.get<any[]>(`${APP_URL.APP_AJAX_URL}/post-user/list-user-prompt?user_id=${data.user_id}${data.prompt_id ? `&prompt_id=${data.prompt_id}` : ""}${data.from ? `&from=${data.from}` : ""}&page=${data.page}&limit=${data?.limit || 20}&order_by=DESC`);
  },
  { serializeError: serializeAxiosError }
);

export const signUpWithEmailPassword = createAsyncThunk(
  "user/signUpWithEmailPassword",
  async (entity: TypedSignUpEmailPasswordParams, thunkAPI) => {
    GlobalPopupHelper.showLoading(true);
    let response = await axios.post<TypedUser>(APP_URL.REGISTER, cleanEntity(entity));
    GlobalPopupHelper.hideLoading();
    GlobalPopupHelper.alert({
      type: "success",
      title: "Sign Up Success"
    });
    return response;
  },
  { serializeError: serializeAxiosError }
);

export const loginWithEmailPassword = createAsyncThunk(
  "user/loginWithEmailPassword",
  async (entity: TypedLoginEmailPasswordParams, thunkAPI) => {
    entity.device_uuid = await DeviceInfo.getUniqueId();
    entity.device_signature = await getFCMToken();
    entity.device_type = Platform.OS;
    entity.remember = 1;
    return await axios.post<TypedUser>(APP_URL.LOGIN_GOOGLE, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError }
);

export const loginWithGoogleAccount = createAsyncThunk(
  "user/loginWithGoogleAccount",
  async (entity: TypedLoginSSOParams, thunkAPI) => {
    entity.device_uuid = await DeviceInfo.getUniqueId();
    entity.device_signature = await getFCMToken();
    entity.device_type = Platform.OS;
    return await axios.post<TypedUser>(APP_URL.LOGIN_GOOGLE, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError }
);

export const loginWithAppleAccount = createAsyncThunk(
  "user/loginWithAppleAccount",
  async (entity: TypedLoginSSOParams, thunkAPI) => {
    entity.device_uuid = await DeviceInfo.getUniqueId();
    entity.device_signature = await getFCMToken();
    entity.device_type = Platform.OS;
    return await axios.post<TypedUser>(APP_URL.LOGIN_APPLE, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError }
);

export const loginWithFacebookAccount = createAsyncThunk(
  "user/login/apple",
  async (entity: any, thunkAPI) => {
    entity.device_uuid = await DeviceInfo.getUniqueId();
    entity.device_signature = await getFCMToken();
    entity.device_type = Platform.OS;
    return await axios.post<TypedUser>(APP_URL.LOGIN_FACEBOOK, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError }
);

export const updateNotificationStatus = createAsyncThunk(
  "user/update_notification_status",
  async (entity: TypedUser) => {
    const data = {
      _id: entity._id,
      notification_status: entity.notification_status
    };
    return await axios.patch<TypedUser>(`${APP_URL.APP_AJAX_URL}/user/update/user`, data);
  },
  { serializeError: serializeAxiosError }
);

export const updateDisableAccount = createAsyncThunk(
  "user/update_disable_account",
  async (entity: TypedUser) => {
    const data = {
      user_id: entity._id,
      disable_account: entity.disable_account
    };
    return await axios.patch<TypedUser>(`${APP_URL.APP_AJAX_URL}/user/update/user-option`, data);
  },
  { serializeError: serializeAxiosError }
);

export const updateMessageStranger = createAsyncThunk(
  "user/update_message_stranger",
  async (entity: TypedUser) => {
    const data = {
      _id: entity._id,
      message_stranger: entity.message_stranger
    };
    return await axios.patch<TypedUser>(`${APP_URL.APP_AJAX_URL}/user/update/user`, data);
  },
  { serializeError: serializeAxiosError }
);


export const checkVerifyAccount = createAsyncThunk(
  "user/checkVerifyAccount",
  async () => {
    return await axios.get<TypedUser>(`${APP_URL.APP_AJAX_URL}/face-detection/total-today`);
  },
  { serializeError: serializeAxiosError }
);

/**
 * get all transaction of user
 */
export const getListTransactions = createAsyncThunk(
  "user/getListTransactions",
  async (id: string) => {
    return await axios.get<TypedTransaction[]>(`${APP_URL.APP_AJAX_URL}/subscribe/user/${id}`);
  },
  { serializeError: serializeAxiosError }
);

export const inappPurchaseGoogle = createAsyncThunk(
  "user/inappPurchaseGoogle",
  async (data: any, thunkAPI) => {
    return await axios.post(`${APP_URL.APP_AJAX_URL}/purchase/google`, data);
  },
  { serializeError: serializeAxiosError }
);

export const inappPurchaseApple = createAsyncThunk(
  "user/inappPurchaseApple",
  async (data: any, thunkAPI) => {
    return await axios.post(`${APP_URL.APP_AJAX_URL}/purchase/apple`, data);
  },
  { serializeError: serializeAxiosError }
);

export const createOrderPackage = createAsyncThunk(
  "user/createOrderPackage",
  async (data: { plan_id: string, amount_of_package: string, payment_method: string }, thunkAPI) => {
    return await axios.post(`${APP_URL.APP_AJAX_URL}/order/create`, data);
  },
  { serializeError: serializeAxiosError }
);

export const createUserLocation = createAsyncThunk(
  "user/createUserLocation",
  async (data: { latitude: number, longitude: number, low_power_mode?: string, speed?: string, battery?: string }, thunkAPI) => {
    return await axios.post(`${APP_URL.APP_AJAX_URL}/user/create/user-location`, data);
  },
  { serializeError: serializeAxiosError }
);

export const updateProfileUser = createAsyncThunk(
  "user/updateProfileUser",
  async (params: { user_avatar?: string, display_name?: string, user_email?: string, user_numberphone?: string }) => {
    return await axios.put<TypedUser>(APP_URL.USER, cleanEntity(params));
  },
  { serializeError: serializeAxiosError }
);

export const updateProfileOptions = createAsyncThunk(
  "user/updateProfileOptions",
  async (params: { user_id: string, user_birthday?: string, user_phone?: string }) => {
    return axios.patch<TypedUser>(`${APP_URL.APP_AJAX_URL}/user/update/user-option`, params);
  },
  { serializeError: serializeAxiosError }
);


export const USER = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      return {
        ...state,
        errorMessage: null
      };
    },
    setIsAuthenticated: (state) => {
      return {
        ...state,
        isAuthenticated: true
      };
    }
  },

  extraReducers(builder) {
    builder
      .addMatcher(
        isFulfilled(loginWithGoogleAccount, loginWithAppleAccount, loginWithFacebookAccount, loginWithEmailPassword, signUpWithEmailPassword),
        (state, action) => {
          console.log(action.payload.data, "action");
          return {
            ...state,
            loading: false,
            submitting: false,
            isAuthenticated: true,
            account: action.payload.data
          };
        }
      )
      .addMatcher(isFulfilled(getCurrentUser), (state, action) => {
        return {
          ...state,
          loading: false,
          submitting: false,
          account: {
            ...action.payload.data
          }
        };
      })
      .addMatcher(isFulfilled(updateNotificationStatus), (state, action) => {
        return {
          ...state,
          account: {
            ...state.account,
            notification_status: action.payload.data.notification_status
          }
        };
      })
      .addMatcher(isFulfilled(updateDisableAccount), (state, action) => {
        return {
          ...state,
          account: {
            ...state.account,
            disable_account: action.payload.data.disable_account
          }
        };
      })
      .addMatcher(isFulfilled(updateMessageStranger), (state, action) => {
        return {
          ...state,
          account: {
            ...state.account,
            message_stranger: action.payload.data.message_stranger
          }
        };
      })
      .addMatcher(isRejected(loginWithGoogleAccount, loginWithAppleAccount, loginWithFacebookAccount, loginWithEmailPassword, signUpWithEmailPassword), (state, action) => {
        /**
         * Login fail, register fail
         */
        return {
          ...state,
          account: {},
          errorMessage: action?.error?.message || ""
        };
      })
      .addMatcher(isRejected(getCurrentUser), (state, action) => {
        /**
         * Login fail, register fail
         */
        return {
          ...state,
          isAuthenticated: false,
          account: {}
        };
      })

      .addMatcher(isFulfilled(logout), (state) => {
        /**
         * Log out ...
         */
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          account: {}
        };
      })
      .addMatcher(isRejected(logout), (state) => {
        /**
         * Log out ...
         */
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          account: {}
        };
      })
      .addMatcher(isFulfilled(updateProfileUser), (state, action) => {

        return {
          ...state,
          account: {
            ...state.account,
            ...action.payload.data
          }
        };
      })
      .addMatcher(isFulfilled(updateProfileOptions), (state, action) => {
        return {
          ...state,
          account: {
            ...state.account,
            user_phone: action.payload.data.user_phone,
            user_birthday: action.payload.data.user_birthday
          }
        };
      });
  }
});
// Reducer
export const {
  clearError,
  setIsAuthenticated
} = USER.actions;
export default USER.reducer;
