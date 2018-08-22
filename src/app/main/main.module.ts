import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MomentModule} from 'ngx-moment';

import {MainRoutingModule} from "./main.routing";
import {DashboardComponent} from './dashboard/dashboard.component';
import {TestComponent} from './test/test.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {AddressDetailsComponent} from './address/address-details/address-details.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SeasonService} from "./shared/service/season/season.service";
import {AddressDetailsService} from "./address/service/address-details.service";
import {PastoralVisitService} from "./shared/service/pastoral-visit/pastoral-visit.service";
import {PastoralVisitDialog} from "./address/address-details/pastoral-visit-dialog/pastoral-visit-dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatSelectModule} from '@angular/material/select';
import {PriestService} from "./shared/service/priest/priest.service";
import {ExportAddressComponent} from './export-address/export-address.component';
import {ExportAddressService} from "./export-address/service/export-address.service";
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddAddressButtonComponent } from './add-address-button/add-address-button.component';
import { AddAddressComponent } from './address/add-address/add-address.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatChipsModule} from '@angular/material/chips';
import {AddAddressService} from "./address/service/add-address.service";
import { EditAddressComponent } from './address/edit-address/edit-address.component';
import {EditAddressService} from "./address/service/edit-address.service";
import { AddressFormComponent } from './address/address-form/address-form.component';
import {AddressService} from "./address/service/address.service";
import { BulkExportComponent } from './export-address/bulk-export/bulk-export.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { BulkImportComponent } from './bulk-import/bulk-import.component';
import {ImportService} from "./bulk-import/import-service/import-service.service";
import {DragAndDropComponent} from "./bulk-import/drag-and-drop/drag-and-drop.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from "@angular/material";
import { AddressesListComponent } from './addresses-list/addresses-list.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatExpansionModule,
    MomentModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSliderModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  declarations: [
    DashboardComponent,
    TestComponent,
    HomeComponent,
    NavbarComponent,
    AddressDetailsComponent,
    PageNotFoundComponent,
    PastoralVisitDialog,
    ExportAddressComponent,
    AddAddressButtonComponent,
    AddAddressComponent,
    EditAddressComponent,
    AddressFormComponent,
    BulkExportComponent,
    BulkImportComponent,
    DragAndDropComponent,
    AddressesListComponent,
  ],
  entryComponents: [PastoralVisitDialog],
  providers: [AddressDetailsService,
    SeasonService,
    PastoralVisitService,
    PriestService,
    ExportAddressService,
    AddressService,
    AddAddressService,
    EditAddressService,
    ImportService,
  ]
})
export class MainModule { }
