import {Component, OnInit} from '@angular/core';
import {AuthService} from "../usuarios/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'App angular';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    Swal.fire('Logout', `Hola ${this.authService.usuario.username}, has cerrado sesion`);
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
