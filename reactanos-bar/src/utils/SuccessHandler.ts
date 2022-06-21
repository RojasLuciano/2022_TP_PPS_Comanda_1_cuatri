import { showMessage } from 'react-native-flash-message';

export const successHandler = (error:any) => {
    let message:string="";
    switch(error){
        case 'table-created':
            message="Mesa creada exitosamente";
        break;
        case 'product-created':
            message="Producto cargado exitosamente";
        break;
        case 'poll-created':
            message="Encuesta enviada exitosamente";
        break;
        case 'order-created':
            message="Pedido registrado exitosamente";
        break;
        case 'order-paid':
            message="Pagaste la cuenta, por favor esperá a que confirmen el pago";
        break;
        case 'guessed-number':
            message="Has adivinado";
        break;



        default:
            message="Se creó exitosamente"
        break;

    }
    showMessage({type:"success", message:"Exito", description:message});
}
