import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from "../cliente";
import {ClienteService} from "../cliente.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {HttpEventType} from "@angular/common/http";
import {ModalService} from "./modal.service";
import {AuthService} from "../../usuarios/auth.service";
import {Factura} from "../../facturas/models/factura";
import {FacturaService} from "../../facturas/services/factura.service";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del perfil";
  private fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService,
              private facturaService: FacturaService) {
  }

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   let id: number = +params.get('id');
    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe(cliente => {
    //       this.cliente = cliente;
    //     })
    //   }
    // })
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error seleccionar imagen', `El archivo debe ser de tipo de imagen`, "error");
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload', `Debes seleccionar una foto`, "error")
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100)
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto ha subido completamente', response.mensaje, "success")
        }
      })
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `¿Seguro que deseas eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
            swalWithBootstrapButtons.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminado con exito`,
              'success'
            )
          }
        )
      }
    })
  }
}
