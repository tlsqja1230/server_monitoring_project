<template>
  <div class="memoryPerChart">
    <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'MemoryPerChart',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
    },
    data() {
      return {
        series: [],
        chartOptions: {
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#e7e7e7",
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  color: '#999',
                  opacity: 1,
                  blur: 2
                }
              },
              dataLabels: {
                name: {
                  show: false
                },
                value: {
                  offsetY: -2,
                  fontSize: '22px'
                }
              }
            }
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              shadeIntensity: 0.4,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 53, 91]
            },
          },
          labels: ['Average Results'],
        },
        dataWatch: {}, // memoryPerChart watch객체
      }
    },
    created() {
    },
    mounted() {
      let _self = this
      // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
      this.dataWatch = _self.$store.watch(_self.$store.getters.getMemoryPer, memoryPer => {
        debugger
        this.series = [memoryPer]
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