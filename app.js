var mymap = L.map('mapid').setView([38.202489, -122.593117], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
  }).addTo(mymap);
  
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  d3.json(queryUrl, function(data) {

    entries = data.features;
    
	entries.forEach(obj => 
		{
			//console.log(obj["geometry"]["coordinates"][2])
			L.circle([obj["geometry"]["coordinates"][1], obj["geometry"]["coordinates"][0]], (obj["properties"]["mag"] * 15625), {
			color: getColor(obj["geometry"]["coordinates"][2]),
			fillColor: getColor(obj["geometry"]["coordinates"][2]),
			fillOpacity: 0.5
			}).addTo(mymap).bindPopup("Lat: " + obj["geometry"]["coordinates"][1] + ", Long: " + obj["geometry"]["coordinates"][0] + ", Mag: " + obj["properties"]["mag"] + ", Depth: " + obj["geometry"]["coordinates"][2]);
		});

  })

	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(mymap);
	}
	
	function getColor(d) {
		return d > 100 ? '#800026' :
			   d > 50  ? '#BD0026' :
			   d > 20  ? '#E31A1C' :
			   d > 10  ? '#FC4E2A' :
			   d > 5   ? '#FD8D3C' :
			   d > 2   ? '#FEB24C' :
			   d > 1   ? '#FED976' :
						  '#FFEDA0';
	}

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {
	
		function getColor(d) {
			return d > 100 ? '#800026' :
				   d > 50  ? '#BD0026' :
				   d > 20  ? '#E31A1C' :
				   d > 10  ? '#FC4E2A' :
				   d > 5   ? '#FD8D3C' :
				   d > 2   ? '#FEB24C' :
				   d > 1   ? '#FED976' :
							  '#FFEDA0';
		}
	

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1, 2, 5, 10, 20, 50, 100],
			labels = [];
	
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
	
		return div;
	};
	
	legend.addTo(mymap);
		
	mymap.on('click', onMapClick);