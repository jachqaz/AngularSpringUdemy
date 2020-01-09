import {Injectable} from '@angular/core';
import {Cliente} from "./cliente";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {Region} from "../region/region";
import {AuthService} from "../usuarios/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e)
        }

        if (e.status == 400) {
          return throwError(e)
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al crear el cliente', e.error.error, 'error');
        return throwError(e)
      })
    )
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
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e)
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e)
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e)
        }
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
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e)
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar', e.error.error, 'error');
        return throwError(e)
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }
    const req = new HttpRequest('Post', `${this.urlEndPoint}/upload/`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      }));
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    )
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.router.navigate(['/login']);
      return true
    }
    return false
  }

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }

}
