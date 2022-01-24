import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-uploadview',
  templateUrl: './uploadview.component.html',
  styleUrls: ['./uploadview.component.scss']
})
export class UploadviewComponent implements OnInit {
  isLoggedIn:boolean = false;
  loading!:boolean;
  userData:any;
  constructor(
    public afAuth: AngularFireAuth,
    private router:Router,
    private db:AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.afAuth.onAuthStateChanged(user => {
      if(user != null){
        this.getDetailUser(user.uid);
      } else {
        this.isLoggedIn = false;
        this.loading = false;
        this.afAuth.signOut();
        this.router.navigate(['/login']);
      }
    });
  }

  getDetailUser(user:any) {
    this.db.collection('users').doc(user.email).get().subscribe(res => {
      this.userData = res;
      this.isLoggedIn = true;
      this.loading = false;
    }, error => {
      this.isLoggedIn = false;
      this.loading = false;
    })
  }

  logout() {
    localStorage.removeItem('uid');
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

}
