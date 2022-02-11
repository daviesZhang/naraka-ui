import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {TokenService} from "@core/services/token.service";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {


  validateForm!: FormGroup;

  @Input()
  successCall: () => void = () =>{};

  constructor(private fb:FormBuilder,
              private tokenService:TokenService,
              private http:HttpClient) {
    this.tokenService.cleanToken();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      principal:[],
      password:[],
    });
  }

  login(){
    this.http.post<HttpResponse<any>>("/token", this.validateForm.value,{ observe: 'response' }).subscribe(response => {
      this.successCall();
    });
  }

}
