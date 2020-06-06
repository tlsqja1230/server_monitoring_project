<template>
    <div id="drivePerChart">
      <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'DrivePerChart',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
    },
    data() {
      return {
        series: [this.$store.state.drivePer],
        chartOptions: {
          chart: {
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              }
            },
          },
          labels: ['Used Drive'],
        },
        dataWatch: {}, // memoryPerChart watch객체
      }
    },
    created() {
    },
    mounted() {
      let _self = this
      // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
      this.dataWatch = _self.$store.watch(_self.$store.getters.getDrivePer, drivePer => {
        this.series = [drivePer]
      })
    },
    beforeDestroy() {
      // watch 제거
      this.dataWatch()
    },
    methods: {
    }
}
</script>