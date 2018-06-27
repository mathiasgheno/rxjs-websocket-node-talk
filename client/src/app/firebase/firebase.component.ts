import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.css']
})
export class FirebaseComponent implements OnInit {
  public items;
  public autor;
  public likes;
  public tag;

  constructor(private db: AngularFirestore,
              private route: Router) {
    this.items = db.collection('post').valueChanges();
  }

  public buscar() {
    this.items = this.db
      .collection('post', ref => {
        return ref.where('autor', '==', this.autor)
                  // .where('likes', ">", this.likes)
      })
      .valueChanges();
  }

  public voltarParaHome() {
    this.route.navigate(['/']);
  }

  ngOnInit() {
  }

}
