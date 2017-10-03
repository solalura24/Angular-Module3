(function() {
'use strict'
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
	var ddo = {
		restrict: "E",
		templateUrl:'foundItems.html',
		scope:{
			found: '<',
			empty: '<',
			onRemove: '&'
		}
	};
	return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService){
	var nidctrl = this;

	nidctrl.searchTerm = '';
	nidctrl.empty = '';

	nidctrl.searchItem = function () {

		if (nidctrl.searchTerm !== '') {
			var promise = MenuSearchService.getMatchedMenuItems(nidctrl.searchTerm);
			promise.then(function(result) {
				nidctrl.found = result;
				nidctrl.empty = MenuSearchService.isEmpty();
			})
			.catch(function(error) {
			console.log(error);
			});
		}
		else {
			nidctrl.empty = MenuSearchService.isEmpty();
			console.log(nidctrl.empty);
		};
	};
        
        nidctrl.remove = function(itemIndex) {
           return MenuSearchService.removeItem(itemIndex);
         }
 }	

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http,searchTerm) {
        var service = this;
        var foundItems = [];
        var emptyMessage = 'Nothing Found';

        service.getMatchedMenuItems = function (searchTerm) {

            searchTerm = searchTerm.trim().toLowerCase();
            
            return $http ({
			method: "GET",
			url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
		})
		.then(function(response) {

			for(var i=0; i<response.data.menu_items.length; i++) {
			
				if (response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
					foundItems.push(response.data.menu_items[i]);
				}
				// else{
				// 	service.isEmpty();
				// }
			}
			return foundItems;

		})
		.catch(function(errorResponse) {
			console.log(errorResponse);
		});		
	};

	service.removeItem = function (itemIndex) {
		foundItems.splice(itemIndex, 1);
		return foundItems;
	};

	service.isEmpty = function () {
		console.log(emptyMessage);
		return emptyMessage;
	};
}

})();