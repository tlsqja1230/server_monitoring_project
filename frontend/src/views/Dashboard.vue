<template>
    <v-container grid-list-xl fluid>
        <v-layout row wrap class="layout_dashboard">
            <div class="div_top">
                <ChartModal @modalResult="modalResult" :selectList="chartList"></ChartModal>
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
                        <CpuUsageChart v-if="item.chartName === 'CPU USAGE'" ></CpuUsageChart>
                        <MemoryPerChart v-if="item.chartName === 'USED MEMORY PERCENT'"></MemoryPerChart>
                        <MemorySpaceChart v-if="item.chartName === 'MEMORY SPACE'"></MemorySpaceChart>
                        <DrivePerChart v-if="item.chartName === 'USED DRIVE PERCENT'"></DrivePerChart>
                        <ProcessChart v-if="item.chartName === 'PROCESS COUNT'" ></ProcessChart>
                        <!-- 차트영역 end -->
                    </v-card-text>
                </v-card>
            </div>
        </v-layout>
    </v-container>
</template>

<script>
import ChartModal from '@/components/common/ChartModal.vue'
import CpuUsageChart from '@/components/common/CpuUsageChart.vue'
import MemoryPerChart from '@/components/common/MemoryPerChart.vue'
import MemorySpaceChart from '@/components/common/MemorySpaceChart.vue'
import DrivePerChart from '@/components/common/DrivePerChart.vue'
import ProcessChart from '@/components/common/ProcessChart.vue'
export default {
    name: 'Dashboard',
    components: {
        ChartModal,
        CpuUsageChart,
        MemoryPerChart,
        MemorySpaceChart,
        DrivePerChart,
        ProcessChart
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
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
    },
    created() {
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
            // socket연결
            let socket = this.$io('http://localhost:3001')
            this.$store.dispatch('connectSocket',socket);
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