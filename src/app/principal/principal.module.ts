import { environment } from './../../environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';

import { PrincipalRoutingModule } from './principal-routing.module';
import { ImoveisComponent } from './imoveis/imoveis.component';
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { PlanosComponent } from './planos/planos.component';
import { LoginComponent } from './login/login.component';
import { DialogImovelViewComponent } from './components/dialog-imovel-view/dialog-imovel-view.component';
import { AnunciarComponent } from './anunciar/anunciar.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.ApiKeyGoogleMaps
  }),
    AngularFireModule.initializeApp(environment.firebase),
    PrincipalRoutingModule
  ],
  declarations: [
    ImoveisComponent,
    PlanosComponent,
    LoginComponent,
    DialogImovelViewComponent,
    AnunciarComponent
  ],
  entryComponents: [
    DialogImovelViewComponent
  ]
})
export class PrincipalModule { }
