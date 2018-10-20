export interface ImovelDialog {
    dadosDoImovel: DadosDoImovel;
    localizacao: Localizacao;
    caracteristicas: Caracteristicas[];
}

export interface DadosDoImovel {
    titulo: string;
    descricao: string;
    imgs: ImgsDoImovel[];
    tipo: string;
    preco: string;
    condominio: string;
    iptu: string;
    tipoDeImovel: string;
    area: string;
    quartos: string;
    wc: string;
    vagaEstacionamento: string;
}

export interface Localizacao {
    latitude: number;
    longitude: number;
}

export interface Caracteristicas {
    caracteristica: string;
}

export interface ImgsDoImovel {
    img: string;
}
