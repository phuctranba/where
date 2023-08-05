import axios from 'axios';
import {serializeAxiosError} from 'configs/reducer.config';
import {EnumTheme, ID_ECOSYSTEM, KeyStorage} from "constants/system.constant";
import {cleanEntity} from 'helpers/object.helper';
import {Platform} from 'react-native';
import {TestIds as TestIdsNative} from 'react-native-admob-native-ads';
import DeviceInfo from 'react-native-device-info';
import {TestIds} from 'react-native-google-mobile-ads';

import {createAsyncThunk, createSlice, isFulfilled, isPending,} from '@reduxjs/toolkit';

import {APP_URL,} from 'configs/index';
import {TypedEcosystem} from "models/ecosystem.model";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import Config from 'react-native-config';
import {setStorageString} from "helpers/storage.helper";

dayjs.extend(isBetween)

interface InitialState {
    theme: EnumTheme
    language: string
    tokenFirebase: string
    isConnectedInternet: boolean
    nativeAdsId: string
    rewardAdsId: string
    openAdsId: string
    getConfigDone: boolean
    listNativeAdsId: string[]
    isFirstOpen: boolean
    config: {
        use_native_ads: boolean
        key_native_ads: string
        use_reward_ads: boolean
        key_reward_ads: string
        use_open_ads: boolean
        key_open_ads: string
        native_ads_pre: boolean
        native_ads_after: boolean
        native_ads_list: boolean
    }
    ecosystem: TypedEcosystem[],
    isPremium: boolean
}

const initialState: InitialState = {
    theme: EnumTheme.Light,
    language: "en",
    tokenFirebase: "",
    isConnectedInternet: true,
    nativeAdsId: "",
    rewardAdsId: "",
    openAdsId: "",
    getConfigDone: false,
    listNativeAdsId: [],
    isFirstOpen: true,
    config: {
        use_native_ads: false,
        key_native_ads: "",
        use_reward_ads: false,
        key_reward_ads: "",
        use_open_ads: false,
        key_open_ads: "",
        native_ads_pre: false,
        native_ads_after: false,
        native_ads_list: false
    },
    ecosystem: [],
    isPremium: false
};

/**
 * ZipEnter
 * Be used to set token firebase to account
 */
export const setTokenFirebase = createAsyncThunk(
    "system/setTokenFirebase",
    async (token: string) => {
        let paramDevice = {
            device_uuid: await DeviceInfo.getUniqueId(),
            device_signature: token,
        };

        let response = await axios.patch<any>(`${APP_URL.APP_AJAX_URL}/user/update-session`, cleanEntity(paramDevice));

        if (response.status === 200) {
            setStorageString(KeyStorage.FmcToken, token)
            return token;
        } else throw "error update firebase token";
    },
    {serializeError: serializeAxiosError}
);

export const getConfigSystem = createAsyncThunk(
    "system/getConfigSystem",
    async (_, thunkApi) => {
        return await axios.get<any>(`${APP_URL.APP_AJAX_URL}/config/ads/${Config.APP_TYPE}`);
    },
    {serializeError: serializeAxiosError}
);

export const getEcosystem = createAsyncThunk(
    "system/getEcosystem",
    async (_, thunkApi) => {
        return await axios.get<TypedEcosystem[]>(`${APP_URL.APP_AJAX_URL}/eco-system/list?page=1&limit=100&order_by=DESC&white_list=` + ID_ECOSYSTEM)
    },
    {serializeError: serializeAxiosError}
);

