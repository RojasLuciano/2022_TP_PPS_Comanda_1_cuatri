import { LoaderTypes } from './loaderReducer';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import authReducer, { AuthTypes } from './authReducer'
import loaderReducer from './loaderReducer';
import configurationReducer from './configurationReducer';
import { ConfigurationTypes } from './configurationReducer';

export interface IStore{
    auth:AuthTypes,
    loader:LoaderTypes,
    configuration: ConfigurationTypes
}

const rootReducer = combineReducers<IStore>({
    auth: authReducer,
    loader: loaderReducer,
    configuration: configurationReducer,
})

const store = generateStore();
export default store;

function generateStore() {
    const store = createStore( rootReducer, compose( applyMiddleware(thunk) ) )
    return store
}