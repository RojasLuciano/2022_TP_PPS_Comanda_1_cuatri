import { NavigationContainer } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firebaseConfig } from "../firebase";
import LoginStack from "./navigation/stacks/LoginStack";
import { IStore } from "./redux/store";
import Spinner from "./components/atoms/Spinner/Spinner.component";
import DrawerStack from "./navigation/Drawer";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { notificationsConfiguration } from "./utils/pushNotifications";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

import { Audio } from "expo-av";


const audioPlayer = new Audio.Sound();
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

const InitApp = () => {
    const data: IStore = useSelector<IStore, any>(store => store);
    const [sound, setSound] = useState(require("../assets/start.mp3"));

    async function playSound(sound: any) {
        try {
            await audioPlayer.unloadAsync()
            await audioPlayer.loadAsync(sound);
            await audioPlayer.playAsync();
        } catch (err) {
            console.warn("Couldn't Play audio", err)
        }
    }

    useEffect(() => {
        playSound(sound);
        notificationsConfiguration();
    }, [])

    return (
        <NavigationContainer>
            {data.loader.loading && <Spinner />}
            {data.auth.success ? <DrawerStack /> : <LoginStack />}
        </NavigationContainer>
    );
};

export default InitApp;