export const System = createSlice({
    name: "system",
    initialState,
    reducers: {
        switchTheme: (state) => {
            try {
                if (state.theme === EnumTheme.Dark)
                    return {
                        ...state,
                        theme: EnumTheme.Light,
                    };
                else
                    return {
                        ...state,
                        theme: EnumTheme.Dark,
                    };
            } catch (error) {
                return {
                    ...state,
                    theme: EnumTheme.Dark,
                };
            }
        },
        setLanguage: (state, action) => {
            return {
                ...state,
                language: action.payload,
            };
        },
        setMessageWatchAds: (state, action) => {
            return {
                ...state,
                messageWatchAds: action.payload,
            };
        },
        setFirstInstall: (state, action) => {
            return {
                ...state,
                isFirstOpen: action.payload,
            };
        },
        setIsPremium: (state, action) => {
            return {
                ...state,
                isPremium: action.payload
            }
        },
        setCountry: (state, action) => {
            return {
                ...state,
                country: action.payload.country,
            };
        },
        setCodeCountry: (state, action) => {
            return {
                ...state,
                codeCountry: action.payload.codeCountry,
            };
        },
        setIsConnectedInternet: (state, action) => {
            return {
                ...state,
                isConnectedInternet: action.payload,
            };
        },
        setRatingApp: (state, action) => {
            return {
                ...state,
                ratingApp: action.payload,
            };
        },
        setSystemConfig: (state, action) => {
            return {
                ...state,
                config: {
                    ...state.config,
                    ...action.payload,
                },
            };
        },
        setHeightWeightUnit: (state, action) => {
            return {
                ...state,
                heightWeightUnit: action.payload,
            };
        },
        setDistanceUnit: (state, action) => {
            return {
                ...state,
                distanceUnit: action.payload,
            };
        },
        switchAdsId: (state, action) => {
            let currentId, keyCurrentId, listIds, newConfig;
            switch (action.payload) {
                case "native": {
                    currentId = state.nativeAdsId;
                    keyCurrentId = "nativeAdsId";
                    listIds = state.config.key_native_ads.split("#")
                    newConfig = {
                        native_ads_alert: false,
                        native_ads_pre: false,
                        native_ads_after: false,
                        native_ads_login: false,
                        native_ads_chat: false,
                        use_native_ads: false,
                        native_ads_country: false,
                        native_ads_welcome: false,
                        native_ads_selected: false,
                        native_ads_list: false,
                    }
                    break;
                }
                case "reward": {
                    currentId = state.rewardAdsId;
                    keyCurrentId = "rewardAdsId";
                    listIds = state.config.key_reward_ads.split("#")
                    newConfig = {
                        use_reward_ads: false
                    }
                    break;
                }
                default: {
                    currentId = state.openAdsId;
                    keyCurrentId = "openAdsId";
                    listIds = state.config.key_open_ads.split("#")
                    newConfig = {
                        use_open_ads: false
                    }
                    break;
                }
            }

            let newCurrentNativeAdsId;
            let indexOfCurrentKey = listIds.indexOf(currentId);
            if (indexOfCurrentKey === -1) {
                newCurrentNativeAdsId = listIds?.[0]
            } else {
                if (listIds.length >= indexOfCurrentKey + 2) {
                    newCurrentNativeAdsId = listIds?.[indexOfCurrentKey + 1]
                    newConfig = {}
                } else {
                    newCurrentNativeAdsId = listIds?.[0]
                }
            }

            return ({
                ...state,
                config: {
                    ...state.config,
                    ...newConfig
                },
                [keyCurrentId]: newCurrentNativeAdsId
            })
        }
    },
    extraReducers(builder) {
        builder
            .addCase(setTokenFirebase.fulfilled, (state, action) => {
                state.tokenFirebase = action.payload;
            })
            .addCase(getEcosystem.fulfilled, (state, action) => {
                state.ecosystem = action.payload.data;
            })
            .addCase(setTokenFirebase.rejected, (state, action) => {
                state.tokenFirebase = "";
            })
            .addMatcher(isPending(getConfigSystem), state => {
                return {
                    ...state,
                    getConfigDone: false
                }
            })
            .addMatcher(isFulfilled(getConfigSystem), (state, action) => {
                const {option_content = []} = action.payload.data?.config || {}

                const key_reward_ads = __DEV__ ? TestIds.REWARDED : (option_content.find(i => i.key === `key_reward_ads_${Platform.OS}`)?.value || "")
                const key_open_ads = __DEV__ ? TestIds.APP_OPEN : (option_content.find(i => i.key === `key_open_ads_${Platform.OS}`)?.value || "")
                const key_native_ads = __DEV__ ? TestIdsNative.Image : (option_content.find(i => i.key === `key_native_ads_${Platform.OS}`)?.value || "")

                const native_ads_pre = (option_content.find(i => i.key === `native_ads_pre_${Platform.OS}`)?.value || 1) == 1
                const native_ads_after = (option_content.find(i => i.key === `native_ads_after_${Platform.OS}`)?.value || 1) == 1
                const native_ads_country = (option_content.find(i => i.key === `native_ads_country_${Platform.OS}`)?.value || 1) == 1
                const use_open_ads = (option_content.find(i => i.key == `use_open_ads_${Platform.OS}`)?.value || 1) == 1
                const use_reward_ads = (option_content.find(i => i.key == `use_reward_ads_${Platform.OS}`)?.value || 1) == 1
                const native_ads_list = (option_content.find(i => i.key == `native_ads_list_${Platform.OS}`)?.value || 1) == 1


                return {
                    ...state,
                    listNativeAdsId: key_native_ads?.split("#"),
                    nativeAdsId: key_native_ads?.split("#")?.[0],
                    rewardAdsId: key_reward_ads?.split("#")?.[0],
                    openAdsId: key_open_ads?.split("#")?.[0],
                    config: {
                        ...state.config,
                        key_reward_ads,
                        key_native_ads,
                        key_open_ads,
                        use_reward_ads,
                        native_ads_pre,
                        native_ads_after,
                        getConfigDone: true,
                        native_ads_country,
                        use_open_ads,
                        native_ads_list,
                        use_native_ads: native_ads_pre || native_ads_after || native_ads_country,
                    },
                };
            })
    },
});

export const {
    switchTheme,
    setLanguage,
    setIsConnectedInternet,
    setFirstInstall,
    setCountry,
    setCodeCountry,
    setIsPremium,
    setMessageWatchAds,
    switchAdsId,
    setSystemConfig
} =
    System.actions;

// Reducer
export default System.reducer;
