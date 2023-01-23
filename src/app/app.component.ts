import { ViewChild } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MapService } from './services/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild("asGeoCoder") asGeoCoder:ElementRef;
   wayPoints:WayPoints={start:null,end:null}
   modeInput="start";
  constructor(private servi:MapService,private rendered2:Renderer2,private socket:Socket){

  }
  ngOnInit(): void {
this.servi.construirMapa()
.then(({geocoder,map})=>{
  this.rendered2.appendChild(this.asGeoCoder.nativeElement,
    geocoder.onAdd(map))
  console.log("todo bien");
}).catch(err=>{
  console.log("todo mal", err);
  
})

   this.servi.cbAddress.subscribe((getPoint)=>{
      
     if(this.modeInput==="start"){
      this.wayPoints.start=getPoint;
     }
     if(this.modeInput==="end"){
      this.wayPoints.end=getPoint;
     }

   })

   this.socket.fromEvent('position')
   .subscribe(({coords}) => {
    
     this.servi.agregarMarcador(coords);
   })
}

 dibujarRuta(){
   const coords=[
    this.wayPoints.start.center,
    this.wayPoints.end.center
   ];

 this.servi.cargarCordenadas(coords);

 }

changeMode(mode:string) {
this.modeInput=mode
}

      testMarker(){
        this.servi.agregarMarcador([-58.43229664613971, -34.58343551763664]);
      } 

}

export class WayPoints{
  start:any;
  end:any;
}
