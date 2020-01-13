import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Factura} from "../models/factura";
import {Producto} from "../models/producto";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndpoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) {
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndpoint}/${id}`)
  }

  delete(id: number): Observable<Factura> {
    return this.http.delete<Factura>(`${this.urlEndpoint}/${id}`)
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-productos/${term}`)
  }

}
