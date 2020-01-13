import {Component, OnInit} from '@angular/core';
import {Cliente} from "../cliente";
import {ClienteService} from "../cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from 'sweetalert2'
import {Region} from "../../region/region";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  private titulo: string = "Crear Cliente";
  private errores: string[];
  private regiones: Region[];

  constructor(private  clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones
    });
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  create(): void {
    console.log("Clicked");
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend ' + err.error.status);
        console.error(err.error.errors)
      }
    )
  }

  update(): void {
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente actualizado', `Cliente ${cliente.nombre} actualizado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend ' + err.error.status);
        console.error(err.error.errors)
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
