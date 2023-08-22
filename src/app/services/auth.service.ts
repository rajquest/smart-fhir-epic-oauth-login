import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userManager: UserManager;
  private _user: User;
  private _authorizeUrl: string = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2";
  private _patientPortalAppId: string = "aaaaaaaaaa";
  private _providerPortalAppId: string = "xxxxxxxxxx";
  private _loginChangedSubject = new Subject<boolean>();

  loginChanged = this._loginChangedSubject.asObservable();

    constructor() {
      const stsSettings: UserManagerSettings = {
        authority: this._authorizeUrl,
        client_id: this._patientPortalAppId,
        redirect_uri: "https://localhost:4200/",
        scope: "openid",
        response_type: "code"
      };

      this._userManager = new UserManager(stsSettings);
    }

  login(userType: string) {
    console.log("user log in auth service function");

    let appId = "";
    if (userType == "PATIENT") {
      appId = this._patientPortalAppId;
      this.setOAuthSetting(appId);
    }
    else if (userType == "PROVIDER") {
      appId = this._providerPortalAppId;
      this.setOAuthSetting(appId);
    }
    return this._userManager.signinRedirect();
  }

  setOAuthSetting(appId: string) {
    console.log("sts setting for appID :" + appId);

    const stsSettings: UserManagerSettings = {
      authority: this._authorizeUrl,
      client_id: appId,
      redirect_uri: "https://localhost:4200/",
      scope: "openid",
      response_type: "code"
    };

    this._userManager = new UserManager(stsSettings);
  } 

  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then(user => {
      const userCurrent = !!user && !user.expired;
      if (this._user !== user) {
        this._loginChangedSubject.next(userCurrent);
      }
      this._user = user;
      return userCurrent;
    });
  }  
}
