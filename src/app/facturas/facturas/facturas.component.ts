import {Component, OnInit} from '@angular/core';
import {Factura} from "../models/factura";
import {ClienteService} from "../../clientes/cliente.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {flatMap, map} from "rxjs/operators";
import {FacturaService} from "../services/factura.service";
import {Producto} from "../models/producto";

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  autoCompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Tablet', 'Sony'];
  // productosFiltrados: Observable<string[]>;
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        // startWith(''),
        // map(value => this._filter(value))
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //
  //   return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  // }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }
}


