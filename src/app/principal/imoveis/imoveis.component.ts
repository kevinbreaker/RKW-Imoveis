import { AnuncioService } from './../../core/services/anuncio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogImovelViewComponent } from '../components/dialog-imovel-view/dialog-imovel-view.component';
import { AgmMap } from '@agm/core';
// declare var google;


interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

interface Location {
    lat: number;
    lng: number;
    viewport?: Object;
    zoom: number;
    address_level_1?: string;
    address_level_2?: string;
    address_country?: string;
    address_zip?: string;
    address_state?: string;
    marker?: Marker;
}

@Component({
    selector: 'app-imoveis',
    templateUrl: './imoveis.component.html',
    styleUrls: ['./imoveis.component.css']
})
export class ImoveisComponent implements OnInit {

    geocoder: any;
    public location: Location = {
        lat: 0,
        lng: 0,
        marker: {
            lat: 0,
            lng: 0,
            draggable: true
        },
        zoom: 17
    };

    @ViewChild(AgmMap) map: AgmMap;


    minhaPosicao: any = {
        latitude: -8.186457,
        longitude: -34.930128,
        zoom: 15
    };
    // tslint:disable-next-line:no-inferrable-types
    lat: number = -8.186457;
    // tslint:disable-next-line:no-inferrable-types
    lng: number = -34.930128;

    // -8.186457, -34.930128
    // -8.186176, -34.929372
    // -8.1269376,-34.918234,

    // colocar por padrão a localizacao mais do cara
    imoveis: any[];

    public imoveis2: any[] = JSON.parse(JSON.stringify(

        [
            {
                dadosDoImovel: {
                    titulo: `Apartamento em Piedade com 2 quartos 1 vaga de garagem
                    Edf. Paulo de Tarso`,
                    descricao: `
                    Apartamento em Piedade com 2 quartos 1 vaga de garagem
                    Edf. Paulo de Tarso

                    Valor do investimento: Locação R$ 1.470,00 com taxas inclusas

                    Av. Ayrton Senna nº 308.
                    Piedade, Jaboatão dos Guararapes - PE
                    Próximo ao Posto de Gasolina BR e Supermercado Leão

                    O Empreendimento
                    04 apt por andar
                    11 Andares
                    Antena coletiva, Central de gás, Cerca elétrica
                    Churrasqueira, Circuito de TV
                    Elevador
                    Guarita de Segurança, Interfone
                    Jardim, Pilotis
                    Piscina, Portão eletrônico
                    Rua calçada
                    Sauna

                    O Apartamento
                    75 m²
                    Amarios embutidos
                    Sala para 2 ambientes
                    2 Quartos + 1 reversível
                    1 Garagem
                    Cozinha com armários
                    Varanda
                    WC Social

                    DaFonte Consultoria & Negócios
                    (81) 99517.9582/ 99517.9581
                    `,
                    imgs: [
                        { img: 'https://resizedimgs.vivareal.com/fit-in/870x653/vr.images.sp/c3b3a34992f6d2fffee6297ed10e964d.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/fit-in/870x653/vr.images.sp/b10eff7db6b72f17a13be20d92b1fe15.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/fit-in/870x653/vr.images.sp/adc1bc7da66a34ac98a0518e7cd848c4.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/fit-in/870x653/vr.images.sp/c68371c8656ec6e93fae1f6f20c6b86e.jpg' },
                    ],
                    tipo: 'ALGUEL',
                    preco: '649,00',
                    condominio: {
                        valorCondominio: '620,00',
                        valorComCodominio: '1.269,00'
                    },
                    iptu: '2010,00',
                    tipoDeImovel: 'Apartamento',
                    area: '75',
                    quartos: '3',
                    wc: '2',
                    vagaEstacionamento: '1'

                },
                localizacao: {
                    latitude: -8.181549,
                    longitude: -34.919735
                },
                caracteristicas: [
                    { caracteristica: 'Perto de vias de acesso' },
                    { caracteristica: 'Próximo a shopping' },
                    { caracteristica: 'Próximo a transporte público' },
                    { caracteristica: 'Próximo a escola' },
                    { caracteristica: 'Próximo a hospitais' },
                    { caracteristica: 'Churrasqueira' },
                    { caracteristica: 'Elevador' },
                    { caracteristica: 'Jardim' },
                    { caracteristica: 'Salão de festas' },
                    { caracteristica: 'Playground' },
                    { caracteristica: 'Piscina' },
                    { caracteristica: 'Piscina para adulto' },
                    { caracteristica: 'Piscina infantil' },
                    { caracteristica: 'Salão de jogos' },
                    { caracteristica: 'Sauna' },
                    { caracteristica: 'Gerador elétrico' },
                    { caracteristica: 'Segurança 24h' },
                    { caracteristica: 'Interfone' },
                    { caracteristica: 'Condomínio fechado' },
                    { caracteristica: 'Sistema de alarme' },
                    { caracteristica: 'Cabeamento estruturado' },
                    { caracteristica: 'TV a cabo' },
                    { caracteristica: 'Conexão à internet' },
                    { caracteristica: 'Garagem' },
                    { caracteristica: 'Cozinha' },
                    { caracteristica: 'Área de serviço' }
                ]
            },
            {
                dadosDoImovel: {
                    titulo: `Alugo em Piedade , 02 quartos, piscina,`,
                    descricao: `Alugo em Piedade , 02 quartos, piscina, próx curva do Sesc
                    Alugo com todas as taxas inclusas apartamento com 02 quartos sociais,
                    varanda com vista privilegiada, andar alto, sala estar/jantar,
                    cozinha com armário, WC social com box, área de serviço,
                    02 elevadores, porteiro 24 horas.
                    `,
                    imgs: [
                        { img: 'https://resizedimgs.vivareal.com/crop/360x240/vr.images.sp/0a32b0097838181fc81cacd157363102.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/crop/360x240/vr.images.sp/031525e4fbac5cc80b54514129cbf37e.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/crop/360x240/vr.images.sp/4f6b23c87c42ed3b8f7cac65f57a67b5.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/crop/360x240/vr.images.sp/7a53b78fa6f4e743fd70829844752443.jpg' },
                        { img: 'https://resizedimgs.vivareal.com/crop/360x240/vr.images.sp/3f945b3da6d0317fdd5e02b117e5557c.jpg' },
                    ],
                    tipo: 'ALGUEL',
                    preco: 'R$ 1.100 / Mês',
                    condominio: null,
                    iptu: 'Não Informado',
                    tipoDeImovel: 'Apartamento',
                    area: '55',
                    quartos: '2',
                    wc: '2',
                    vagaEstacionamento: '1',
                },
                localizacao: {
                    latitude: -8.1922132,
                    longitude: -34.9191742
                },
                caracteristicas: [
                    { caracteristica: 'Perto de vias de acesso' },
                    { caracteristica: 'Próximo a shopping' },
                    { caracteristica: 'Próximo a transporte público' },
                    { caracteristica: 'Próximo a escola' },
                    { caracteristica: 'Ar-condicionado' },
                    { caracteristica: 'Garagem' },
                    { caracteristica: 'Cozinha' },
                    { caracteristica: 'Área de serviço' },
                    { caracteristica: 'Vista exterior' },
                    { caracteristica: 'Elevador' },
                ]
            }
        ]
    ));

