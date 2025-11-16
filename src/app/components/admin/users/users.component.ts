import { Component, OnInit } from '@angular/core';
import { User, UserRole } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  searchTerm: string = '';
  selectedRole: string = 'ALL';
  isLoading = false;
  showUserModal = false;

  roles = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'CUSTOMER', label: 'Customers' },
    { value: 'VENDOR', label: 'Vendors' },
    { value: 'ADMIN', label: 'Admins' },
    { value: 'DELIVERY_AGENT', label: 'Delivery Agents' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    // Since we don't have a direct endpoint for all users, we'll load by roles
    Promise.all([
      this.userService.getUsersByRole(UserRole.CUSTOMER).toPromise(),
      this.userService.getUsersByRole(UserRole.VENDOR).toPromise(),
      this.userService.getUsersByRole(UserRole.ADMIN).toPromise(),
      this.userService.getUsersByRole(UserRole.DELIVERY_AGENT).toPromise()
    ]).then(([customers, vendors, admins, deliveryAgents]) => {
      this.users = [
        ...(customers || []),
        ...(vendors || []),
        ...(admins || []),
        ...(deliveryAgents || [])
      ];
      this.applyFilters();
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading users:', error);
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.selectedRole === 'ALL' || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onRoleChange(): void {
    this.applyFilters();
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
      case UserRole.VENDOR: return 'bg-orange-100 text-orange-800';
      case UserRole.DELIVERY_AGENT: return 'bg-blue-100 text-blue-800';
      case UserRole.CUSTOMER: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusBadgeClass(enabled: boolean): string {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}
