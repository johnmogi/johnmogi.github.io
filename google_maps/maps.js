function initMap() {
  const locationcoords = { lat: 32.17230483766409, lng: 34.820708391753165 };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: locationcoords,
    zoom: 16,
    disableDefaultUI: true,

    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: true,
    pov: { heading: 165, pitch: 0 },
    motionTracking: false,
  });

  // https://developers.google.com/s/results/maps/documentation/javascript/?q=icons
  const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const newBase =
    "https://maps.googleapis.com/maps/api/directions/place/findplacefromtext/json?input=skog%20haus&inputtype=textquery&fields=name,icon_mask_base_uri,icon_background_color&key=YOUR_API_KEY";
  const icons = {
    info: {
      icon: iconBase + "info-i_maps.png",
    },
    marker: {
      icon: "images/marker.png",
    },
  };
  const locations = [
    {
      //park hertzelia
      position: new google.maps.LatLng(32.17230483766409, 34.820708391753165),
      type: "marker",
    },
  ];

  // Create markers.
  for (let i = 0; i < locations.length; i++) {
    const marker = new google.maps.Marker({
      position: locations[i].position,
      animation: google.maps.Animation.DROP,
      icon: icons[locations[i].type].icon,
      map: map,
    });
  }
}
