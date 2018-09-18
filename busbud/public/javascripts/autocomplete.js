var originInput = document.getElementById("origin");
var originOptions = document.getElementsByClassName("search__options")[0];

var destinationInput = document.getElementById("destination");
var destinationOptions = document.getElementsByClassName("search__options")[1];

originInput.onclick =function(){
  changeInput(this.value, originOptions);
};
originInput.onkeyup = function(){
  changeInput(this.value, originOptions);
};
originInput.onblur=function(){
  deleteOptions(originOptions);
};


destinationInput.onclick =function(){
  changeInput(this.value, destinationOptions);
};
destinationInput.onkeyup = function(){
  changeInput(this.value, destinationOptions);
};
destinationInput.onblur=function(){
  deleteOptions(destinationOptions);
};


var cityArray = ['New York', 'Montreal'];

function matchCities(input) {
  var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
  return cityArray.filter(function(city) {
    if (city.match(reg)) {
      return city;
    }
  });
}

function changeInput(val, options) {
  var autoCompleteOptions = matchCities(val);
  deleteOptions(options);
  for(var i=0; i<autoCompleteOptions.length; i++){
    var item = autoCompleteOptions[i];
    var elem = document.createElement("li");
    elem.innerHTML=item;
    options.appendChild(elem);
    addEventHover(elem);
  }
}

function deleteOptions(options){
  while( options.firstChild ){
    options.removeChild( options.firstChild );
  }
}

function addEventHover(elem){
  elem.addEventListener("mouseover", function() {
    this.closest(".search__options").previousSibling.value = this.innerHTML;
  });
}
