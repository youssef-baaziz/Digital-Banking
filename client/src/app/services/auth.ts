import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username!: any;
  accessToken!: any;

  constructor(private http: HttpClient , private router: Router) { }

  public login(username: string, password: string) {
    let options ={
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    }
    let params = new HttpParams().set('username', username)
                                 .set('password', password);
    return this.http.post('http://localhost:8085/auth/login',params,options);
}
        loadProfile(data: any) {
          this.isAuthenticated =true
          this.accessToken= data['access_token'];
          let decodedJwt :any  = jwtDecode(this.accessToken);
          this.username = decodedJwt['sub'];
          this.roles = decodedJwt.scope;
          window.localStorage.setItem('accessToken', this.accessToken);
          window.localStorage.setItem('username', this.username);
          window.localStorage.setItem('roles', JSON.stringify(this.roles));

        }


         logout() {
            this.isAuthenticated = false;
            this.accessToken = undefined;
            this.username = undefined;
            this.roles = undefined;
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('roles');
            this.router.navigate(['/login']);

         }


      loadJwtTokenFromLocalStorage() {
        let token = window.localStorage.getItem('accessToken');
        let username = window.localStorage.getItem('username');
        let roles = window.localStorage.getItem('roles');

        if(token && username && roles){
          this.accessToken = token;
          this.username = username;
          this.roles = JSON.parse(roles);
          this.isAuthenticated = true;
          console.log('JWT token loaded from localStorage:', { token: token.substring(0, 20) + '...', username, roles });
        } else {
          console.log('No JWT token found in localStorage');
          this.isAuthenticated = false;
        }
      }

      checkAuthentication(): boolean {
        if (!this.isAuthenticated || !this.accessToken) {
          console.log('User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }


}
