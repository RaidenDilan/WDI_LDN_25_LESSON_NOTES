angular
  .module('flightsApp')
  .service('skyscanner', Skyscanner);

Skyscanner.$inject = ['$http'];
function Skyscanner($http) {
  this.getFlights = function getFlights(destination) {
    return $http
      .get('/api/flights', { params: { destination } })
      .then((response) => {
        console.log(response);
        response.data.Quotes.forEach((quote) => {
          destination = response.data.Places.find((place) => {
            return place.PlaceId === quote.OutboundLeg.DestinationId;
          });

          quote.DestinationCity = destination.CityName;
          quote.DestinationCountry = destination.CountryName;

          carrier = response.data.Carriers.find((carrier) => {
            return carrier.CarrierId === quote.OutboundLeg.CarrierIds[0];
          });

          if(carrier) quote.CarrierName = carrier.Name;
        });
        return response.data.Quotes;
      });
  };
}
