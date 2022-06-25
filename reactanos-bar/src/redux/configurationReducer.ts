const initialState = {
    sound:true,
    vibration:true,
    modal:false
}

export interface ConfigurationTypes{
    sound:boolean;
    vibration:boolean;
    modal:boolean;
}

const CONFIGURE_SOUND = 'CONFIGURE_SOUND';
const CONFIGURE_VIBRATION = 'CONFIGURE_VIBRATION';
const HANDLE_MODAL = 'HANDLE_MODAL';

const configurationReducer = (state = initialState, action:any={}) => {
  switch (action.type) {
    case CONFIGURE_SOUND:
        return {...state, sound:action.payload};
    case CONFIGURE_VIBRATION:
        return {...state, vibration:action.payload};
    case HANDLE_MODAL:
        return {...state, modal:action.payload};
    default:
        return {...state};
  }
};

export const handleConfigureSound = (payload:boolean) => ({
    type:CONFIGURE_SOUND,
    payload
})
 
export const handleConfigureVibration = (payload:boolean) => ({
    type:CONFIGURE_VIBRATION,
    payload
})

export const handleModal = (payload:boolean) => ({
    type:HANDLE_MODAL,
    payload
})

export default configurationReducer