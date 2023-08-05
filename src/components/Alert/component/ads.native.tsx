import React, {forwardRef} from 'react';
import AdsNativeAdmob from './ads.native.admob';
import {useAppSelector} from 'configs/store.config';
import {useDisplayAds} from "helpers/system.helper";

interface Props {
    onAdClicked: () => void
    onAddImpression?: () => void
}

const AdsNativeAlertView = ({onAdClicked, onAddImpression}: Props, ref) => {
    const isPremium = useAppSelector(state => state.system.isPremium)
    const {native_ads_alert} = useDisplayAds()

    if (isPremium || !native_ads_alert) {
        return null
    }

    return (
        <AdsNativeAdmob
            ref={ref}
            onAdClicked={onAdClicked}
            onAddImpression={onAddImpression}
        />
    )
}


export default forwardRef(AdsNativeAlertView);
