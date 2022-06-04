import { showMessage } from 'react-native-flash-message';

export const errorHandler = (error:any) => {
    switch(error){
        case 'auth/invalid-email':
            showMessage({type:"danger", message:"Error", description:"El correo electrónico es inválido"});
            break;
        case 'auth/email-already-in-use':
            showMessage({type:"danger", message:"Error", description:"El correo electrónico ingresado ya está registrado"});
            break;
        case 'auth/weak-password':
            showMessage({type:"danger", message:"Error", description:"La contraseña debe tener un mínimo de 6 carácteres"});
        break;
        case 'auth/user-not-found':
            showMessage({type:"danger", message:"Error", description:"Correo electrónico y/o contraseña inválido"});
        break;
        case 'auth/wrong-password':
            showMessage({type:"danger", message:"Error", description:"Correo electrónico y/o contraseña inválido"});
        break;
        case 'pass-diff':
            showMessage({type:"danger", message:"Error", description:"Las contraseñas no coinciden"});
        break;
        case 'image-error':
            showMessage({type:"danger", message:"Error", description:"Ha ocurrido un error intentando cargar el producto"});
        break;
        default:
            showMessage({type:"danger", message:"Error", description:"Ha ocurrido un error, por favor reintente nuevamente"});
        break;
    }
}
