const initialState = {
    loading:false
}

export interface LoaderTypes{
    loading:boolean;
}

const LOADING_FALSE = 'LOADING_FALSE';
const LOADING_TRUE = 'LOADING_TRUE';

const loaderReducer = (state = initialState, action:any={}) => {
  switch (action.type) {
    case LOADING_FALSE:
        return {...state, loading:false};
    case LOADING_TRUE:
        return {...state, loading:true};
    default:
        return {...state};
  }
};

export const fetchLoadingStart = () => ({
    type:LOADING_TRUE
})
 
export const fetchLoadingFinish = () => ({
    type:LOADING_FALSE
})

export default loaderReducer