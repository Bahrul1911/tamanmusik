import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
      this.register();
    }
  }

  register() {
    this.loading=true;
    this.afAuth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(res=>{
      this.cekData(res);
    }).catch(error=>{
        this.loading=false;
        alert('Email atau Password salah.')
    });
  }

  match!:boolean;
  checkMatch() {
    this.user.password2 == this.user.password ? this.match = true:this.match = false;
  }

  userData:any;
  cekData(res:any)
  {
    localStorage.setItem('uid',res.user.uid);
    var dt = {
      nama: this.user.nama,
      email: this.user.email,
      role: 'user'
    }
    this.db.collection('users').doc(res.user.email).set(dt).then(res=>{
      alert('Pendaftaran berhasil dilakukan!');
      this.router.navigate(['/login']);
    }).catch(error=>{
      this.error = error;
        var that = this;
        setTimeout(function () {
          that.error = undefined;
          that.loading=false;
        }, 3000);
    });
  }

}
