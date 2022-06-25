import administrador from "../../../../assets/administrador.png";
import supervisor from '../../../../assets/supervisor.png';
import mozo from '../../../../assets/mozo.png';
import metre from '../../../../assets/metre.png';
import cliente from '../../../../assets/cliente.png';
import cocinero from '../../../../assets/cocinero.png';

export const imageHandler = (imageName: string): any => {
    switch (imageName) {
        case 'administrador':
            return administrador;
        case 'supervisor':
            return supervisor;
        case 'mozo':
            return mozo;
        case 'metre':
            return metre;
        case 'cliente':
            return cliente;
        case 'cocinero':
            return cocinero;
    }
}