import { FotoImovel } from './fotoImovel.model';
import { CaracteristicaImovel } from './caracteristicaImovel.model';
import { CondominioImovel } from './condominioImovel.model';

export class DadosImovel {
    titulo: string;
    descricao: string;
    imgs: FotoImovel[];
    tipo: string;
    preco: string;
    condominio: CondominioImovel;
    iptu: string;
    tipoDeImovel: string;
    area: string;
    quartos: number;
    wc: number;
    vagaEstacionamento: number;
    caracteristicas: CaracteristicaImovel[];
}
