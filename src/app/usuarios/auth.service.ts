import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Usuario} from "./usuario";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = '/http://localhost:8080/oauth/token';
    const credenciales = 'angularapp' + ':' + '12345';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-wwww-forn-urlencoded',
      'Authorization': 'Basic' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.username);
    return this.http.post(urlEndpoint, params, {headers: httpHeaders})
  }
}
