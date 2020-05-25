<template>
    <v-container grid-list-xl fluid>
        <v-layout row wrap class="layout_dashboard">
            <div class="div_top">
                <ChartModal @modalResult="modalResult"></ChartModal>
            </div>
            <div class="ma-1" v-for="(item, index) in chartList" :key="index" :style="{width:$common.isMobile()? '100%' : item.width+'%'}">
                <v-card>
                    <v-toolbar color="transparent" flat dense>
                        <v-toolbar-title>
                            <h4>{{ item.chartName }}</h4>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="deleteChart(index)">삭제</v-btn>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-card-text class="white">
                        <!-- 차트영역 start -->
                        <GaugeChart v-if="item.chartName === 'CPU'" :series="cpuData"></GaugeChart>
                        <ScatterChart v-if="item.chartName === 'XLOG'" :series="xlogData"></ScatterChart>
                        <LineChart v-if="item.chartName === 'TPS'" :series="tpsData"></LineChart>
                        <RealTimeLineChart v-if="item.chartName === 'ERROR RATE'" :stompClient="stompClient" ></RealTimeLineChart>
                        <ScatterChart v-if="item.chartName === 'ACTIVE SERVICE'" :series="activeServiceData"></ScatterChart>
                        <!-- 차트영역 end -->
                    </v-card-text>
                </v-card>
            </div>
        </v-layout>
    </v-container>
</template>

<script>
import ChartModal from '@/components/common/ChartModal.vue'
import GaugeChart from '@/components/common/GaugeChart.vue'
import ScatterChart from '@/components/common/ScatterChart.vue'
import LineChart from '@/components/common/LineChart.vue'
import RealTimeLineChart from '@/components/common/RealTimeLineChart.vue'
export default {
    name: 'Dashboard',
    components: {
        ChartModal,
        GaugeChart,
        ScatterChart,
        LineChart,
        RealTimeLineChart
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    data() {
        return {
            width: 0,
            chartList: [],
            cpuData: [], //cpu데이터
            xlogData: [], //xlog데이터
            tpsData: [], //tps데이터
            errorRateData: [], //errorRate데이터
            activeServiceData: [], //activeService데이터
            //socket
            socket: {}
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
    },
    created() {
        //차트 임시데이터 셋팅 - 추후에는 소켓으로 실시간데이터 받아와야함.
        this.cpuData = [76]
        this.xlogData = [{"name":"TEAM 1","data":[[1486771200000,47],[1486857600000,46],[1486944000000,20],[1487030400000,19],[1487116800000,16],[1487203200000,55],[1487289600000,29],[1487376000000,38],[1487462400000,21],[1487548800000,25],[1487635200000,34],[1487721600000,40],[1487808000000,12],[1487894400000,39],[1487980800000,50],[1488067200000,37],[1488153600000,28],[1488240000000,35],[1488326400000,36],[1488412800000,44]]},{"name":"TEAM 2","data":[[1486771200000,20],[1486857600000,27],[1486944000000,46],[1487030400000,52],[1487116800000,46],[1487203200000,35],[1487289600000,49],[1487376000000,27],[1487462400000,31],[1487548800000,51],[1487635200000,26],[1487721600000,30],[1487808000000,18],[1487894400000,15],[1487980800000,42],[1488067200000,42],[1488153600000,54],[1488240000000,47],[1488326400000,35],[1488412800000,29]]},{"name":"TEAM 3","data":[[1486771200000,50],[1486857600000,44],[1486944000000,23],[1487030400000,32],[1487116800000,43],[1487203200000,12],[1487289600000,20],[1487376000000,32],[1487462400000,60],[1487548800000,38],[1487635200000,52],[1487721600000,49],[1487808000000,51],[1487894400000,20],[1487980800000,41],[1488067200000,38],[1488153600000,16],[1488240000000,56],[1488326400000,18],[1488412800000,48],[1488499200000,35],[1488585600000,45],[1488672000000,15],[1488758400000,23],[1488844800000,32],[1488931200000,25],[1489017600000,17],[1489104000000,21],[1489190400000,42],[1489276800000,41]]},{"name":"TEAM 4","data":[[1486771200000,17],[1486857600000,47],[1486944000000,25],[1487030400000,26],[1487116800000,43],[1487203200000,16],[1487289600000,31],[1487376000000,15],[1487462400000,48],[1487548800000,10]]},{"name":"TEAM 5","data":[[1486771200000,57],[1486857600000,58],[1486944000000,42],[1487030400000,21],[1487116800000,29],[1487203200000,41],[1487289600000,47],[1487376000000,45],[1487462400000,51],[1487548800000,49],[1487635200000,59],[1487721600000,30],[1487808000000,41],[1487894400000,57],[1487980800000,10],[1488067200000,51],[1488153600000,36],[1488240000000,57],[1488326400000,45],[1488412800000,41],[1488499200000,43],[1488585600000,52],[1488672000000,17],[1488758400000,37],[1488844800000,27],[1488931200000,58],[1489017600000,27],[1489104000000,52],[1489190400000,29],[1489276800000,22]]}]
        this.tpsData = [{"name":"South","data":[[1486738800000,39],[1486825200000,30],[1486911600000,10],[1486998000000,25],[1487084400000,33],[1487170800000,30],[1487257200000,38],[1487343600000,11],[1487430000000,25],[1487516400000,59],[1487602800000,44],[1487689200000,36],[1487775600000,32],[1487862000000,13],[1487948400000,12],[1488034800000,33],[1488121200000,43],[1488207600000,36],[1488294000000,53],[1488380400000,17]]},{"name":"North","data":[[1486738800000,14],[1486825200000,18],[1486911600000,13],[1486998000000,11],[1487084400000,14],[1487170800000,14],[1487257200000,10],[1487343600000,15],[1487430000000,12],[1487516400000,16],[1487602800000,19],[1487689200000,14],[1487775600000,16],[1487862000000,12],[1487948400000,10],[1488034800000,14],[1488121200000,19],[1488207600000,15],[1488294000000,10],[1488380400000,13]]},{"name":"Central","data":[[1486738800000,10],[1486825200000,14],[1486911600000,11],[1486998000000,13],[1487084400000,14],[1487170800000,15],[1487257200000,13],[1487343600000,15],[1487430000000,14],[1487516400000,10],[1487602800000,13],[1487689200000,14],[1487775600000,12],[1487862000000,12],[1487948400000,11],[1488034800000,15],[1488121200000,14],[1488207600000,13],[1488294000000,11],[1488380400000,15]]}]
    },
    mounted() {
        this.socketConnect()
    },
    updated() {
    },
    methods: {
        modalResult(result){
            let obj = {
                chartName: result.chartName,
                width: result.width-0.5
            }
            this.chartList.push(obj)
        },
        deleteChart(index){
            this.chartList.splice(index,1);
        },
        socketConnect() {
            //socket연결
            this.socket = this.$io('http://localhost:3001');
            this.socket.emit('cpu',{});
            this.socket.emit('cpuPercentage',{});
            this.socket.emit('whoami',{});
            
            this.socket.on('cpu', function(data){
                console.log('cpu: '+data.cpu)
            });

            this.socket.on('cpuPercentage', function(data){
                console.log('cpuPercentage: '+data.cpuPercentage)
            });

            this.socket.on('whoami', function(data){
                console.log('whoami: '+data.userName)
            });
        },
    },
}
</script>
<style scoped>
.layout_dashboard {
    padding: 20px;
}
.div_top {
    height:85px;
    width:100%;
    text-align: center;
    padding: 20px;
}
</style>