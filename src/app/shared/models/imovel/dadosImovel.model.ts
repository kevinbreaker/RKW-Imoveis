import { FotoImovel } from './fotoImovel.model';
import { CaracteristicaImovel } from './caracteristicaImovel.model';
import { CondominioImovel } from './condominioImovel.model';

export class DadosImovel {
    titulo: string;
    descricao: string;
    imgs: any[];
    // imgs: string;
    tipo: string;
    preco: string;
    condominio?: boolean;
    condominioImovel: CondominioImovel;
    temIptu?: boolean;
    iptu?: string;
    tipoDeImovel: string;
    area: string;
    quartos: number;
    wc: number;
    temVaga?: boolean;
    vagaEstacionamento: number;
    caracteristicas: CaracteristicaImovel[];
}
