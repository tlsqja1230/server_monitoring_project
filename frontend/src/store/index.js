import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: '',
    cpuUsage: '',
    memoryPer: '',
    memorySpace: '',
    memoryTotal: ''
  },
  // 추적이 가능하도록 처리시점이 예상 가능한 동기작업만 진행.
  mutations: {
    // socket 객체 저장 및 차트데이터 구독 셋팅
    saveSocket(state, socket){
      // socket 객체 저장
      state.socket = socket
      // 차트데이터 구독 셋팅
      state.socket.on('cpuUsage', function(res){
        state.cpuUsage = res.cpuUsage
      });
      state.socket.on('memoryPer', function(res){
        state.memoryPer = res.memoryPer
      });
      state.socket.on('memorySpace', function(res){
        state.memorySpace = res.memorySpace
        state.memoryTotal = res.memorySpace.totalMemMb
      });
    },
  },
  actions: {
    // socket 연결
    connectSocket(context,socket){
      // state에 socket 저장.
      context.commit('saveSocket',socket)
    }
  },
  modules: {
  },
  getters: {
    getCpuUsage: state => () => state.cpuUsage,
    getMemoryPer: state => () => state.memoryPer,
    getMemorySpace: state => () => state.memorySpace
  }
})
