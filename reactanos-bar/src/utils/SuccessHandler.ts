import { showMessage } from 'react-native-flash-message';

export const successHandler = (error:any) => {
    let message:string="";
    switch(error){
        case 'user-created':
            message="Usuario creado exitosamente";
        break;
        case 'employee-created':
            message="Empleado creado exitosamente";
        break;
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
        case 'waiting-list':
            message="Ahora estás pendiente de ingresar al local";
        break;
        case 'sit-on-table':
            message="Te acabas de sentar en la mesa, ya podés hacer tu pedido";
        break;
        case 'product-delivered':
            message="Producto entregado";
        break;
        case 'order-on-table':
            message="El pedido fue servido en la mesa";
        break;
        case 'guessed-number':
            message="Has adivinado";
        break;
        case 'order-sector-delivered':
            message="El pedido fue distribuído a las distintas áreas";
        break;
        default:
            message="Se creó exitosamente"
        break;

    }
    showMessage({type:"success", message:"Exito", description:message, duration:3000});
}
