import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { UserAdminService } from '../../../../../../integration/service/userAdminService';
import { MasterService } from '../../../../../../integration/service/masterService';
import { UserAdmin } from "../../../../../../entity/userAdmin";
import { VaccineMaster } from "../../../../../../entity/vaccineMaster";
import { AlertComponent } from "../../../../components/alert/alert.component";
import { LoadingComponent } from "../../../../components/loading/loading.component";

@Component({
  selector: "app-modal-vaccine",
  templateUrl: "./modal-vaccine.component.html",
  styleUrls: ['./modal-vaccine.component.css']
})
export class ModalVaccineComponent implements OnInit {

    @Input() vaccineMaster : VaccineMaster ;
    @Input() lilstOfVaccineMaster : VaccineMaster [] ;
    @Input() command : string ;
    @Input() header  : string ;

    userAdmin: UserAdmin;

    name : string;
    type : string;
    expiredDays : number;
    notes : string;
    selectedBatch : number;

    nameEmpty : boolean;
    typeEmpty : boolean;
    expiredDaysEmpty : boolean;
    selectedBatchEmpty : boolean;

    isDisabled = true;
    isReadOnly : boolean;

    listBatch: any = [
      {batch: 1, value: false},
      {batch: 2, value: false},
      {batch: 3, value: false},
      {batch: 4, value: false},
      {batch: 5, value: false},
      {batch: 6, value: false},
      {batch: 7, value: false},
      {batch: 8, value: false},
      {batch: 9, value: false},
      {batch: 10, value: false},
      {batch: 11, value: false},
      {batch: 12, value: false}
    ];

    message = [];

    ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };

    constructor(private modal: NgbActiveModal,
               private modalService: NgbModal,
               private masterService: MasterService,
               private userAdminService: UserAdminService ) {
      this.userAdmin = this.userAdminService.userAdminValue;
    }

    ngOnInit() {
      this.selectedBatch = 0;
      if (this.command == 'Edit') {
        this.isReadOnly = true;
        this.setData();
      }
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    
    onSearchChange(e){
      this.name = e.target.value; 
      for (const i in this.lilstOfVaccineMaster) {
        if (this.name == this.lilstOfVaccineMaster[i].vaccineName) {
          this.type = this.lilstOfVaccineMaster[i].vaccineType;
          this.expiredDays = this.lilstOfVaccineMaster[i].expDays;
          this.notes = this.lilstOfVaccineMaster[i].notes;
          this.isReadOnly = true;
          for (const y in this.listBatch) {
            for (const x in this.lilstOfVaccineMaster[i].detail) {
              if (this.listBatch[y].batch == this.lilstOfVaccineMaster[i].detail[x].batch){
                this.listBatch[y].value = true;
              }
            }
          }
          break;
        }
      }
    }

    setData(){
      this.name = this.vaccineMaster.vaccineName;
      this.type = this.vaccineMaster.vaccineType;
      this.expiredDays = this.vaccineMaster.expDays;
      this.notes = this.vaccineMaster.notes;
    }

    process(){

      this.nameEmpty = false;
      this.typeEmpty = false;
      this.expiredDaysEmpty = false;
      this.selectedBatchEmpty = false;

      if (this.name == null || this.name == '') {
        this.nameEmpty = true;
      }

      if (this.type == null || this.type == '') {
        this.typeEmpty = true;
      }

      if (this.expiredDays == null ) {
        this.expiredDaysEmpty = true;
      }

      if (this.selectedBatch == null) {
        this.selectedBatchEmpty = true;
      }

      if (this.command == 'Edit') {

        if (this.nameEmpty == false && this.typeEmpty == false  
          && this.expiredDaysEmpty == false && this.selectedBatchEmpty == false) {

            this.modal.close();
            this.modalService.open(LoadingComponent, this.ngbModalOptions);
            let payload = {
              header : {
                uName : this.userAdmin.username,
                session : this.userAdmin.sessionId,
                command : 'update-vaccine',
                channel : 'WEB'
              },
              payload : {
                  vaccineCode : this.vaccineMaster.vaccineCode,
                  vaccineName : this.name,
                  vaccineType : this.type,
                  batch : this.selectedBatch,
                  status : this.vaccineMaster.status,
                  expDays : this.expiredDays,
                  notes : this.notes
              }
            };
            this.masterService.processMstVaccine(JSON.stringify(payload))
            .pipe(first()).subscribe(
              (data) => {
                let header = 'Gagal';
                if (data.header.responseCode == '00') {
                  header = 'Sukses'
                }
                this.modalService.dismissAll(LoadingComponent);
                const modalRef = this.modalService.open(AlertComponent, this.ngbModalOptions);
                modalRef.componentInstance.header = header;
                this.message = [];
                this.message.push(data.header.responseMessage);
                modalRef.componentInstance.wording = this.message;
              },
              (error) => {
                console.log("error : ", error);
              }  
            );

        }

      } else {

        if (this.nameEmpty == false && this.typeEmpty == false  
          && this.expiredDaysEmpty == false && this.selectedBatchEmpty == false ) {

            this.modal.close();
            this.modalService.open(LoadingComponent, this.ngbModalOptions);
            let payload = {
              header : {
                uName: this.userAdmin.username,
                session: this.userAdmin.sessionId,
                command: 'save-vaccine',
                channel : 'WEB'
              },
              payload : {
                vaccineName : this.name,
                vaccineType : this.type,
                batch : this.selectedBatch,
                expDays : this.expiredDays,
                notes : this.notes
              }
            };
            this.masterService.processMstVaccine(JSON.stringify(payload))
            .pipe(first()).subscribe(
              (data) => {
                let header = 'Gagal';
                if (data.header.responseCode == '00') {
                  header = 'Sukses'
                }
                this.modalService.dismissAll(LoadingComponent);
                const modalRef = this.modalService.open(AlertComponent, this.ngbModalOptions);
                modalRef.componentInstance.header = header;
                this.message = [];
                this.message.push(data.header.responseMessage);
                modalRef.componentInstance.wording = this.message;
              },
              (error) => {
                console.log("error : ", error);
              }  
            );
        }

      }

    }

}
