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
        default:
            message="Se creó exitosamente"
        break;

    }
    showMessage({type:"success", message:"Exito", description:message});
}
