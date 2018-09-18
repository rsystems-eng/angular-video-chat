var platformInfo = {};
loadPlatformInfo(platformInfo);

function loadPlatformInfo(platformInfo) {
  console.log("platform info called");
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Opera 8.0+
  platformInfo.isOpera = userAgent.indexOf("Opera") != -1 || userAgent.indexOf('OPR') != -1 ;
  // Firefox
  platformInfo.isFirefox = userAgent.indexOf("Firefox") != -1 || userAgent.indexOf('FxiOS') != -1 ;
  // Chrome 1+
  platformInfo.isChrome = userAgent.indexOf("Chrome") != -1 || userAgent.indexOf('CriOS') != -1 ;
  // Safari
  platformInfo.isSafari = !platformInfo.isFirefox && !platformInfo.isChrome && userAgent.indexOf("Safari") != -1;
  // AppleWebKit
  platformInfo.isAppleWebKit = !platformInfo.isSafari && !platformInfo.isFirefox && !platformInfo.isChrome && userAgent.indexOf("AppleWebKit") != -1;
  // Internet Explorer 6-11
  platformInfo.isIE = (userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true );
  // Edge 20+
  platformInfo.isEdge = !platformInfo.isIE && !!window.StyleMedia;
  // Check if Mac
  platformInfo.isMac = navigator.platform.indexOf('Mac') > -1;
  // Check if Windows
  platformInfo.isWin = navigator.platform.indexOf('Win') > -1;
  // Check if Linux
  platformInfo.isLinux = navigator.platform.indexOf('Linux') > -1;
  // Check if iOS
  platformInfo.isiOS = userAgent.indexOf("iPad") != -1 || userAgent.indexOf('iPhone') != -1 ;
  // Check if Android
  platformInfo.isAndroid = userAgent.indexOf("android") > -1;
  // Check if Electron
  platformInfo.isElectron = (typeof process === 'object') && process.versions && (process.versions.electron !== undefined);
  // Check if WebRTC is available
  platformInfo.isWebRTCAvailable = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || (navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : undefined)) ? true : false;
  // Check if 64bit
  platformInfo.is64bit = navigator.userAgent.indexOf('WOW64') > -1 ||  navigator.userAgent.indexOf('Win64') > -1 || window.navigator.platform == 'Win64';	
  console.log("platform info called " +platformInfo.isWebRTCAvailable);
}



function onVidyoClientLoaded (status){
  console.log("i am loaded")
    var event = document.createEvent('Event');
    var elem  = document.getElementById('mainCointainer'); 
    console.log("Status: " + status.state + "Description: " + status.description);
    switch (status.state) {
      case "READY":    // The library is operating normally
      var readyEvent = new CustomEvent("ready", {
        "detail": {"VC" :VC}
      });
    
      document.dispatchEvent(readyEvent);
        console.log("i am ready to connect");
        break;
      case "RETRYING": // The library operating is temporarily paused
        event.initEvent('retrying', true, true);
        // Listen for the event.
        elem.addEventListener('retrying', function (e) {
          // e.target matches elem
        }, false);

        // target can be any Element or other EventTarget.
        elem.dispatchEvent(event);
        console.log("i am retrying it");
        break;
      case "FAILED":   // The library operating has stopped
        // If WebRTC initialization failed, try again up to 3 times.
        event.initEvent('failed', true, true);

        // Listen for the event.
        elem.addEventListener('failed', function (e) {
          // e.target matches elem
        }, false);

        // target can be any Element or other EventTarget.
        elem.dispatchEvent(event);
        console.log("failed to load");
        break;
      case "FAILEDVERSION":   // The library operating has stopped
        break;
      case "NOTAVAILABLE": // The library is not available
        break;
    }
    return true; // Return true to reload the plugins if not available
  }