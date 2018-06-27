import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

import {MatIconModule} from '@angular/material/icon';

const everything = [
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatInputModule
];

@NgModule({
  imports: everything,
  exports: everything
})
export class MaterialModule {}
