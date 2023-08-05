import analytics from "@react-native-firebase/analytics";

export function logScreenToFirebase(screen_name: string, screen_class: string) {
    analytics().logScreenView({
        screen_name: screen_name,
        screen_class: screen_class,
    }).catch(console.log);
}
