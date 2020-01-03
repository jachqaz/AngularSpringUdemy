import {Injectable} from '@angular/core';
import {Cliente} from "./cliente";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  // private headers: {'Access-Control-Allow-Origin': '*'};
  constructor(private http: HttpClient) {
  }

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES)
    return this.http.get<Cliente[]>(this.urlEndPoint);
    // return this.http.get(this.urlEndPoint,{headers: {'Access-Control-Allow-Origin': '*'}}).pipe(
    //   map(response => response as Cliente[])
    // );
  }
}
