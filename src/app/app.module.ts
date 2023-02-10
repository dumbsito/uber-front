import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http"
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketIoConfig,SocketIoModule} from "ngx-socket-io";
import { FooterComponent } from './footer/footer.component'

const config:SocketIoConfig={url:"http://localhost:3000",options:{}}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent
  ],
  imports: [
    HttpClientModule,
    SocketIoModule.forRoot(config),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
