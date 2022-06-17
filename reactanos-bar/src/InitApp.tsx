import { NavigationContainer } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseConfig } from "../firebase";
import LoginStack from "./navigation/stacks/LoginStack";
import { IStore } from "./redux/store";
import Spinner from "./components/atoms/Spinner/Spinner.component";
import DrawerStack from "./navigation/Drawer";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { notificationsConfiguration } from "./utils/pushNotifications";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

const InitApp = () => {
    const data:IStore = useSelector<IStore, any>(store => store);
  
    useEffect(() => {
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