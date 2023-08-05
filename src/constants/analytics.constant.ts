export enum EnumAnalyticEvent {
    ImpressionAdsPrev = "user_impression_ads_prev",
    PressAdsPrev = "user_press_ads_prev",
    PressAdsIn = "user_press_ads_in",
    ImpressionAdsAfter = "user_impression_ads_after",
    PressAdsAfter = "user_press_ads_after",
    UnlockRenameChat = "user_unlock_rename_chat",
    ChangeTheme = "user_change_theme",
    CheckoutPurchases = "user_checkout_purchases",
    Purchased = "user_purchased",
    SendChat = "user_send_chat",
    Loading = "user_loading",


    NativeAdsImpression = "native_impression_",
    NativeAdsOpened = "native_opened_",
    NativeAdsLeftApplication = "native_left_application_",
    NativeAdsClicked = "native_clicked_",
    NativeAdsClosed = "native_closed_",
    NativeAdsLoaded = "native_loaded_",
    onNativeAdsLoaded = "on_native_loaded_",
    NativeAdsFailedToLoad = "native_failed_to_load_",
    onNativeCallLoaded = "on_native_call_loaded_",


    OpenAdsImpression = "open_impression",
    OpenAdsShowFail = "open_show_fail",
    OpenAdsLoadFail = "open_load_fail",

    RewardAdsImpression = "reward_impression",
    RewardAdsShowFail = "reward_show_fail",
    RewardAdsCallShow = "reward_call_show",
    RewardAdsShow = "reward_show",
    RewardAdsLoadFail = "reward_load_fail",

    EcosystemRewardAdsClick = "eco_reward_ads_click",
    EcosystemAdsClick = "eco_ads_click",
}
