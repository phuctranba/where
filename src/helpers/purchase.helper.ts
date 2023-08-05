import {useEffect, useRef} from "react";

import {useAppDispatch, useAppSelector} from "configs/store.config";
import {NAVIGATION_PREMIUM_SUCCESS_SCREEN} from "constants/router.constant";
import dayjs from "dayjs";
import {PurchaseError, requestPurchase, useIAP} from "react-native-iap";
import {
  createOrderPackage,
  getListPlan,
  inappPurchaseApple,
  inappPurchaseGoogle
} from "store/reducer/user.reducer.store";
import {Device} from "ui/device.ui";

import navigationHelper from "./navigation.helper";
import {logEventAnalytics, sendEventToAppsflyer, sendEventToFirestore, SUBSCRIPTIONS_DETAIL} from "./system.helper";
import {setIsPremium} from "store/reducer/system.reducer.store";
import {GlobalPopupHelper} from ".";
import {EnumAnalyticEvent} from "constants/analytics.constant";

export const usePurchase = (isFocus) => {
    const {
        finishTransaction,
        currentPurchase,
        getSubscriptions,
        subscriptions,
        requestSubscription,
        products,
        getProducts,
        getAvailablePurchases,
        availablePurchases
    } =
        useIAP();
    const dispatch = useAppDispatch();
    const account = useAppSelector(state => state.user.account);
    const sendSuccess = useRef(false);
    const sendFail = useRef(false);
    const typeBuy = useRef<"subscription" | "product" | "">("");
    const callOneTime = useRef(true);

    const sendDataToServer = async (current, itemStore, type = "subscription") => {
        const resPlan: any = await dispatch(getListPlan());
        if (!resPlan.payload?.data?.[0]?._id) {
            return;
        }
        const res: any = await dispatch(createOrderPackage({
            plan_id: resPlan.payload?.data?.[0]?._id,
            payment_method: Device.isAndroid ? "google_payment" : "apple_payment",
            amount_of_package: "1"
        }));
        if (!sendSuccess.current && typeBuy.current == "subscription") {
            sendSuccess.current = true;
            const subs = SUBSCRIPTIONS_DETAIL.find(i => i.productId == itemStore.productId);

            sendEventToAppsflyer(
                `purchased_${subs?.description}`,
                {
                    af_content_id: subs?.description,
                    af_currency: "USD",
                    af_revenue: subs?.price
                }
            );
            sendEventToFirestore({
                user_email: account.user_login,
                user_id: account._id,
                eventName: "purchased",
                fullname: account.display_name,
                params: {
                    confirmation: res.payload.data?._id,
                    payment_method: Device.isAndroid ? "Google Payment" : "Apple Payment",
                    payment_date: dayjs().format("MMM DD,YYYY"),
                    payment_amount: subs?.description
                }
            });
        }
        if (!res.payload?.data) {
            return;
        }
        const dataPurchase = {
            order_id: current.transactionId || "",
            product_id: current.productId,
            developer_payload: "abc",
            package_name: current.packageNameAndroid || "",
            purchase_time: new Date().getTime().toString(),
            purchase_token: (Device.isAndroid ? current.purchaseToken : current.transactionReceipt) || "",
            purchase_state: Device.isIos ? "" : (current.purchaseStateAndroid ? current.purchaseStateAndroid.toString() : "0"),
            quantity: "1",
            acknowledged: Device.isIos ? "true" : (current.isAcknowledgedAndroid ? "true" : "false"),
            local_order_id: res.payload.data?._id
        };
        if (Device.isIos || type == "subscription") {
            // @ts-ignore
            delete dataPurchase.developer_payload;
        }

        if (Device.isIos) {
            dispatch(inappPurchaseApple(dataPurchase));

        } else {
            dispatch(inappPurchaseGoogle(dataPurchase));
        }
    };


    useEffect(() => {
        const checkCurrentPurchase = async () => {
            if (!isFocus) {
                return;
            }
            try {
                GlobalPopupHelper.admobGlobalRef.current?.setIgnoreOneTimeAppOpenAd();
                GlobalPopupHelper.hideLoading();
                if (currentPurchase?.productId && callOneTime.current) {
                    await finishTransaction({
                        purchase: currentPurchase,
                        isConsumable: Device.isIos
                    });
                    callOneTime.current = false;
                    logEventAnalytics(EnumAnalyticEvent.Purchased);
                    sendDataToServer(currentPurchase, subscriptions.find(i => i.productId == currentPurchase?.productId), typeBuy.current);

                    await getAvailablePurchases();
                    if (typeBuy.current == "subscription") {
                        dispatch(setIsPremium(true));
                        navigationHelper.replace(NAVIGATION_PREMIUM_SUCCESS_SCREEN);
                    }
                    if (typeBuy.current == "product") {
                        GlobalPopupHelper.alert({
                            type: "success",
                            message: "Thanks for your donation"
                        });
                    }

                    return;
                }
            } catch (error) {
                try {
                    await getAvailablePurchases();
                } catch (error) {

                }
                console.log("error", error);

                if (error instanceof PurchaseError) {
                    if (!sendFail.current) {
                        sendFail.current = true;
                        sendEventToFirestore({
                            eventName: "purchase_failed",
                            user_email: account.user_login,
                            user_id: account._id,
                            fullname: account.display_name
                        });
                    }
                    GlobalPopupHelper.alert({
                        type: "error",
                        message: error.message
                    });
                } else {
                    if (!sendFail.current) {
                        sendFail.current = true;
                        sendEventToFirestore({
                            eventName: "purchase_failed",
                            user_email: account.user_login,
                            user_id: account._id,
                            fullname: account.display_name
                        });
                    }
                    GlobalPopupHelper.alert({
                        type: "error",
                        message: error?.toString()
                    });
                }
            }
        };

        checkCurrentPurchase();
    }, [currentPurchase, finishTransaction, account._id, isFocus]);

    const initIAP = async ({
                               subscriptionIds = [],
                               productIds = []
                           }: { subscriptionIds?: string[], productIds?: string[] }) => {
        try {
            if (productIds.length > 0) {
                await getProducts({skus: productIds});
            }
            if (subscriptionIds.length > 0) {
                await getSubscriptions({skus: subscriptionIds});
            }
            await getAvailablePurchases();
        } catch (error) {
            console.log("error ABC", error);
        }
    };

    const buySubscription = async (pac) => {
        logEventAnalytics(EnumAnalyticEvent.CheckoutPurchases);
        sendFail.current = false;
        sendSuccess.current = false;
        typeBuy.current = "subscription";
        if (Device.isIos) {
            GlobalPopupHelper.showLoading(false);
        }
        try {
            const offerToken: string | undefined = pac?.subscriptionOfferDetails ? (pac.subscriptionOfferDetails.find(i => !!i.offerId)?.offerToken || pac?.subscriptionOfferDetails[0]?.offerToken) : undefined;
            await requestSubscription({
                sku: pac?.productId,
                ...(offerToken && {
                    subscriptionOffers: [{sku: pac?.productId, offerToken}]
                })
            });

        } catch (error: any) {
            GlobalPopupHelper.hideLoading();
            console.log("request subcription error", error);
            if (error.code != "E_USER_CANCELLED") {
                sendEventToFirestore({
                    eventName: "purchase_failed",
                    user_email: account.user_login,
                    user_id: account._id,
                    fullname: account.display_name
                });
            }
        }
    };

    const buyProduct = async (productId) => {
        sendFail.current = false;
        sendSuccess.current = false;
        typeBuy.current = "product";
        if (Device.isIos) {
            GlobalPopupHelper.showLoading(false);
        }
        try {
            await requestPurchase({skus: [productId], sku: productId});
        } catch (error) {
            GlobalPopupHelper.hideLoading();
            console.log("requestPurchase error", error);
        }
    };


    return {buySubscription, buyProduct, subscriptions, initIAP, products, getAvailablePurchases, availablePurchases};
};
