import { Component, OnInit } from '@angular/core';
import { SALARY_DATA } from '../../core/constants/salary-data.constant';
import { CommonModule } from '@angular/common';
import { Salary } from '../../models/salary.model';
import { SalaryService } from '../../services/salary/salary.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css',
  providers: [],
})
export class SalaryComponent implements OnInit {
  salaries: Salary[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  salaryData = SALARY_DATA;
  selectedCity: string = '';
  selectedRangeName: string = '';
  cities: string[] = [];
  ranges: { name: string; label: string }[] = [
    { name: 'under30k', label: '< 30k€' },
    { name: 'between30kAnd40k', label: '30k€ - 40k€' },
    { name: 'between40kAnd50k', label: '40k€ - 50k€' },
    { name: 'between50kAnd70k', label: '50k€ - 70k€' },
    { name: 'between70kAnd100k', label: '70k€ - 100k€' },
    { name: 'over100k', label: '> 100k€' },
  ];
  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.fetchSalaries();
    this.fetchCities();
  }

  fetchSalaries(): void {
    this.loading = true;
    this.errorMessage = '';

    this.salaryService
      .getSalariesWithFilters(this.selectedCity, this.selectedRangeName)
      .subscribe({
        next: (data) => {
          this.salaries = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des salaires.';
          this.loading = false;
          console.error(error);
        },
        complete: () => {
          console.log('Récupération des salaires terminée.');
        },
      });
  }

  fetchCities() {
    this.salaryService.getCities().subscribe((cities) => {
      this.cities = cities;
    });
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.fetchSalaries();
  }

  filterByRange(rangeName: string): void {
    this.selectedRangeName = rangeName;
    this.fetchSalaries();
  }

  sortData(key: string): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    this.salaries.sort((a: any, b: any) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }
}
