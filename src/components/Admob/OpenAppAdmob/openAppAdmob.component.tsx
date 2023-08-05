import {useAppDispatch, useAppSelector} from "configs/store.config";
import {
    NAVIGATION_CHOOSE_COUNTRY_SCREEN,
    NAVIGATION_PREMIUM_SERVICE_SCREEN,
    NAVIGATION_PREMIUM_SUCCESS_SCREEN
} from "constants/router.constant";
import navigationHelper from "helpers/navigation.helper";
import {logEventAnalytics, useDisplayAds} from "helpers/system.helper";
import React, {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {AppState, AppStateStatus, View} from "react-native";
import mobileAds, {MaxAdContentRating, useAppOpenAd} from "react-native-google-mobile-ads";
import {switchAdsId} from "store/reducer/system.reducer.store";
import { EnumAnalyticEvent } from "constants/analytics.constant";

export interface TypedRefAdmob {
    setIgnoreOneTimeAppOpenAd: () => void;
    // showOpenAds: (routerName?: string) => void;
    checkIsOpenLoad: boolean
}

export interface TypedAdmobProps {
    enableAppOpenAd?: boolean;
}

export const OpenAppAdmobComponent = forwardRef(({enableAppOpenAd = true}: TypedAdmobProps, ref: React.Ref<TypedRefAdmob>) => {
    const appState = useRef(AppState.currentState);
    const {openAdsId} = useDisplayAds()
    const canShowOpenAdmob = useRef<boolean>(true);
    const dispatch = useAppDispatch()
    const isPremium = useAppSelector((state) => state.system.isPremium);
    const refRouterName = useRef<string | undefined>()
    const [isReadyToLoadAdmob, setIsReadyToLoadAdmob] = useState(false)
    const appOpenAd = useAppOpenAd(openAdsId, {
        requestNonPersonalizedAdsOnly: true,
    });
    const showInLoadingApp = useRef(false)
    const refShowingAds = useRef(false)
    const refAppOpenAd = useRef(false)

    //Hàm này siêu cần cho open ads
    useEffect(() => {
        mobileAds()
            .setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.PG,

                // Indicates that you want your content treated as child-directed for purposes of COPPA.
                tagForChildDirectedTreatment: true,

                // Indicates that you want the ad request to be handled in a
                // manner suitable for users under the age of consent.
                tagForUnderAgeOfConsent: true
            })
            .then(() => {
                mobileAds()
                    .initialize()
                    .then(adapterStatuses => {
                        setIsReadyToLoadAdmob(true);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            })
            .catch((error: any) => {
                console.log(error);
            });

    }, []);

    useImperativeHandle(
        ref,
        () => ({
            setIgnoreOneTimeAppOpenAd,
            // showOpenAds,
            checkIsOpenLoad: appOpenAd.isLoaded
        }),
        [appOpenAd.isLoaded, isPremium, appOpenAd.isShowing, isReadyToLoadAdmob]
    );

    // const showOpenAds = (routerName) => {
    //     console.log("show ads ne", routerName);
    //
    //     if (!isPremium) {
    //         showInLoadingApp.current = true
    //         refRouterName.current = routerName;
    //         if (!appOpenAd.isShowing && !refShowingAds.current) {
    //             refShowingAds.current = true
    //             if (Device.isIos) {
    //                 setTimeout(() => {
    //                     appOpenAd.show()
    //                 }, 1000);
    //             } else {
    //                 appOpenAd.show()
    //             }
    //         }
    //     } else {
    //         navigationHelper.replace(routerName)
    //     }
    // };


    useEffect(() => {
        if (isReadyToLoadAdmob && !isPremium) {
            if (enableAppOpenAd) {
                appOpenAd.load();
            }
        }
    }, [appOpenAd.load, isReadyToLoadAdmob, isPremium, enableAppOpenAd]);

    useEffect(() => {
        if (appOpenAd.isClosed) {
            refShowingAds.current = false
        }

        if (appOpenAd.isClosed && refRouterName.current) {
            navigationHelper.replace(refRouterName.current)
            refRouterName.current = undefined
            showInLoadingApp.current = false
        }
        if (enableAppOpenAd && appOpenAd.isClosed && !appOpenAd.isLoaded) {
            appOpenAd.load();
        }
    }, [appOpenAd.isClosed, appOpenAd.isLoaded, enableAppOpenAd]);

    const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active" && appOpenAd.isLoaded) {
            if (!isPremium) {
                if (canShowOpenAdmob.current) {
                    if (navigationHelper.getRouteName() !== NAVIGATION_PREMIUM_SERVICE_SCREEN && navigationHelper.getRouteName() !== NAVIGATION_PREMIUM_SUCCESS_SCREEN && navigationHelper.getRouteName() !== NAVIGATION_CHOOSE_COUNTRY_SCREEN) {
                        setTimeout(() => {
                            if (!appOpenAd.isShowing && !showInLoadingApp.current && !refShowingAds.current && appState.current === "active" && refAppOpenAd.current) {
                                refShowingAds.current = true
                                appOpenAd.show();
                            }
                        }, 500)
                    }
                } else {
                    canShowOpenAdmob.current = true;
                }
            }
        }
        appState.current = nextAppState;
    }, [appOpenAd, isPremium]);

    useEffect(() => {
        refAppOpenAd.current = appOpenAd.isLoaded
    }, [appOpenAd.isLoaded])

    useEffect(() => {
        if (appOpenAd.isAdImpression) {
            logEventAnalytics(EnumAnalyticEvent.OpenAdsImpression)
            console.log(EnumAnalyticEvent.OpenAdsImpression)
        }
    }, [appOpenAd.isAdImpression]);

    useEffect(() => {
        if (appOpenAd.error && appOpenAd.showFail) {
            logEventAnalytics(EnumAnalyticEvent.OpenAdsShowFail, {
                //@ts-ignore
                code: appOpenAd.error?.code,
                message: appOpenAd.error?.message
            })
            console.log(EnumAnalyticEvent.OpenAdsShowFail)
            console.log(appOpenAd.error?.message, "appOpenAd.error?.message")
        }
        if (appOpenAd.error && !appOpenAd.showFail) {
            logEventAnalytics(EnumAnalyticEvent.OpenAdsLoadFail, {
                //@ts-ignore
                code: appOpenAd.error?.code,
                message: appOpenAd.error?.message
            })
            console.log(EnumAnalyticEvent.OpenAdsLoadFail)

            console.log("Call switchAdsId open")
            dispatch(switchAdsId("open"))
        }
    }, [appOpenAd.error, appOpenAd.showFail]);

    useEffect(() => {
        const subscriptionAppState = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscriptionAppState.remove();
        };
    }, [appOpenAd.isLoaded, appOpenAd.isShowing, isPremium]);

    const setIgnoreOneTimeAppOpenAd = () => {
        canShowOpenAdmob.current = false;
    };

    return (
        <View/>
    );
});

export default memo(OpenAppAdmobComponent);
