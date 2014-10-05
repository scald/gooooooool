// // ------------------------------
// //  Start of Strap API
// // ------------------------------
// var strap_api_num_samples=10;var strap_api_url="https://api.straphq.com/create/visit/with/";var strap_api_timer_send=null;var strap_api_const={};strap_api_const.KEY_OFFSET=48e3;strap_api_const.T_TIME_BASE=1e3;strap_api_const.T_TS=1;strap_api_const.T_X=2;strap_api_const.T_Y=3;strap_api_const.T_Z=4;strap_api_const.T_DID_VIBRATE=5;strap_api_const.T_ACTIVITY=2e3;strap_api_const.T_LOG=3e3;var strap_api_can_handle_msg=function(data){var sac=strap_api_const;if((sac.KEY_OFFSET+sac.T_ACTIVITY).toString()in data){return true}if((sac.KEY_OFFSET+sac.T_LOG).toString()in data){return true}return false};var strap_api_clone=function(obj){if(null==obj||"object"!=typeof obj)return obj;var copy={};for(var attr in obj){if(obj.hasOwnProperty(attr))copy[attr]=obj[attr]}return copy};var strap_api_log=function(data,min_readings,log_params){var sac=strap_api_const;var lp=log_params;if(!((sac.KEY_OFFSET+sac.T_LOG).toString()in data)){var convData=strap_api_convAcclData(data);var tmpstore=window.localStorage["strap_accl"];if(tmpstore){tmpstore=JSON.parse(tmpstore)}else{tmpstore=[]}tmpstore=tmpstore.concat(convData);if(tmpstore.length>min_readings){window.localStorage.removeItem("strap_accl");var req=new XMLHttpRequest;req.open("POST",strap_api_url,true);var tz_offset=(new Date).getTimezoneOffset()/60*-1;var query="app_id="+lp["app_id"]+"&resolution="+(lp["resolution"]||"")+"&useragent="+(lp["useragent"]||"")+"&action_url="+"STRAP_API_ACCL"+"&visitor_id="+(lp["visitor_id"]||Pebble.getAccountToken())+"&visitor_timeoffset="+tz_offset+"&accl="+encodeURIComponent(JSON.stringify(tmpstore))+"&act="+(tmpstore.length>0?tmpstore[0].act:"UNKNOWN");req.setRequestHeader("Content-type","application/x-www-form-urlencoded");req.setRequestHeader("Content-length",query.length);req.setRequestHeader("Connection","close");req.onload=function(e){if(req.readyState==4&&req.status==200){if(req.status==200){}else{}}};req.send(query)}else{window.localStorage["strap_accl"]=JSON.stringify(tmpstore)}}else{var req=new XMLHttpRequest;req.open("POST",strap_api_url,true);var tz_offset=(new Date).getTimezoneOffset()/60*-1;var query="app_id="+lp["app_id"]+"&resolution="+(lp["resolution"]||"")+"&useragent="+(lp["useragent"]||"")+"&action_url="+data[(sac.KEY_OFFSET+sac.T_LOG).toString()]+"&visitor_id="+(lp["visitor_id"]||Pebble.getAccountToken())+"&visitor_timeoffset="+tz_offset;req.setRequestHeader("Content-type","application/x-www-form-urlencoded");req.setRequestHeader("Content-length",query.length);req.setRequestHeader("Connection","close");req.onload=function(e){if(req.readyState==4&&req.status==200){if(req.status==200){}else{}}};req.send(query)}};var strap_api_convAcclData=function(data){var sac=strap_api_const;var convData=[];var time_base=parseInt(data[(sac.KEY_OFFSET+sac.T_TIME_BASE).toString()]);for(var i=0;i<strap_api_num_samples;i++){var point=sac.KEY_OFFSET+10*i;var ad={};var key=(point+sac.T_TS).toString();ad.ts=data[key]+time_base;key=(point+sac.T_X).toString();ad.x=data[key];key=(point+sac.T_Y).toString();ad.y=data[key];key=(point+sac.T_Z).toString();ad.z=data[key];key=(point+sac.T_DID_VIBRATE).toString();ad.vib=data[key]=="1"?true:false;ad.act=data[(sac.KEY_OFFSET+sac.T_ACTIVITY).toString()];convData.push(ad)}return convData};

// // ------------------------------
// //  End of Strap API
// // ------------------------------

var SHOW_LOGS = true;
var ACCESS_TOKEN = 'fb1a3ec784cdc6c0ad71a27bed03f84d09b83624';
var DEVICE_ID = '53ff6c066667574830391267';

/******************************** Web *****************************************/

var importjQuery = function() {
  var script = document.createElement('script');
  script.src = 'http://code.jquery.com/jquery-latest.min.js';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
};

/**************************** Pebble helpers **********************************/

var hasKey = function(dict, key) {
  return typeof dict.payload[key] !== 'undefined';
};

/************************************ Other ***********************************/

function log(message) {
  if(SHOW_LOGS) console.log(message);
}

/********************************** AppMessage ********************************/

/**
 * functionName: Name of Spark.function() exposed in spark_src/main.ino
 */
var spark = function(functionName) {
  // Construct URL
  var url = 'https://api.spark.io/v1/devices/' + DEVICE_ID + '/CMD?access_token=' + ACCESS_TOKEN;
  log(url);

  // Make request (XHR does not appear to work with Spark Cloud)
  $.ajax({
    type: 'POST',
    url: url,
    data: {'args':functionName},
    success: function(data) {
		log('spark() successful: ' + JSON.stringify(data));
		Pebble.sendAppMessage({
			"pulse":1
		});
    },
    error: function(e) {
		log('Failed: ' + JSON.stringify(e));
		Pebble.sendAppMessage({
			"pulse":0
		});
    },
    dataType: 'json'
  });
};

/*********************************** Spark ************************************/

Pebble.addEventListener('ready', 
  function(e) {
    importjQuery();
    log('PebbleKit JS ready!');
  }
);

Pebble.addEventListener('appmessage',
	function(e){

		// // Strap API: Developer updates these parameters to fit
  //         var strap_params = {
  //             // *** change the app id! *** //
  //             app_id: "qjMB8HpLbcWNhQCpx",
  //             resolution: "144x168",
  //             useragent: "PEBBLE/2.0"
  //         };

  //         // -------------------------
  //         //  Strap API inclusion in appmessage
  //         //  This allows Strap to process Strap-related messages
  //         //  DO NOT EDIT
  //         // -------------------------
  //         if(strap_api_can_handle_msg(e.payload)) {
  //             clearTimeout(strap_api_timer_send);
  //             var params = strap_api_clone(strap_params);
  //             strap_api_log(e.payload, 200, params);
  //             strap_api_timer_send = setTimeout(function() {
  //                 strap_api_log({}, 0, params);
  //             }, 10 * 1000);
  //         }
  //         // -------------------------



		console.log("Got data" + e.payload.message_type);
		switch (e.payload.message_type) {
		case 0:
			spark('UP_INIT');
			break;
		case 1:
			spark('UP_DEINIT');
			break;
		case 2:
			spark('RIGHT_INIT');
			break;
		case 3:
			spark('RIGHT_DEINIT');
			break;
		case 4:
			spark('DOWN_INIT');
			break;
		case 5:
			spark('DOWN_DEINIT');
			break;
		case 6:
			spark('LEFT_INIT');
			break;
		case 7:
			spark('LEFT_DEINIT');
			break;
		case 8:
			spark('SHAKE');
			break;
		}
	}
); 