import React, { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { useSystem } from "helpers/system.helper";
import { RootColor, SystemTheme } from "ui/theme";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import TextBase from "components/Base/text.base";
import { FontSizes, HS, MHS, VS } from "ui/sizes.ui";
import { Device } from "ui/device.ui";
import { IconArrowLeft } from "assets/svgIcons";
import { Shadow2 } from "ui/shadow.ui";
import { useAppDispatch } from "configs/store.config";
import { languages } from "../../languages";
import LottieView, { AnimationObject } from "lottie-react-native";
import BackgroundWelcome from "screens/welcome/components/background.welcome";
import SignInScreen from "screens/signIn/signIn.screen";


const ITEM_WIDTH = Device.width;
const ITEM_HEIGHT = Device.heightSafeWithStatus;
const FULL_SIZE = ITEM_WIDTH;

interface TypedWelcomeBoard {
  _id: string,
  title: string,
  img: AnimationObject,
}

const DATA: TypedWelcomeBoard[] = [
  {
    _id: "fljsdf",
    title: languages.welcome.guide1,
    img: require("assets/lotties/welcome1.json")
  },
  {
    _id: "fljsdddf",
    title: languages.welcome.guide2,
    img: require("assets/lotties/welcome2.json")
  },
  {
    _id: "fl123jsdf",
    title: languages.welcome.guide3,
    img: require("assets/lotties/welcome3.json")
  },
  {
    _id: "fl121323jsdf",
    title: languages.welcome.guide4,
    img: require("assets/lotties/welcome4.json")
  },
  {
    _id: "iuegfewbj",
    title: languages.welcome.guide4,
    img: require("assets/lotties/welcome4.json")
  }
];

export default function WelcomeScreen() {
  const { styles, theme } = useSystem(createStyles);
  const dispatch = useAppDispatch();
  const aniScrollX = useSharedValue(0);
  const refFlatList = useRef<FlatList>(null);
  const [isEnableScroll, setIsEnableScroll] = useState(true);

  const RenderItem = ({
                        item,
                        index
                      }: { index: number, item: TypedWelcomeBoard }) => {

    if (index === 4) {
      return <SignInScreen />;
    }

    return (
      <View style={styles.containerItem}>
        {
          index === 2 ?
            <View style={[styles.viewLotties, { justifyContent: "flex-end" }]}>
              <LottieView
                source={item.img}
                autoPlay
                style={{ width: "100%" }}
                resizeMode={"contain"}
              />
            </View>
            :
            <LottieView
              source={item.img}
              autoPlay
              speed={1.7}
              style={styles.viewLotties}
              resizeMode={"contain"}
            />
        }

        <TextBase
          title={item.title}
          style={styles.txtTitle} />
      </View>
    );
  };


  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      aniScrollX.value = event.contentOffset.x;
    }
  });

  const renderPagination = (item, index) => {
    const aniStyleScalePagination = useAnimatedStyle(() => {
      return ({
        width: MHS._12, height: MHS._12,
        marginHorizontal: MHS._8,
        backgroundColor: interpolateColor(aniScrollX.value, [(index - 1) * FULL_SIZE, index * FULL_SIZE, (index + 1) * FULL_SIZE], [`${theme.textInactive}50`, theme.btnActive, `${theme.textInactive}50`],
          "RGB"
        ),
        borderRadius: MHS._10
      });
    });

    return (
      <Animated.View key={index + ""}
                     style={[{ backgroundColor: item.color }, aniStyleScalePagination]} />
    );
  };

  const Pagination = useCallback(() => {

    const aniStyleOpacity = useAnimatedStyle(() => {
      return ({
        opacity: interpolate(aniScrollX.value, [0, ITEM_WIDTH * 3, ITEM_WIDTH * 3.2], [1, 1, 0])
      });
    });

    const aniTxtNext = useAnimatedStyle(() => {
      return ({
        opacity: interpolate(aniScrollX.value, [0, ITEM_WIDTH * 2, ITEM_WIDTH * 2.5], [1, 1, 0])
      });
    });

    const aniTxtStart = useAnimatedStyle(() => {
      return ({
        opacity: interpolate(aniScrollX.value, [0, ITEM_WIDTH * 2, ITEM_WIDTH * 2.5, ITEM_WIDTH * 3], [0, 0, 0, 1])
      });
    });

    const pressNext = useCallback(() => {
      // if (aniScrollX.value < ITEM_WIDTH * 2.8) {
      //   refFlatList.current?.scrollToIndex({ index: refCurrentIndex.current + 1, animated: true });
      // } else {
      //   navigationHelper.navigate(NAVIGATION_SIGN_IN_SCREEN);
      //   dispatch(setFirstInstall(false));
      // }
      refFlatList.current?.scrollToOffset({ offset: aniScrollX.value + ITEM_WIDTH, animated: true });
    }, []);

    return (
      <Animated.View style={[styles.viewPagination, aniStyleOpacity]}>
        <View style={{
          flexDirection: "row"
        }}>
          {DATA.map(renderPagination)}
        </View>

        <Pressable style={styles.btnNext}
                   onPress={pressNext}>
          <View>
            <Animated.Text style={[aniTxtStart, { color: theme.textDark }]}>{"Let's Stated "}</Animated.Text>

            <Animated.Text
              style={[styles.txtNext, aniTxtNext]}>{"Next "}</Animated.Text>
          </View>

          <IconArrowLeft size={FontSizes._20} color={theme.textDark} style={styles.icArrow} />
        </Pressable>
      </Animated.View>

    );
  }, []);

  const onViewableItemsChanged = useCallback((event) => {
    if (event?.viewableItems?.[0] && event?.viewableItems?.[0]?.index === 4) {
      setIsEnableScroll(false);
    }
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} translucent={true}
                 backgroundColor={RootColor.Transparent} />
      <BackgroundWelcome translationX={aniScrollX} sizeStep={DATA.length} />

      <Animated.FlatList
        ref={refFlatList}
        onScroll={handler}
        decelerationRate={0.5}
        snapToInterval={FULL_SIZE}
        disableIntervalMomentum
        horizontal
        scrollEventThrottle={32}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        data={DATA}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        scrollEnabled={isEnableScroll}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <Pagination />
    </View>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    txtAppUni: {
      fontSize: FontSizes._30,
      fontWeight: "bold"
    },
    txtEco: {
      fontSize: FontSizes._18,
      fontWeight: "bold"
    },
    viewName: {
      marginTop: Device.heightStatusBar * 1.5,
      marginHorizontal: HS._12,
      position: "absolute"
    },
    btnClose: {
      position: "absolute",
      right: HS._24,
      top: Device.heightStatusBar * 2
    },
    txtSkip: {
      color: theme.textDark,
      fontSize: FontSizes._14,
      textDecorationLine: "underline"
    },
    containerItem: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      alignItems: "center"
    },
    txtTitle: {
      fontSize: FontSizes._20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: VS._48
    },
    txtDes: {
      marginHorizontal: HS._12,
      color: theme.textDark,
      fontSize: FontSizes._18,
      flex: 1
    },
    viewLotties: {
      width: Device.width * 0.9,
      height: Device.width * 0.9,
      marginVertical: VS._48
    },
    btnNext: {
      flexDirection: "row",
      backgroundColor: theme.background,
      paddingHorizontal: HS._16,
      paddingVertical: MHS._10,
      alignItems: "center",
      borderRadius: MHS._10, ...Shadow2
    },
    txtNext: {
      position: "absolute",
      color: theme.textDark
    },
    icArrow: { transform: [{ rotate: "180deg" }] },
    viewPagination: {
      position: "absolute",
      bottom: VS._24,
      paddingHorizontal: HS._24,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between"
    }
  });
};
