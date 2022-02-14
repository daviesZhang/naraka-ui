import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {





  constructor(private router:Router) { }

  ngOnInit(): void {

  }
  successCall= ()=> {

    this.router.navigateByUrl("/system/menu").then();
  };


}
