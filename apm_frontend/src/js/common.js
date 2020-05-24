export default {
    isMobile : function(){
        var tempUser = navigator.userAgent;
     
        // userAgent 값에 iPhone, iPad, ipot, Android 라는 문자열이 하나라도 존재한다면 모바일로 간주됨.
        if (tempUser.indexOf("iPhone") > 0 || tempUser.indexOf("iPad") > 0
                || tempUser.indexOf("iPot") > 0 || tempUser.indexOf("Android") > 0) {
            return true
        }
        return false;
    }
}
