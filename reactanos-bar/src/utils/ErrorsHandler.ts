import { showMessage } from 'react-native-flash-message';
import {  Vibration } from 'react-native';

export const errorHandler = (error: any) => {
    let message: string = "";
    switch (error) {
        case 'auth/invalid-email':
            message = "El correo electrónico es inválido"
            Vibration.vibrate(1000);
            break;
        case 'auth/email-already-in-use':
            message = "El correo electrónico ingresado ya está registrado"
            Vibration.vibrate(1000);
            break;
        case 'auth/weak-password':
            message = "La contraseña debe tener un mínimo de 6 carácteres"
            Vibration.vibrate(1000);
            break;
        case 'auth/user-not-found':
            message = "Correo electrónico y/o contraseña inválido"
            Vibration.vibrate(1000);
            break;
        case 'auth/wrong-password':
            message = "Correo electrónico y/o contraseña inválido"
            Vibration.vibrate(1000);
            break;
        case 'pass-diff':
            message = "Las contraseñas no coinciden"
            Vibration.vibrate(1000);
            break;
        case 'image-error':
            message = "Ha ocurrido un error intentando cargar el producto"
            Vibration.vibrate(1000);
            break;
        case 'empty-fields':
            message = "Todos los campos son requeridos"
            Vibration.vibrate(1000);
            break;
        case 'table-exists':
            message = "El número de la tabla ya existe"
            Vibration.vibrate(1000);
            break;
        case 'table-not-exists':
            message = "El código QR no está asociado a alguna de nuestras mesas"
            Vibration.vibrate(1000);
            break;
        case 'table-doesnt-match':
            message = "El código QR de esa mesa no es el mismo que la que te asignaron"
            Vibration.vibrate(1000);
            break;
        case 'table-taken':
            message = "La mesa ya está ocupada"
            Vibration.vibrate(1000);
            break;
        case 'unauthorized':
            message = "Usuario no autorizado"
            Vibration.vibrate(1000);
            break;
        case 'invalid-qr':
            message = "QR inválido"
            Vibration.vibrate(1000);
            break;
        case 'havent-guessed':
            message = "No has adivinado el número"
            Vibration.vibrate(1000);
            break;
        case 'order-error':
            message = "Ocurrió un error al generar el pedido"
            Vibration.vibrate(1000);
            break;
        default:
            message = "Ha ocurrido un error, por favor reintente nuevamente"
            Vibration.vibrate(1000);
            break;
    }
    showMessage({ type: "danger", message: "Error", description: message });
}
