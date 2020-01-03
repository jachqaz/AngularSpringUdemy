import {Injectable} from '@angular/core';
import {Cliente} from "./cliente";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) {
  }

  // getClientes(): Observable<Cliente[]> {
  //   // return of(CLIENTES)
  //   return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
  //     tap(response => {
  //       let clientes = response as Cliente[];
  //       console.log('ClienteService: tap 1');
  //       clientes.forEach(cliente => {
  //         console.log(cliente)
  //       })
  //     }),
  //     map(response => {
  //       let clientes = response as Cliente[];
  //       return clientes.map(cliente => {
  //         cliente.nombre = cliente.nombre.toUpperCase();
  //         // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy','en-US');
  //         // registerLocaleData(localeEs,'es');
  //         // let datePipe = new DatePipe('en-US');
  //         // let datePipe = new DatePipe('es');
  //         // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
  //         // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');
  //         return cliente
  //       })
  //     }),
  //     tap(response => {
  //       console.log('ClienteService: tap 2');
  //       response.forEach(cliente => {
  //         console.log(cliente)
  //       })
  //     }),
  //   );
  //   // return this.http.get(this.urlEndPoint,{headers: {'Access-Control-Allow-Origin': '*'}}).pipe(
  //   //   map(response => response as Cliente[])
  //   // );
  // }
  getClientes(page: number): Observable<any> {
    // return of(CLIENTES)
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente
        });
        return response
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
    );
    // return this.http.get(this.urlEndPoint,{headers: {'Access-Control-Allow-Origin': '*'}}).pipe(
    //   map(response => response as Cliente[])
    // );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e)
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al crear el cliente', e.error.error, 'error');
        return throwError(e)
      })
    )
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e)
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e)
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.error, 'error');
        return throwError(e)
      })
    )
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar', e.error.error, 'error');
        return throwError(e)
      })
    )
  }
}
