import { Component, OnInit } from '@angular/core';
import { Vendor } from 'src/app/models/vendor.model';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  pendingVendors: Vendor[] = [];
  selectedVendor: Vendor | null = null;
  searchTerm: string = '';
  filterStatus: string = 'ALL';
  isLoading = false;
  showVendorModal = false;
  showApproveModal = false;
  vendorToApprove: Vendor | null = null;

  statusFilters = [
    { value: 'ALL', label: 'All Vendors' },
    { value: 'PENDING', label: 'Pending Approval' },
    { value: 'APPROVED', label: 'Approved' }
  ];

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.isLoading = true;
    
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        this.isLoading = false;
      }
    });

    this.vendorService.getPendingVendors().subscribe({
      next: (pending) => {
        this.pendingVendors = pending;
      },
      error: (error) => {
        console.error('Error loading pending vendors:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredVendors = this.vendors.filter(vendor => {
      const matchesSearch = !this.searchTerm || 
        vendor.shopName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vendor.user?.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'ALL' || 
        (this.filterStatus === 'PENDING' && !vendor.approved) ||
        (this.filterStatus === 'APPROVED' && vendor.approved);
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  viewVendorDetails(vendor: Vendor): void {
    this.selectedVendor = vendor;
    this.showVendorModal = true;
  }

  closeVendorModal(): void {
    this.showVendorModal = false;
    this.selectedVendor = null;
  }

  openApproveModal(vendor: Vendor): void {
    this.vendorToApprove = vendor;
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.vendorToApprove = null;
  }

  approveVendor(): void {
    if (!this.vendorToApprove) return;

    this.vendorService.approveVendor(this.vendorToApprove.id).subscribe({
      next: (approvedVendor) => {
        // Update the vendor in the list
        const index = this.vendors.findIndex(v => v.id === approvedVendor.id);
        if (index !== -1) {
          this.vendors[index] = approvedVendor;
        }
        
        // Remove from pending list
        this.pendingVendors = this.pendingVendors.filter(v => v.id !== approvedVendor.id);
        
        this.applyFilters();
        this.closeApproveModal();
      },
      error: (error) => {
        console.error('Error approving vendor:', error);
        alert('Error approving vendor. Please try again.');
      }
    });
  }

  getStatusBadgeClass(vendor: Vendor): string {
    if (!vendor.approved) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return vendor.vendorStatus === 'ACTIVE' ? 
      'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatusText(vendor: Vendor): string {
    if (!vendor.approved) return 'Pending Approval';
    return vendor.vendorStatus === 'ACTIVE' ? 'Active' : 'Inactive';
  }
}
