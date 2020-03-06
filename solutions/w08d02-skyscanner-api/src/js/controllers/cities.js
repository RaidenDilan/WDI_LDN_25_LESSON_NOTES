angular
  .module('flightsApp')
  .controller('CitiesIndexCtrl', CitiesIndexCtrl)
  .controller('CitiesNewCtrl', CitiesNewCtrl)
  .controller('CitiesShowCtrl', CitiesShowCtrl);

CitiesIndexCtrl.$inject = ['City', 'skyscanner'];
function CitiesIndexCtrl(City, skyscanner) {
  const vm = this;

  vm.all = City.query();
  vm.flights = [];

  skyscanner.getFlights('anywhere')
    .then((quotes) => {
      console.log(quotes);
      vm.flights = quotes;
    });
}

CitiesNewCtrl.$inject = ['City', '$state'];
function CitiesNewCtrl(City, $state) {
  const vm = this;
  vm.city = {};

  function citiesCreate() {
    City
      .save(vm.city)
      .$promise
      .then(() => $state.go('citiesIndex'));
  }

  vm.create = citiesCreate;
}

CitiesShowCtrl.$inject = ['City', '$stateParams', '$state', 'skyscanner'];
function CitiesShowCtrl(City, $stateParams, $state, skyscanner) {
  const vm = this;

  City.get($stateParams, (city) => {
    vm.city = city;
    getFlights();
  });

  vm.flights = [];

  function getFlights() {

    skyscanner.getFlights(vm.city.airport)
      .then((quotes) => {
        console.log(quotes);
        vm.flights = quotes;
      });
  }

  function citiesDelete() {
    vm.city
      .$remove()
      .then(() => $state.go('citiesIndex'));
  }

  vm.delete = citiesDelete;
}

// CitiesIndexCtrl.$inject = ['City', '$http'];
// function CitiesIndexCtrl(City, $http) {
//   const vm = this;
//
//   vm.all = City.query();
//   vm.flights = [];
//
//   $http
//     .get('/api/flights', { params: { originplace: 'LON', destinationplace: 'anywhere' }})
//     .then((response) => {
//       console.log(response.data);
//
//       response.data.Quotes.forEach((quote) => {
//         const destination = response.data.Places.find((place) => {
//           return place.PlaceId === quote.OutboundLeg.DestinationId;
//         });
//
//         quote.DestinationCity = destination.CityName;
//         quote.DestinationCountry = destination.CountryName;
//
//         const carrier = response.data.Carriers.find((carrier) => {
//           return carrier.CarrierId === quote.OutboundLeg.CarrierIds[0];
//         });
//
//         quote.CarrierName = carrier.Name;
//       });
//
//       vm.flights = response.data.Quotes;
//     });
// }

// CitiesShowCtrl.$inject = ['City', '$stateParams', '$state', '$http'];
// function CitiesShowCtrl(City, $stateParams, $state, $http) {
//   const vm = this;
//
//   City.get($stateParams, (city) => {
//     vm.city = city;
//     getFlights();
//   });
//
//   vm.flights = [];
//
//   function getFlights() {
//     $http
//       .get('/api/flights', { params: { origin: 'LON', destination: vm.city.airport }})
//       .then((response) => {
//         console.log(response.data);
//
//         response.data.Quotes.forEach((quote) => {
//           const destination = response.data.Places.find((place) => {
//             return place.PlaceId === quote.OutboundLeg.DestinationId;
//           });
//
//           quote.DestinationCity = destination.CityName;
//           quote.DestinationCountry = destination.CountryName;
//
//           const carrier = response.data.Carriers.find((carrier) => {
//             return carrier.CarrierId === quote.OutboundLeg.CarrierIds[0];
//           });
//
//           quote.CarrierName = carrier.Name;
//           quote.OutboundLeg.DepartureDate = new Date(quote.OutboundLeg.DepartureDate);
//         });
//
//         vm.flights = response.data.Quotes;
//       });
//   }
//
//   function citiesDelete() {
//     vm.city
//       .$remove()
//       .then(() => $state.go('citiesIndex'));
//   }
//
//   vm.delete = citiesDelete;
// }
