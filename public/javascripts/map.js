var binList = window.binList;
console.log(binList[0].Borough);
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 11,
    	center: new google.maps.LatLng(2.8,-187.3),
    	mapTypeId: 'terrain'
    });
	//Save global reference to map
	window.map_object = map;

	var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    //Populate map with bin data
	for (var i in binList) {
		var latLng = new google.maps.LatLng(binList[i].Latitude,binList[i].Longitude);
		var marker = new google.maps.Marker({
			position: latLng,
			map: map
		});
	}
	var infoWindow = new google.maps.InfoWindow({map: map});
	//Try to find the user's position and center the map
	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(function(position) {
  			var lat = position.coords.latitude;
  			var lon = position.coords.longitude;

            var pos = {
              	lat: lat,
              	lng: lon
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('This is you (roughly).');
            setMapCenter(lat, lon);
      	}, function() {
        	handleLocationError(true, infoWindow, map.getCenter());
      	});
	} else {
  		// Browser doesn't support Geolocation
  		handleLocationError(false, infoWindow, map.getCenter());
	}
  
	}

	function setMapCenter(lat, lng, zoom){
		var pos = {
      	lat: lat,
      	lng: lng
    };
    window.map_object.setCenter(pos);
    window.map_object.setZoom(zoom ? zoom : 11); //default to 11
	}
