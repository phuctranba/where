import React, {forwardRef, useImperativeHandle, useRef,} from 'react';

import {useAppSelector} from 'configs/store.config';

import {useDisplayAds} from 'helpers/system.helper';
import RewardAdmobComponent from "components/Admob/RewardAdmob/rewardAdmob.component";

export interface TypedAdsRef {
    showAds: (cb?: Function) => void
}

const AdsRewardComponent = (_, ref: React.Ref<TypedAdsRef>) => {
    const rewardRef = useRef<any>()
    const isPremium = useAppSelector(state => state.system.isPremium);
    const {rewardAdsId, use_reward_ads} = useDisplayAds()

    useImperativeHandle(ref, () => ({
        showAds: (cb) => {
            rewardRef.current?.showAds(cb)
        }
    }), [isPremium, rewardAdsId])

    // if (isPremium || !rewardAdsId || !use_reward_ads) {
    //     return null
    // }

    return <RewardAdmobComponent ref={rewardRef}/>
}

export default forwardRef(AdsRewardComponent);
