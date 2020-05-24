<template>
  <div class="lineChart">
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'LineChart',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
        series: {
            type: Array
        }
    },
    data() {
      return {
        chartOptions: {
          xaxis: {
            type: 'datetime',
            categories: ['01/01/2003', '02/01/2003','03/01/2003','04/01/2003','05/01/2003','06/01/2003','07/01/2003','08/01/2003'],
          },
        }
      }
    },
    created() {
    },
    methods: {
    }
}
</script>