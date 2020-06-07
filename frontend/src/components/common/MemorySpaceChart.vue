<template>
  <div id="memorySpaceChart">    
    <apexchart type="area" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'MemorySpaceChart',
  props: {
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
      series(){
          return  [{
                name: "Used Memory",
                data: this.memoryData.usedMemory
            },
            {
                name: "Free Memory",
                data: this.memoryData.freeMemory
            }]
      }
  },
  data() {
    return {
        memoryData: {},
        chartOptions: {
          chart: {
            type: 'area',
            height: 350,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: `Total Capacity ${this.$store.state.memoryTotal}MB`,
            align: 'left'
          },
          subtitle: {
            text: 'Capacity Unit: Megabyte (MB)',
            align: 'left'
          },
          labels: '',
          xaxis: {
            type: '',
            range: 10
          },
          yaxis: {
            max: this.$store.state.memoryTotal,
            opposite: true
          },
          legend: {
            horizontalAlign: 'left'
          }
        },
        dataWatch: {}, // memorySpace watch객체
        resetInterval: {}, // memorySpace resetInterval객체
    }
  },
  created() {
    this.memoryData = {
        "usedMemory": [],
        "freeMemory": [],
        "time": []
    }
    var i = 0;
    while (i < 11) {
        var x = 'hh:mm:ss';
        var y = 0;
        this.memoryData.time.push(x)
        this.memoryData.usedMemory.push(y)
        this.memoryData.freeMemory.push(y)
        i++;
    }
    this.chartOptions.labels = this.memoryData.time
  },
  mounted() {
    let _self = this
    // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
    _self.dataWatch = _self.$store.watch(_self.$store.getters.getMemorySpace, memorySpace => {
        _self.getNewSeries({
            usedMemMb: memorySpace.usedMemMb,
            freeMemMb: memorySpace.freeMemMb,
            time: memorySpace.time
        } )
    })
  
    // 5분마다 데이터 리셋
    _self.resetInterval = setInterval(function () {
        _self.resetData()
    }, 300000)
  },
  beforeDestroy() {
    // watch 제거
    this.dataWatch()
    clearInterval(this.resetInterval);
  },
  methods: {
    getNewSeries(data) {
        this.memoryData.time.push(data.time)
        this.memoryData.usedMemory.push(data.usedMemMb)
        this.memoryData.freeMemory.push(data.freeMemMb)
    },
    resetData(){
        for(let key in this.memoryData){
            key = key.slice(key.length - 20, key.length);
        }
    }
  },
}
</script>