import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { LaunchGraphComponent } from './components/launch-graph/launch-graph.component';
import { AgencyGraphComponent } from './components/agency-graph/agency-graph.component';
PlotlyModule.plotlyjs = PlotlyJS;

const firebaseConfig = {
  apiKey: "AIzaSyA1lNWITyuPKN3tztwT-pPK0cWCSqcYWs0",
  authDomain: "spacexscroller.firebaseapp.com",
  projectId: "spacexscroller",
  storageBucket: "spacexscroller.appspot.com",
  messagingSenderId: "63631449546",
  appId: "1:63631449546:web:e96922e80b80ef081f8333"
};
import { initializeApp } from "firebase/app";
import { LaunchByAgencyComponent } from './components/launch-by-agency/launch-by-agency.component';
initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LaunchGraphComponent,
    AgencyGraphComponent,
    LaunchByAgencyComponent,
  ],
  imports: [
    BrowserModule,
    PlotlyModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
