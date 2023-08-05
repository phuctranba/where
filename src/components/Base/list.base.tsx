import React, {memo, useCallback, useRef} from 'react';

import {useScrollToTop} from '@react-navigation/native';
import {useSystem} from "helpers/system.helper";
import isEqual from 'react-fast-compare';
import {ActivityIndicator, FlatList, FlatListProps, Platform, RefreshControl, StyleSheet, View} from 'react-native';
import {HS, MHS, VS} from 'ui/sizes.ui';
import {IconPicture} from 'assets/svgIcons';
import TextBase from "components/Base/text.base";
import {languages} from 'languages';
import {Device} from 'ui/device.ui';
import {RootColor} from 'ui/theme';

interface Props extends FlatListProps<any> {
    scrollIndex?: number,
    data: any[],
    onRefreshProp?: (() => void) | (() => Promise<void>),
    isRefresh: boolean,
    onLoadMoreProp?: (() => void) | (() => Promise<void>),
    isLoadMore?: boolean,
    tabLabel?: string,
}

const ListBase = (props: Props) => {
    const {
        scrollIndex,
        data,
        onRefreshProp = () => {
        },
        isRefresh,
        onLoadMoreProp = () => {
        },
        isLoadMore = false,
        style = {},
        keyExtractor,
        tabLabel,
        ...flatlistProps
    } = props;
    const onScroll = useRef(false);
    const {theme} = useSystem();
    const flatlistRef = useRef<FlatList>(null)

    useScrollToTop(flatlistRef)

    const onRefresh = () => {
        onRefreshProp?.();
    };

    const renderFooterComponent = () => {
        return isLoadMore ? (
            <View style={styles.footerLoading}>
                <ActivityIndicator color={theme.backgroundMain} size={20}/>
            </View>
        ) : (
            <View style={styles.footer}/>
        )
    };

    const handleLoadMore = () => {
        if (!isLoadMore && onScroll.current) {
            onLoadMoreProp?.();
        }
        onScroll.current = false;
    }

    const renderEmptyComponent = useCallback(() => {
        return (
            <View style={styles.viewEmpty}>
                <View style={styles.iconEmpty}>
                    <IconPicture color={theme.textLight} size={MHS._24}/>
                </View>
                <TextBase title={languages.notFound} fontSize={26} fontWeight="700" style={styles.textTitleEmpty}/>
            </View>
        )
    }, [])

    return (
        <FlatList
            ref={flatlistRef}
            data={data}
            keyExtractor={(item, index) => keyExtractor ? `${keyExtractor} - ${index}` : `${item.id} - ${index}`}
            style={style}
            scrollEventThrottle={16}
            ListEmptyComponent={props.ListEmptyComponent || renderEmptyComponent}
            ListFooterComponent={props.ListFooterComponent || renderFooterComponent}
            extraData={data}
            onMomentumScrollBegin={() => {
                onScroll.current = true
            }}
            onScrollBeginDrag={() => {
                onScroll.current = true
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={Platform.OS === "android" ? 0.5 : -0.001}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            refreshControl={
                <RefreshControl refreshing={isRefresh} onRefresh={onRefresh}/>
            }
            {...flatlistProps}
        />
    );
}

const styles = StyleSheet.create({
    footerLoading: {
        marginVertical: VS._10
    },
    footer: {
        height: VS._32
    },
    viewEmpty: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: VS._100,
        width: Device.width - HS._32,
        marginHorizontal: HS._16
    },
    iconEmpty: {
        width: MHS._66,
        height: MHS._66,
        borderRadius: MHS._66,
        backgroundColor: RootColor.MainColor,
        justifyContent: "center",
        alignItems: "center",
    },
    textTitleEmpty: {
        textAlign: "center",
        marginVertical: VS._16,
        marginHorizontal: HS._32
    },
})

export default memo(ListBase, isEqual);
