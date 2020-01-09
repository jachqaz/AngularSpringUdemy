import {Component, OnInit} from '@angular/core';
import {Usuario} from "../usuario";
import Swal from "sweetalert2";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo: string = 'Por favor Sign In!';

  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacia', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      let payload = JSON.parse(atob(response.access_token.split('.')[1]));
      console.log(payload);

      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${payload.user_name}, has inciado sesion con exito`, 'success')
    })
  }
}
