import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SalaryService } from '../../services/salary/salary.service';
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';
import { Datas, Stats } from '../../models/salary.model';
import { CITIES, RANGES, YEARS } from '../../core/constants/salaryConstants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public chart: any;
  stats: { title: string; value: string | number; valueColor: string }[] = [];

  constructor(private salaryService: SalaryService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadSalaryRanges();
    this.loadSalaryData();
    this.loadSalaryYears();
    this.loadSalaryCity();
  }

  loadSalaryRanges(): void {
    this.salaryService.getSalariesRanges().subscribe((ranges) => {
      this.createChart(ranges, 'rangeChart', RANGES);
      this.createLineChart(ranges, 'rangeLineChart');
    });
  }

  loadSalaryYears(): void {
    this.salaryService.getSalariesYears().subscribe((years) => {
      this.createChart(years, 'yearChart', YEARS);
    });
  }

  loadSalaryCity(): void {
    this.salaryService.getSalariesCity().subscribe((city) => {
      this.createChart(city, 'cityChart', CITIES);
    });
  }

  loadSalaryData(): void {
    this.salaryService.getSalariesDatas().subscribe((data: Datas) => {
      this.stats = [
        {
          title: 'Total des Salaires',
          value: data.totalSalaries,
          valueColor: 'text-pink',
        },
        {
          title: 'Salaire Moyen',
          value: `${data.averageCompensation} €`,
          valueColor: 'text-green',
        },
        {
          title: 'Salaire Médian',
          value: `${data.medianCompensation} €`,
          valueColor: 'text-orange',
        },
        {
          title: 'Salaire Min',
          value: `${data.lowestSalary} €`,
          valueColor: 'text-blue',
        },
        {
          title: 'Salaire Max',
          value: `${data.highestSalary} €`,
          valueColor: 'text-gray',
        },
      ];
    });
  }

  createChart(datas: Stats[], chartName: string, constant: any): void {
    const labels = constant.map((data: any) => data.label);
    const data = datas.map((data) => data.percentage);
    const averages = datas.map((data) => data.average);
    const count = datas.map((data) => data.count);

    this.chart = new Chart(chartName, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#26547C',
              '#EF476F',
              '#FFD166',
              '#06D6A0',
              '#273444',
              '#8492a6',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              useBorderRadius: true,
              borderRadius: 5,
            },
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItem) {
                return constant[tooltipItem[0].dataIndex].label;
              },
              label: function (tooltipItem) {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex];
                const average = averages[tooltipItem.dataIndex];
                const counts = count[tooltipItem.dataIndex];
                return ` ${counts} - ${value}% (Moyenne: ${average}€)`;
              },
            },
          },
        },
      },
    });
  }

  createLineChart(data: any[], chartName: string): void {
    const labels = data.map((item) => this.formatRangeName(item.name)); // Formattez les noms pour être plus lisibles
    const averageSalaries = data.map((item) => item.average); // Salaire moyen
    const medianSalaries = data.map((item) => item.median); // Salaire médian

    new Chart(chartName, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Salaire Moyen (€)',
            data: averageSalaries,
            borderColor: '#06D6A0',
            backgroundColor: 'rgba(6, 214, 160, 0.2)',
            tension: 0.4, // Ajoute un effet courbe
            fill: true,
          },
          {
            label: 'Salaire Médian (€)',
            data: medianSalaries,
            borderColor: '#FFD166',
            backgroundColor: 'rgba(255, 209, 102, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} €`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tranches de salaire',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Montant (€)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  formatRangeName(name: string): string {
    switch (name) {
      case 'under30k':
        return 'Moins de 30k';
      case 'between30kAnd40k':
        return '30k - 40k';
      case 'between40kAnd50k':
        return '40k - 50k';
      case 'between50kAnd70k':
        return '50k - 70k';
      case 'between70kAnd100k':
        return '70k - 100k';
      case 'over100k':
        return 'Plus de 100k';
      default:
        return name;
    }
  }
}
