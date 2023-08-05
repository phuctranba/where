import TextBase from "components/Base/text.base";
import {GlobalPopupHelper} from "helpers/index";
import {logEventAnalytics, sendEventToAppsflyer, useNativeAds, useRandomApp, useSystem} from "helpers/system.helper";
import {TypedEcosystem} from "models/ecosystem.model";
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Linking, Platform, Pressable, StyleSheet, View} from "react-native";
import NativeAdView, {
    AdBadge,
    CallToActionView,
    HeadlineView,
    IconView,
    NativeMediaView,
    TaglineView
} from "react-native-admob-native-ads";
import FastImage from "react-native-fast-image";
import {Device} from "ui/device.ui";
import {FontSizes, FontWeights, HS, MHS, VS} from "ui/sizes.ui";
import {SystemTheme} from "ui/theme";
import { EnumAnalyticEvent } from "constants/analytics.constant";

interface Props {
    onAdClicked: () => void;
    onAddImpression?: () => void;
}

const WIDTH = Math.min(Device.width - HS._32, Device.width - 16);

const AdsNativeAdmob = ({onAdClicked, onAddImpression}: Props, ref) => {
    const {styles, theme} = useSystem(createStyles);
    const {nativeAdsId, use_native_ads, switchAdsId} = useNativeAds();
    const nativeAdViewRef = useRef<NativeAdView>(null);
    const [dataAds, setDataAds] = useState<any>();
    const [readyToShowAds, setReadyToShowAds] = useState(!Device.isIos);
    const adAlreadyImpression = useRef(false);
    const [clicked, setClicked] = useState(false);
    const {randomAppAds} = useRandomApp()
    const refDataAdsEcosystem = useRef<TypedEcosystem>(randomAppAds())

    useEffect(() => {
        if (readyToShowAds) {
            const interval = setInterval(() => {
                if (nativeAdViewRef.current && nativeAdsId) {
                    clearInterval(interval);
                    nativeAdViewRef.current?.loadAd();
                }
            }, 100);
        } else {
            setTimeout(() => {
                setReadyToShowAds(true);
            }, Device.isIos ? 200 : 0);
        }
    }, [readyToShowAds]);

    useEffect(() => {
        if (nativeAdsId && use_native_ads) {
            setTimeout(() => {
                nativeAdViewRef.current?.loadAd();
            }, 0);
        }
    }, [nativeAdsId, use_native_ads]);


    useImperativeHandle(ref, () => ({
        onAdFailedToLoad,
        loadAd: () => {
            setDataAds(undefined);
            if (adAlreadyImpression.current) {
                setClicked(false);
                adAlreadyImpression.current = false;
                setReadyToShowAds(false);
            }
        }
    }));

    //////////////

    const onAdFailedToLoad = (error) => {
        if (!(error.code == 0 && error.currencyCode == "USD")) {
            logEventAnalytics(EnumAnalyticEvent.NativeAdsFailedToLoad + "alert", {
                //@ts-ignore
                code: error?.code,
                message: error?.message,
                currencyCode: error?.currencyCode
            });
            console.log(EnumAnalyticEvent.NativeAdsFailedToLoad + "alert");
            console.log("Call switchAdsId alert");
            switchAdsId();
        }
    }

    const onNativeAdLoaded = useCallback((data) => {
        logEventAnalytics(EnumAnalyticEvent.onNativeAdsLoaded + "alert");
        console.log(EnumAnalyticEvent.onNativeAdsLoaded + "alert");
        setDataAds(data);
    }, []);

    const onAdClickedCurrent = useCallback(() => {
        sendEventToAppsflyer("user_clicked_ads", {});
        GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
        logEventAnalytics(EnumAnalyticEvent.NativeAdsClicked + "alert");
        console.log(EnumAnalyticEvent.NativeAdsClicked + "alert");
        onAdClicked?.();
        setClicked(true);
    }, [onAdClicked]);

    const onAdImpression = useCallback(() => {
        logEventAnalytics(EnumAnalyticEvent.NativeAdsImpression + "alert");
        console.log(EnumAnalyticEvent.NativeAdsImpression + "alert");
        adAlreadyImpression.current = true;
        onAddImpression?.();
    }, []);

    const onAdOpened = useCallback(() => {
        logEventAnalytics(EnumAnalyticEvent.NativeAdsOpened + "alert");
        console.log(EnumAnalyticEvent.NativeAdsOpened + "alert");
    }, []);

    const onAdLeftApplication = useCallback(() => {
        logEventAnalytics(EnumAnalyticEvent.NativeAdsLeftApplication + "alert");
        console.log(EnumAnalyticEvent.NativeAdsLeftApplication + "alert");
    }, []);

    const onAdClosed = useCallback(() => {
        logEventAnalytics(EnumAnalyticEvent.NativeAdsClosed + "alert");
        console.log(EnumAnalyticEvent.NativeAdsClosed + "alert");
    }, []);

    const onAdLoaded = useCallback(() => {
        logEventAnalytics(EnumAnalyticEvent.NativeAdsLoaded + "alert");
        console.log(EnumAnalyticEvent.NativeAdsLoaded + "alert");
        refDataAdsEcosystem.current = randomAppAds();
    }, []);

    //////////////

    const renderEcoAds = () => {
        return (
            <Pressable
                onPress={() => {
                    logEventAnalytics(EnumAnalyticEvent.EcosystemAdsClick + "_" + refDataAdsEcosystem.current.name);
                    GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
                    Linking.openURL(Platform.select({
                        android: refDataAdsEcosystem.current?.link?.android,
                        default: refDataAdsEcosystem.current?.link?.ios
                    }));
                }}
                style={{width: "100%"}}>
                <View style={{paddingHorizontal: HS._16}}>
                    <View style={{flexDirection: "row", alignItems: "center", gap: HS._8}}>
                        <FastImage
                            source={{uri: refDataAdsEcosystem.current?.logo}}
                            style={{
                                width: 40,
                                height: 40
                            }}
                            resizeMode={"contain"}
                        />
                        <View style={{flex: 1}}>
                            <TextBase title={refDataAdsEcosystem.current?.name}
                                      style={{fontWeight: "bold", fontSize: 13, color: theme.text}}/>
                            <TextBase
                                title={refDataAdsEcosystem.current?.feature?.[Math.floor(Math.random() * (refDataAdsEcosystem.current?.feature?.length || 0))] || ""}
                                numberOfLines={2}
                                style={{fontSize: 11, color: theme.text}}/>
                        </View>
                    </View>
                </View>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "center"}}>
                    {
                        (refDataAdsEcosystem.current?.public_album || []).map(i => (
                            <FastImage
                                source={{uri: i.media_url}}
                                style={{
                                    width: "20%",
                                    height: VS._120
                                }}
                                resizeMode={"contain"}
                                key={i._id}
                            />
                        ))
                    }
                </View>

                <View
                    style={{...styles.buttonAds, backgroundColor: theme.btnActive, alignSelf: "center"}}
                >
                    <TextBase title={"Confirm"} numberOfLines={2}
                              style={{fontSize: FontSizes._16, color: theme.textLight}}
                              fontWeight={"bold"}/>
                </View>
            </Pressable>
        )
    }

    if (!readyToShowAds) {
        return null;
    }

    return (
        <>
            {
                nativeAdsId ? (
                    <NativeAdView
                        style={{width: "100%", paddingBottom: MHS._4}}
                        ref={nativeAdViewRef}
                        adChoicesPlacement="bottomRight"
                        adUnitID={nativeAdsId}

                        onAdFailedToLoad={onAdFailedToLoad}
                        onAdClicked={onAdClickedCurrent}
                        onNativeAdLoaded={onNativeAdLoaded}
                        onAdImpression={onAdImpression}
                        onAdOpened={onAdOpened}
                        onAdLeftApplication={onAdLeftApplication}
                        onAdClosed={onAdClosed}
                        onAdLoaded={onAdLoaded}

                        videoOptions={{
                            muted: true
                        }}
                    >
                        {
                            !clicked && dataAds ? (
                                <>
                                    <View style={{flexGrow: 1, flexShrink: 1, paddingHorizontal: HS._16}}>
                                        <AdBadge/>
                                        <View style={{flexDirection: "row", alignItems: "center", gap: HS._8}}>
                                            <IconView style={{width: 40, height: 40}}/>
                                            <View style={{flex: 1}}>
                                                <HeadlineView
                                                    style={{fontWeight: "bold", fontSize: 13, color: theme.text}}/>
                                                <TaglineView numberOfLines={2}
                                                             style={{fontSize: 11, color: theme.text}}/>
                                            </View>
                                        </View>
                                    </View>
                                    <NativeMediaView style={styles.mediaView}/>

                                    <CallToActionView
                                        style={{...styles.buttonAds, backgroundColor: theme.btnActive}}
                                        textStyle={styles.titleButton}
                                        buttonAndroidStyle={{...styles.buttonAds, backgroundColor: theme.btnActive}}
                                        allowFontScaling={false}
                                        allCaps
                                    />
                                </>
                            ) : null
                        }
                    </NativeAdView>
                ) : null
            }
            {!clicked && dataAds ? null : <>{renderEcoAds()}</>}
        </>
    );
};

const createStyles = (theme: SystemTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        buttonAds: {
            width: "80%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: MHS._16,
            marginTop: VS._10
        },
        titleButton: {
            color: theme.textLight,
            fontSize: FontSizes._16,
            ...FontWeights.Bold_600_SVN
        },
        mediaView: {
            width: WIDTH,
            height: VS._100
        }
    });
};

export default forwardRef(AdsNativeAdmob);
