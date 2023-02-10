import { Injectable } from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/enviroments/environment';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  cbAddress:EventEmitter<any>=new EventEmitter<any>();
  mapbox=(mapboxgl as typeof mapboxgl)
  map:mapboxgl.Map;
  style="mapbox://styles/mapbox/streets-v12"
  lat=-34.77415133845201
  long=-58.61271275334108
  zoom=3;
  wayPoints:Array<any>=[]
  markerDriver:any=null;


  constructor(private http:HttpClient,private socket:Socket) {
this.mapbox.accessToken=environment.mapPk;
   }

   construirMapa(){
  return new Promise((resolve,reject)=>{
try{
  this.map=new mapboxgl.Map({
    container:"map",
    style:this.style,
    zoom:this.zoom,
    center:[this.long,this.lat],
    
  });
const navigation=new mapboxgl.NavigationControl()
  this.map.addControl(navigation)
 
  const geocoder=new MapboxGeocoder({
    accessToken:mapboxgl.accessToken,
    mapboxgl
  });

    geocoder.on("result",$event=>{
      const {result}=$event;
      geocoder.clear();
      this.cbAddress.emit(result)
    })

  resolve({
    map:this.map,
    geocoder:geocoder
  });
}catch(e){
  reject(e)
}
  });
}
 
      cargarCordenadas(coords){
        const url = [
          `https://api.mapbox.com/directions/v5/mapbox/driving/`,
          `${coords[0][0]},${coords[0][1]};${coords[1][0]},${coords[1][1]}`,
          `?steps=true&geometries=geojson&access_token=${environment.mapPk}`,
        ].join('');
        
          this.http.get(url).subscribe((res:any)=>{
                 const data=res.routes[0];
                 const route=data.geometry.coordinates;


                 this.map.addSource("route",{
                  type:"geojson",
                  data:{
                    type:"Feature",
                    properties:{},
                    geometry:{
                      type:"LineString",
                      coordinates:route
                    }
                  }
                })


                this.map.addLayer( {
                  id:"route",
                  type:"line",
                  source:"route",
                  layout:{
                    "line-join":"round",
                    "line-cap":"round"
                  },
                  paint:{
                    "line-color":"red",
                    "line-width":5
                  }
                 })

                 this.wayPoints=route
                 this.map.fitBounds([route[0],route[route.length-1]],{
                  padding:100
                 })

              this.socket.emit("find-driver", {points:route})

          });     
      }    
        
       agregarMarcador(coords){
       
               const el=document.createElement("div")
               el.className="marker"
               if(!this.markerDriver){
                this.markerDriver=new mapboxgl.Marker(el);

               }else{
                this.markerDriver.setLngLat(coords)
                .addTo(this.map)
               }
               
       }
       

   }

