import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Salary, Score } from '../../core/models/salary.model';
import { SalaryService } from '../../core/services/salary.service';
import { FormsModule } from '@angular/forms';
import { RANGES, YEARS } from '../../core/constants/salaryConstants';
import { ToastService } from '../../core/services/toast.service';

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
  score: Score[] = [];
  selectedCity: string = '';
  selectedRangeName: string = '';
  selectedYear: string = '';
  cities: string[] = [];
  ranges: { name: string; label: string }[] = RANGES;
  year: { name: string; label: string }[] = YEARS;
  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private salaryService: SalaryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchSalaries();
    this.fetchScore();
    this.fetchCities();
  }

  fetchSalaries(): void {
    this.loading = true;
    this.errorMessage = '';

    this.salaryService
      .getSalariesWithFilters(
        this.selectedCity,
        this.selectedRangeName,
        this.selectedYear
      )
      .subscribe({
        next: (data) => {
          this.salaries = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = '❌ Erreur lors de la récupération des salaires.';
          this.loading = false;
          this.toastService.error(this.errorMessage);
          console.error(error);
        },
      });
  }

  fetchCities(): void {
    this.loading = true;
    this.salaryService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = '❌ Erreur lors de la récupération des villes.';
        this.loading = false;
        this.toastService.error(this.errorMessage);
        console.error(error);
      },
    });
  }

  fetchScore(): void {
    this.loading = true;
    this.salaryService.getScore().subscribe({
      next: (data) => {
        this.score = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = '❌ Erreur lors de la récupération des scores.';
        this.loading = false;
        this.toastService.error(this.errorMessage);
        console.error(error);
      },
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

  filterByYear(year: string): void {
    this.selectedYear = year;
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

  getScoreById(itemId: string): string | number {
    const scoreEntry = this.score.find((score) => score.id === itemId);
    return scoreEntry?.score || 'N/A';
  }

  clearCityFilter(): void {
    this.selectedCity = '';
    this.fetchSalaries();
  }

  clearRangeFilter(): void {
    this.selectedRangeName = '';
    this.fetchSalaries();
  }

  clearYearFilter(): void {
    this.selectedYear = '';
    this.fetchSalaries();
  }
}
