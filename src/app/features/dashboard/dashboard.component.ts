import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SalaryService } from '../../services/salary/salary.service';
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';
import { Datas, Stats } from '../../models/salary.model';
import { RANGES, YEARS } from '../../core/constants/salaryConstants';

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
  }

  loadSalaryRanges(): void {
    this.salaryService.getSalariesRanges().subscribe((ranges) => {
      this.createChart(ranges, 'rangeChart', RANGES);
    });
  }

  loadSalaryYears(): void {
    this.salaryService.getSalariesYears().subscribe((years) => {
      this.createChart(years, 'yearChart', YEARS);
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
          value: `${data.averageCompensation.toFixed(2)} €`,
          valueColor: 'text-green',
        },
        {
          title: 'Salaire Médian',
          value: `${data.medianCompensation} €`,
          valueColor: 'text-orange',
        },
      ];
    });
  }

  createChart(datas: Stats[], chartName: string, constant: any): void {
    const labels = constant.map((data: any) => data.label);
    const data = datas.map((data) => data.percentage);

    this.chart = new Chart(chartName, {
      type: 'pie',
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
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
              },
            },
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
