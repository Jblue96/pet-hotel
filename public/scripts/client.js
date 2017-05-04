$(document).ready(onReady);

function onReady(){

// add event listeners
$('#register').on('click', registerClient);
$('#addPet').on('click', registerPet);

function registerClient(){
// will run on click and collect data from client input and put into an object
var clientObject = {
  firstName: $('#ownerFirst').val(),
  lastName: $('#ownerLast').val(),
};
console.log('add new client');
$.ajax ({
  url: '/addClient',
  type: 'POST',
  data: clientObject,
  success: function(data){
    console.log('adding client ->' , data);
  }
});
sendClient();
} // end registerClient

// create pet function
function registerPet(){
// will run on click and collect data from client input and put into an object
var petObject = {
  petName: $('#petName').val(),
  petBreed: $('#petBreed').val(),
  petColor: $('#petColor').val()
};
console.log('add new pet');
$.ajax ({
  url: '/addPet',
  type: 'POST',
  data: petObject,
  success: function(data){
    console.log('adding pet ->' , data);
  }
});
addTable();
}

// create sendClient function for dropdown
function sendPet(){
  console.log('send client to dropdown');
  $.ajax({
    url: '/getPets',
    type: 'GET',
    success: function(response){
      console.log('getting clients', response);
      for (var i = 0; i < response.length; i++) {
        $('.savedOwners').append('<option>' + response[i].petname + " " + response[i].color + " " + response[i].color + '</option>');
      }
    }
  });
}

// create sendClient function for dropdown
function sendClient(){
  console.log('send client to dropdown');
  $.ajax({
    url: '/getClients',
    type: 'GET',
    success: function(response){
      console.log('getting clients', response);
      for (var i = 0; i < response.length; i++) {
        $('.savedOwners').append('<option>' + response[i].firstname + " " + response[i].lastname + '</option>');
      }
    }
  });
}

function displayAll(response) {
  $.ajax ({
    url: '/getTable',
    type: 'GET',
    success: function(response){
      console.log('back from server with all table:', response);
      $('.newrow').remove();
      for (var i = 0; i < response.length; i++) {
        $('table').append('<tr class="newrow"></tr>');
        $('.newrow').last().append('<td>'+response[i].firstname + " " + response[i].lastname+'</td><td>'+response[i].petname+'</td><td>'+response[i].breed+'</td><td>'+response[i].color+
        '</td><td><button class="update">Go</button></td><td><button class="delete">Go</button></td><td><select class="checkinout"><option>In</option><option>Out</option></td>');
      }  //end for loop
    }  // end success
  });  //end ajax
}



} // end onReady
