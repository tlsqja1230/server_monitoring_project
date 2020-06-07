<template>
  <div id="chart">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'CpuUsageChart',
  props: {
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    series(){
      return [{
        name: '',
        data: this.driveData
      }]
    }
  },
  data() {
    return {
      driveData:[],
      chartOptions: {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['UsedDrive', 'FreeDrive'],
          max: Number(this.$store.state.driveTotal)
        },
        title: {
          text: `Total Capacity ${this.$store.state.driveTotal}GB`,
          align: 'left'
        },
        subtitle: {
          text: 'Capacity Unit: Gigabyte (GB)',
          align: 'left'
        },
      },
      dataWatch: {}, // driveSpace watch객체
      resetInterval: {}, // driveSpace resetInterval객체
    }
  },
  created() {
  },
  mounted() {
    let _self = this
    // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
    _self.dataWatch = _self.$store.watch(_self.$store.getters.getDriveSpace, driveSpace => {
        this.driveData = [driveSpace.usedGb, driveSpace.freeGb]
    })
  },
  beforeDestroy() {
    // watch 제거
    this.dataWatch()
    clearInterval(this.resetInterval);
  },
  methods: {
  },
}
</script>