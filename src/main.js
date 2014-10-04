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