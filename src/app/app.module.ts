import { PrincipalModule } from './principal/principal.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { PrincipalComponent } from './principal/principal.component';


@NgModule({
    declarations: [
        AppComponent,
        PrincipalComponent
    ],
    imports: [
        CoreModule,
        SharedModule,
        AppRoutingModule,
        PrincipalModule

    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
