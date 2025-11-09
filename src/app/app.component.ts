import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  UserRole = UserRole;
  title = 'EcommerceMultiVendor';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
