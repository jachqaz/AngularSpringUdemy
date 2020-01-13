import {Component, OnInit} from '@angular/core';
import {Factura} from "../models/factura";
import {ClienteService} from "../../clientes/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {FormControl, NgForm} from "@angular/forms";
import {flatMap, map} from "rxjs/operators";
import {FacturaService} from "../services/factura.service";
import {Producto} from "../models/producto";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ItemFactura} from "../models/item-factura";
import Swal from "sweetalert2";

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
              private facturaService: FacturaService,
              private router: Router) {
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

  seleccionarProducto(event: MatAutocompleteSelectedEvent) {
    let producto = event.option.value as Producto;
    console.log(producto);
    if (this.existeItem(producto.id)) {
      this.incrementarCantidad(producto.id)
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);

      this.autoCompleteControl.setValue('');
      event.option.focus();
      event.option.deselect();
    }
  }

  actualizarCantidad(id: number, event: any) {
    let cantidad: number = event.target.value as number;
    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad
      }
      return item;
    })
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id: number) {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    })
  }

  eliminarItemFactura(id: number) {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm: NgForm) {
    console.log(this.factura);
    if (this.factura.items.length == 0) {
      this.autoCompleteControl.setErrors({'invalid': true});
    }
    if (facturaForm.form.valid && this.factura.items.length > 0) {
      this.facturaService.create(this.factura).subscribe(factura => {
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito`, 'success');
        this.router.navigate(['/clientes'])
      })
    }
  }
}


