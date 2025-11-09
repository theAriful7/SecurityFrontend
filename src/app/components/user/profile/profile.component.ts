import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      phone: [''],
      email: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName || '',
          phone: user.phone || '',
          email: user.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Error loading profile';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserProfile(); // Reset form
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      const updatedUser = this.profileForm.value;

      this.userService.updateUser(this.user.id!, updatedUser).subscribe({
        next: (user) => {
          this.user = user;
          this.isEditing = false;
          this.isLoading = false;
          this.message = 'Profile updated successfully!';
        },
        error: (error) => {
          this.message = 'Error updating profile';
          this.isLoading = false;
        }
      });
    }
  }
}
