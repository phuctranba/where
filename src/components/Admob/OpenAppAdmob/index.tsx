import {useAppSelector} from 'configs/store.config';
import React, {forwardRef} from 'react';
import {useDisplayAds} from 'helpers/system.helper';
import { OpenAppAdmobComponent } from "components/Admob/OpenAppAdmob/openAppAdmob.component";

const OpenAppAdmob = (_, ref) => {
    const isPremium = useAppSelector(state => state.system.isPremium)
    const {openAdsId, use_open_ads} = useDisplayAds()

    if (isPremium || !openAdsId || !use_open_ads) {
        return null
    }
    return (
        <OpenAppAdmobComponent ref={ref}/>
    )
}

export default forwardRef(OpenAppAdmob);
