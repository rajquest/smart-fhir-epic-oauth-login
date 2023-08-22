import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'epic-fhir';
  isLoggedIn = false;

  // Inject FhirService into launch component
  constructor(private _authService: AuthService) {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {

    this._authService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
    
  }

  loginOAuthPatient() {
    console.log("Patient Login button clicked");
    this._authService.login("PATIENT");
  }

  loginOAuthProvider() {
    console.log("Patient Login button clicked");
    this._authService.login("PROVIDER");
  }
}
