import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoggedIn:boolean = false;
  loading!:boolean;
  userData:any;
  allSongs:any = [];

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
      this.getSongs();
      this.isLoggedIn = true;
      this.loading = false;
    }, error => {
      this.isLoggedIn = false;
      this.loading = false;
    })
  }

  getSongs() {
    this.db.collection('songs').valueChanges().subscribe(res => {
      this.allSongs = res;
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
