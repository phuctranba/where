import React, {
    forwardRef,
    memo,
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import {IconPicture} from 'assets/svgIcons';
import TextBase from "components/Base/text.base";
import {useSystem} from 'helpers/system.helper';
import {languages} from 'languages';
import isEqual from 'react-fast-compare';
import {ActivityIndicator, FlatList, FlatListProps, Platform, RefreshControl, StyleSheet, View,} from 'react-native';
import {Device} from 'ui/device.ui';
import {HS, MHS, VS,} from 'ui/sizes.ui';
import {SystemTheme} from 'ui/theme';

import {useScrollToTop} from '@react-navigation/native';

interface Props<T> extends FlatListProps<T> {
    scrollIndex?: number,
    data: T[],
    onRefreshProp?: () => Promise<T>,
    onLoadMoreProp?: (page: number) => Promise<T>,
    tabLabel?: string,
    skeleton?: () => ReactElement
    canCallLoadmore?: boolean
}

export interface TypedRefBaseListCustom {
    refresh: () => void
    filterList: (functionCB) => void
}

const ListCustomBase = (props: Props<any>, ref: React.Ref<TypedRefBaseListCustom>) => {
    const {
        scrollIndex,
        data,
        onRefreshProp,
        onLoadMoreProp,
        style = {},
        keyExtractor,
        tabLabel,
        skeleton,
        canCallLoadmore = true,
        ListEmptyComponent,
        ...flatlistProps
    } = props;
    const {styles, theme} = useSystem(createStyles);
    const flatlistRef = useRef<FlatList>(null);
    const canLoadmore = useRef(true);
    const [list, setList] = useState<any[]>([]);
    const baseList = useRef<any[]>([])
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        isRefresh: true,
        isLoadMore: false,
        page: 1
    });
    const hasScrolled = useRef(false)

    useScrollToTop(flatlistRef);

    useEffect(() => {
        if (loading) {
            onRefresh()
        }
    }, [loading])

    const onRefresh = async () => {
        try {
            const res = await onRefreshProp?.();
            if (loading) {
                setLoading(false);
            }
            if (res) {
                if (res.length < 20) {
                    canLoadmore.current = false
                }
                baseList.current = res
                setList(res);
                setConfig({
                    ...config,
                    isRefresh: false,
                    page: 1
                })
                return;
            }
            setConfig({
                ...config,
                isRefresh: false,
            })
        } catch (error) {
            if (loading) {
                setLoading(false);
            }
            setConfig({
                ...config,
                isRefresh: false,
            })
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: () => {
            setLoading(true);
        },
        filterList: (functionCallback) => {
            setList(functionCallback(list))
        },
        addItemToList: (item) => {
            setList(prev => ([item, ...prev]))
        },
        list: list
    }), [list]);

    const renderFooterComponent = () => {
        return config.isLoadMore ? (
            <View style={styles.footerLoading}>
                <ActivityIndicator color={theme.backgroundMain} size={20}/>
            </View>
        ) : (
            <View style={styles.footer}/>
        )
    };

    const handleLoadMore = async () => {
        if (!config.isLoadMore && hasScrolled.current && canCallLoadmore) {
            try {
                const res = await onLoadMoreProp?.(config.page + 1);
                if (res.length > 0) {
                    baseList.current = [...list, ...res]
                    setList([...list, ...res])
                    setConfig({
                        ...config,
                        isLoadMore: false,
                        page: config.page + 1
                    })
                }
            } catch (error) {
                setConfig({
                    ...config,
                    isLoadMore: false,
                })
            }
        }
        hasScrolled.current = false;
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

    if (loading && skeleton) {
        return skeleton()
    }
    return (
        <FlatList
            ref={flatlistRef}
            data={list}
            keyExtractor={(item, index) => keyExtractor ? `${keyExtractor} - ${index}` : `${item?._id} - ${index}`}
            style={style}
            scrollEventThrottle={16}
            ListFooterComponent={!loading ? (props.ListFooterComponent || renderFooterComponent) : undefined}
            extraData={data}
            onScrollBeginDrag={() => hasScrolled.current = true}
            onScrollEndDrag={() => hasScrolled.current = true}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={Platform.OS === "android" ? 0.5 : -0.001}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            ListEmptyComponent={ListEmptyComponent || renderEmptyComponent}
            refreshControl={
                <RefreshControl colors={["#48B794"]} refreshing={config.isRefresh} onRefresh={onRefresh}/>
            }
            {...flatlistProps}
        />
    );
}

const createStyles = (theme: SystemTheme) => {
    return StyleSheet.create({
        footerLoading: {
            marginVertical: VS._10
        },
        footer: {
            height: VS._32
        },
        header: {
            height: VS._44,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: HS._16
        },
        viewEmpty: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: VS._100,
            width: Device.width - HS._32
        },
        iconEmpty: {
            width: MHS._66,
            height: MHS._66,
            borderRadius: MHS._66,
            backgroundColor: theme.btnActive,
            justifyContent: "center",
            alignItems: "center",
        },
        textTitleEmpty: {
            textAlign: "center",
            marginVertical: VS._16,
            marginHorizontal: HS._32
        },
    })
}


export default memo(forwardRef(ListCustomBase), isEqual);