    constructor(
        public dialog: MatDialog,
        private anuncioService: AnuncioService
    ) { }

    ngOnInit() {
        // this.teste2();
        this.minhaGeoLocalizacao();
        this.loadingAllAnuncios();
    }

    loadingAllAnuncios() {
        this.anuncioService.getAllAnuncios().subscribe((imovel) => {
            console.log(imovel);
            this.imoveis = imovel;
        });
    }
    minhaGeoLocalizacao() {
        const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicao => {
                this.minhaPosicao = {
                    zoom: 17,
                    latitude: posicao.coords.latitude,
                    longitude: posicao.coords.longitude,
                    icone: image
                };
            });
        } else {
            this.minhaPosicao = {
                zoom: 15,
                latitude: -8.059009022548944,
                longitude: -34.88249920614351,
                icone: null
            };
        }
    }

    // responsavel para abrir o modal com os dados do imovel
    openDialog(anuncioUid) {

        this.anuncioService.getAnuncioId(anuncioUid).subscribe(imovel => {

            const dialogRef = this.dialog.open(DialogImovelViewComponent, {
                data: imovel
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
            });
        });
    }

    // // procura endereco digitando o texto
    updateOnMap() {
        // this.isLoading = true;
        let full_address: string = this.location.address_level_1 || '';
        if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
        if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
        if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

        this.findLocation(full_address);
    }

    findLocation(address) {
        if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
        this.geocoder.geocode({
            'address': address
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                // tslint:disable-next-line:no-var-keyword
                for (var i = 0; i < results[0].address_components.length; i++) {
                    // tslint:disable-next-line:prefer-const
                    let types = results[0].address_components[i].types;

                    if (types.indexOf('locality') !== -1) {
                        this.location.address_level_2 = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('country') !== -1) {
                        this.location.address_country = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('postal_code') !== -1) {
                        this.location.address_zip = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('administrative_area_level_1') !== -1) {
                        this.location.address_state = results[0].address_components[i].long_name;
                    }
                }

                if (results[0].geometry.location) {
                    // this.enderecoFull = results[0].formatted_address;
                    this.location.lat = results[0].geometry.location.lat();
                    this.location.lng = results[0].geometry.location.lng();
                    this.location.marker.lat = results[0].geometry.location.lat();
                    this.location.marker.lng = results[0].geometry.location.lng();
                    this.location.marker.draggable = true;
                    this.location.viewport = results[0].geometry.viewport;


                    // this.isLoading = false;
                }

                this.map.triggerResize();
            } else {
                // this.snackbarService.snackBarMessage('Sorry, this search produced no results');
            }
        });
    }

}
