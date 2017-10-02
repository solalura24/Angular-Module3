(function() {
	'use strict';

angular.module('NarrowItDownApp',[])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (menuSearchService){
	var nidctrl = this;

	nidctrl.searchTerm = "";
	nidctrl.found = [];
	nidctrl.displayFound = false;
	nidctrl.getItems = function (){
		 menuSearchService.getMatchedMenuItems(nidctrl.searchTerm)
		 .then(function(foundItems) {
                nidctrl.found = foundItems;
                if (!nidctrl.displayFound) {
                    nidctrl.displayFound = true;
                }
            });
        };
        nidctrl.removeItem = function(index) {
            nidctrl.found.splice(index, 1);
            if (nidctrl.found.length == 0) {
                    nidctrl.displayFound = false;
            }
        };
	};

MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
            .then(function(response) {
                var items = response.data.menu_items;
                var foundItems = [];

                for (var i = 0; i < items.length; i++) {
                    if (searchTerm !== '' && items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(items[i]);
                    }
                }
                return foundItems;
            });

          }

        };
 
function FoundItemsDirective(){
	var ddo = {
		restrict: "E",
		templateUrl:'foundItems.html',
		scope:{
			found: '<',
			displayfoundItems: '<',
			onRemove: '&'
		},

		controller:FoundItemsDirectiveController,
		controllerAs:'found',
		bindToController: true
	};

	return ddo;
};

function foundItemsDirectiveController() {};

})();