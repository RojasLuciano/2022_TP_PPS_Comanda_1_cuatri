import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { showMessage } from "react-native-flash-message";
import { sleep } from "../utils/utils";
import { errorHandler } from '../utils/ErrorsHandler';
import { auth, db } from '../InitApp';
import { FormData } from "../models/login/formData.types";
import { fetchLoadingStart, fetchLoadingFinish } from './loaderReducer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { authHandler } from "../utils/AuthHandler";
import { IStore } from './store';
import { Audio } from "expo-av";

const audioPlayer = new Audio.Sound();

const initialState = {
    user: {},
    success: false,
    error: '',
}

export interface AuthTypes {
    user: any;
    success: boolean;
    error: string;
}

const LOGIN_INIT = 'LOGIN_INIT';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const INITIAL_STATE = 'INITIAL_STATE';
const RESET_ERROR = 'RESET_ERROR';


const authReducer = (state = initialState, action: any = {}) => {
    switch (action.type) {
        case LOGIN_INIT:
            return { ...state };
        case LOGIN_SUCCESS:
            return { ...state, success: true, user: action.payload };
        case LOGIN_ERROR:
            return { ...state, success: false, error: action.payload };
        case RESET_ERROR:
            return { ...state, error: '' };
        case INITIAL_STATE:
            return { ...initialState }
        default:
            return { ...state };
    }
};

const fetchInit = () => (
    { type: LOGIN_INIT }
)

export const resetError = () => (
    { type: RESET_ERROR }
)

const fetchSuccess = (payload: any) => ({
    type: LOGIN_SUCCESS,
    payload
})

const fetchError = (payload: any) => ({
    type: LOGIN_ERROR,
    payload
})

export const fetchInitialState = () => ({
    type: INITIAL_STATE
})

export const handleLogin = (data: FormData) => async (dispatch: any, getState:any) => {
    try {
        dispatch(fetchInit());
        dispatch(fetchLoadingStart());
        await signInWithEmailAndPassword(auth, data.email, data.password);
        const querySnapshot = await getDocs(
            query(collection(db, "users"), where("email", "==", data.email))
        );
        querySnapshot.forEach((user) => {
            const data = user.data();
            authHandler(data);
            dispatch(fetchSuccess({ ...data, id: user.id }));
        })
        await sleep(1000);
    } catch (error: any) {
        errorHandler(error.code, getState().configuration.vibration);
        handleLogout();
        dispatch(fetchError(error.code));
    } finally {
        dispatch(fetchLoadingFinish());
    }
}

export const refreshUserData = () => async (dispatch: any, getState: () => IStore) => {
    try {
        dispatch(fetchLoadingStart());
        const { user } = getState().auth;
        const querySnapshot = await getDocs(
            query(collection(db, "users"), where("email", "==", user.email))
        );
        querySnapshot.forEach((user) => {
            const data = user.data();
            authHandler(data);
            dispatch(fetchSuccess({ ...data, id: user.id }));
        })
        await sleep(1000);
    } catch (error: any) {
        errorHandler(error.code, getState().configuration.vibration);
        handleLogout();
        dispatch(fetchError(error.code));
    } finally {
        dispatch(fetchLoadingFinish());
    }
}

export const handleRegister = (data: FormData) => async (dispatch: any, getState:any) => {
    try {
        dispatch(fetchInit());
        dispatch(fetchLoadingStart());
        const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await sleep();
        dispatch(fetchInitialState());
        showMessage({ type: "success", message: "Exito", description: 'Usuario creado exitosamente' })
    } catch (error: any) {
        errorHandler(error.code, getState().configuration.vibration);
        dispatch(fetchError(error.code));
    } finally {
        dispatch(fetchLoadingFinish());
    }
}

async function playSound(sound: any) {
    try {
        await audioPlayer.unloadAsync()
        await audioPlayer.loadAsync(sound);
        await audioPlayer.playAsync();
    } catch (err) {
        console.warn("Couldn't Play audio", err)
    }
}

export const handleLogout = () => async (dispatch: any,getState:any) => {
    try { 
        if(getState().configuration.sound){
            playSound(require("../../assets/finish.mp3"));
        }
        dispatch(fetchInit());
        dispatch(fetchLoadingStart());
        signOut(auth);
        dispatch(fetchInitialState());
    } catch (error: any) {
        errorHandler(error.code, getState().configuration.vibration);
        dispatch(fetchError(error.code));
    } finally {
        dispatch(fetchLoadingFinish());
    }
}

export default authReducer