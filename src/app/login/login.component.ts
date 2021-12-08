import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading:boolean = false;
  user:any = {};
  error:any;
  constructor(
    public afAuth: AngularFireAuth,
    private router:Router,
    private db:AngularFirestore,
  ) { }

  ngOnInit(): void {
  }

  enterLogin(event:any) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.loading=true;
    this.afAuth.signInWithEmailAndPassword(this.user.email, this.user.password).then(res=>{
      this.cekAkses(res);
    }).catch(error=>{
      this.error = error;
        var that = this;
        setTimeout(function () {
          that.error = undefined;
          that.loading=false;
        }, 3000);
    });
  }

  userData:any;
  cekAkses(res:any)
  {
    localStorage.setItem('uid',res.user.uid);
    this.db.collection('users').doc(res.user.email).get().subscribe(res=>{
      if(res.data() != undefined) {
        this.userData = res.data();
        this.cekRoute(this.userData);
        this.loading = false;
      } else this.noaccess();
    })
  }

  cekRoute(userData:any)
  {
    if(userData.deleted == true) {
      this.noaccess();
    } else if(userData.role == 'admin') {
      this.router.navigate(['/admin']);
    } else if(userData.role == 'user') {
      this.router.navigate(['/dashboard']);
    } else {
      this.noaccess();
    }
  }

  noaccess()
  {
    this.loading=false;
    this.afAuth.signOut();
    alert('Anda tidak memiliki hak akses.');
  }

  public type = 'password';
  public showPass = false;
  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
