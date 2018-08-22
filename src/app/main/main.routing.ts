import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TestComponent} from "./test/test.component";
import {HomeComponent} from "./home/home.component";
import {AddressDetailsComponent} from "./address/address-details/address-details.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AddAddressComponent} from "./address/add-address/add-address.component";
import {EditAddressComponent} from "./address/edit-address/edit-address.component";

const routes: Routes = [
  { path: '',  component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'address/add', component: AddAddressComponent },
      {path: 'address/:id/edit', component: EditAddressComponent },
      {path: 'address/:id', component: AddressDetailsComponent },
      {path: 'test', component: TestComponent},
      {path: '404', component: PageNotFoundComponent},
      {path: '**', redirectTo: '404'}
    ]
  }
];
@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MainRoutingModule {}
