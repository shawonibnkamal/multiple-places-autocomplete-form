// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

var autocompletes = [];

/**
 * Initializes the autocomplete on the given parent div id
 * @param {} container
 */
function createGeoListeners(container) {
  var options = { types: ["geocode"] };
  var inputs = $("#" + container).find(".autocomplete");

  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  let autocomplete = new google.maps.places.Autocomplete(inputs[0], options);

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(["address_component"]);

  autocomplete.inputId = inputs[0].id;
  autocomplete.parentDiv = container;

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener("place_changed", fillInAddressFields);
  inputs[0].addEventListener(
    "focus",
    function () {
      geoLocate(autocomplete);
    },
    false
  );

  autocompletes.push(autocomplete);
}

function fillInAddressFields() {
  // Get the place details from the autocomplete object.
  var place = this.getPlace();

  for (var component in componentForm) {
    $("#" + this.parentDiv)
      .find("." + component)
      .val("");
    $("#" + this.parentDiv)
      .find("." + component)
      .attr("disabled", false);
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    let addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      let val = place.address_components[i][componentForm[addressType]];
      $("#" + this.parentDiv)
        .find("." + addressType)
        .val(val);
    }
  }
}

/**
 * Bias the autocomplete object to the user's geographical location,
 * as supplied by the browser's 'navigator.geolocation' object.
 */

function geoLocate(autocomplete) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });

      autocomplete.setBounds(circle.getBounds());
    });
  }
}

/**
 * Setups the first input field. It is called after the google script is loaded
 */
function setupFirstAutocomplete() {
  createGeoListeners("locationAutocomplete0");
}

var locationFieldIndex = 1;
function addLocationField() {
  let field =
    `<div id="locationAutocomplete` +
    locationFieldIndex +
    `" class="form-group">
                    <div id="locationField">
                        <input placeholder="Enter your address" name="full_address[]"
                                type="text" class="form-control autocomplete" autocomplete="off"/>
                    </div>
                    <table id="address">
                        <tr>
                            <td class="label">Street address</td>
                            <td class="slimField"><input class="form-control street_number" name="street_number[]" disabled="true"/></td>
                            <td class="wideField" colspan="2"><input class="form-control route" name="route[]" disabled="true"/></td>
                        </tr>
                        <tr>
                            <td class="label">City</td>
                            <td class="wideField" colspan="3"><input class="form-control locality" name="city[]" disabled="true"/></td>
                        </tr>
                        <tr>
                            <td class="label">State</td>
                            <td class="slimField"><input class="form-control administrative_area_level_1" name="state[]" disabled="true"/></td>
                            <td class="label">Zip code</td>
                            <td class="wideField"><input class="form-control postal_code" name="postal_code[]" disabled="true"/></td>
                        </tr>
                        <tr>
                            <td class="label">Country</td>
                            <td class="wideField" colspan="3"><input class="form-control country" name="country[]" disabled="true"/></td>
                        </tr>
                    </table>
                        <a href="#" class="text-danger" onclick="deleteField(event, this)" >Delete</a>
                </div>`;
  $(".locationContainer").append(field);
  createGeoListeners("locationAutocomplete" + locationFieldIndex);
  locationFieldIndex += 1;
}
