import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (private route: Router) {}

  public irParaFirebase() {
    this.route.navigate(['/firebase']);
  }
}
