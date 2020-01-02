import {Injectable} from '@angular/core';
import {CLIENTES} from "./clientes.json";
import {Cliente} from "./cliente";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() {
  }

  getCLientes(): Observable<Cliente[]> {
    return of(CLIENTES)
  }
}
