export interface IRootColor {
    Transparent: string
    DarkBackground: string
    LightBackground: string
    MainColor: string
    DarkMainColor: string
    DarkText: string
    LightText: string
    RedNegative: string
    Blue: string
    SpanishGray: string
    Smoke: string
    WhiteSmoke: string
    PremiumColor: string
}

export const RootColor: IRootColor = {
    Transparent: "#00000000",
    DarkBackground: "#212121",
    LightBackground: "#f2f4f6",
    MainColor: "#24A8AF",
    DarkMainColor: "#24A8AF",
    DarkText: "#F3F3F3",
    LightText: "#474747",
    RedNegative: "#D44333",
    Blue: "#3498db",
    SpanishGray: "#8F8F8F",
    Smoke: "#D9D9D9",
    WhiteSmoke: "#E8E8E8",
    PremiumColor: "#EFB73E",
}


export type SystemTheme = {
    backgroundMain: string;
    background: string;
    backgroundDrawer: string;
    text: string;
    textMain: string;
    textLight: string;
    textDark: string;
    textError: string;
    textInactive: string;
    backgroundTextInput: string;

    btnNegative: string;
    btnActive: string;
    btnInactive: string;
    btnLight: string;
    btnLightSmoke: string;

    icon: string;
    iconActive: string;
    iconInactive: string;
    iconLight: string;
    iconDark: string;

    gradient1: string
    gradient2: string
}
