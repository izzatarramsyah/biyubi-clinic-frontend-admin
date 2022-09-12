import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { AuditTrailService } from '../../../integration/service/auditTrailService';
import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { AuditTrail } from "../../../entity/auditTrail";
import { UserAdmin } from "../../../entity/userAdmin";
import { DatePipe } from '@angular/common';
import { ExportService } from '../../../integration/service/exportService';
import { saveAs } from 'file-saver'
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{
 
  auditTrail : AuditTrail[];
  userAdmin : UserAdmin;
  dtOptions : any;

  startDate : String;
  endDate : String;

  startDateEmpty : boolean;
  endDateEmpty : boolean;

  showTable = false;

  loading = false;

  maxDate : String;

  showComponent = false;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private userAdminService: UserAdminService,
              private auditTrailService : AuditTrailService,
              public datepipe: DatePipe,
              private exportService : ExportService,
              private modalService : NgbModal) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.startDate = null;
    this.endDate = null;
    this.setMaxDate();
  }

  setMaxDate(){
    let today = new Date();
    this.maxDate = this.datepipe.transform(today, "yyyy / MM / dd");
    this.showComponent = true;
  }

  search() {
    this.auditTrail = [];
    this.showTable = false;
    this.loading = true;

    this.startDateEmpty = false;
    this.endDateEmpty = false;

    if (this.startDate == null) {
      this.startDateEmpty = true;
    }
    if (this.endDate == null){
      this.endDateEmpty = true;
    }

    if (this.startDateEmpty == false && this.endDateEmpty == false ) {
      let payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
        },
        payload : {
          startDate : this.startDate,
          endDate : this.endDate,
        }
      };
  
      this.auditTrailService.getListAuditTrail(JSON.stringify(payload))
      .pipe(first()).subscribe(
        (data) => {
          if (data.header.responseCode == '00') {
            this.auditTrail = data.payload.object;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 5,  
              processing: true
            };
            this.showTable = true;
          } 
          this.loading = false;
        },
  
        (error) => {
          console.log("error : ", error);
        }  
      );
    } else {
      this.loading = false;
    }

  }

  ExportTOExcel() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: "list-audit-trail"
      },
      payload: {
        startDate : this.startDate,
        endDate : this.endDate,
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, 'Daftar Data Jejak Aktivitas Admin.xls');
       this.modalService.dismissAll(LoadingComponent);
    });
  }

}
