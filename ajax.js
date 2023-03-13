let token = localStorage.getItem('token');
let expiryDate = new Date(new Date().getTime() + 1000 * 60 * 60);

$('#searchBtn').click(function() {
    const zipCode = $('#s').val();
    const org = 'vet, shelter';
    getDogs(zipCode, '5');
    getVetShelters(zipCode);
    //getRestaurant(zipCode);
});


if (localStorage.getItem('token') && new Date(localStorage.getItem('expiryDate')) > new Date()) {
    token = localStorage.getItem('token');
  } else {
    $.ajax({
      url: 'https://api.petfinder.com/v2/oauth2/token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: 'vO3ybpsfJI6gi3UQ4bPmLW91dFsM8zOh5TsgnjjRQY0sTkMggW',
        client_secret: 'bx9RsyfRlesCpNa5SnRXTox2w2NvWSOSYy8MWGVf',
      },
      success: function(response) {
        console.log(response);
        token = response.access_token;
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('expiryDate', expiryDate);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

function getDogs(zipCode, limit) {
        $.ajax({
        url: 'https://api.petfinder.com/v2/animals?type=dog&status=adoptable&has_photo=1',
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            'type': 'dog',
            'location': zipCode,
            'limit': '5',
            'fields': 'name,age,gender,breeds,photos'
        }
    })
    .done(function(data) {
        console.log(data);
        const dogContainer = $('#additionalDogEl');
        data.animals.forEach(dog => {
            const card = $('<div></div>').addClass('card');
            const name = $('<h2></h2>').text(dog.name);
            const age = $('<p></p>').text(`Age: ${dog.age}`);
            const gender = $('<p></p>').text(`Gender: ${dog.gender}`);
            const breed = $('<p></p>').text(`Breed: ${dog.breeds.primary}`);
            const link = $('<a></a>').attr('href', dog.url).text('Adopt Me!');
            const photo = $('<img>').attr('src', dog.photos[0].medium);
            card.append(name, age, gender, breed, link, photo);
            dogContainer.append(card);
        });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(`AJAX request failed: ${textStatus}, ${errorThrown}`);
    });
    
    }

    function getVetShelters (zipCode) {
        const dogOfficesURL = `https://api.petfinder.com/v2/organizations?type=vet,shelter&location=${zipCode}&has_phone=true&has_website=true&limit=5`;

        $.ajax({
            url: dogOfficesURL,
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                const orgContainer = $('#vetEl');
        
                $.each(data.organizations, function(location, org) {
                    const card = $('<div>').addClass('card');
                    const name = $('<h2>').text(org.name);
                    const address = $('<p>').text(`Address: ${org.address.address1}, ${org.address.city}, ${org.address.state}, ${org.address.postcode}`);
                    const phone = $('<p>').text(`Phone: ${org.phone}`);
                    const website = $('<a>').attr('href', org.website).text(org.website);
        
                    card.append(name, address, phone, website);
                    // card.append(address);
                    // card.append(phone);
                    // card.append(website);
        
                    orgContainer.append(card);
                });
            },
            error: function(error) {
                console.error(error);
            }
        });
    }

        //yelp api

        // function getRestaurant(zipCode) {
        //     var searchUrl = 'https://api.yelp.com/v3/businesses/search?term=dog+friendly&location=' + zipCode + '&limit=5';
        //     $.ajax({
        //       url: searchUrl,
        //       headers: {
        //         'Authorization': 'Bearer V6Oo4GKHu2XFdHcHwlkim9pyL6uVs2rQIMVF5x6oqS-Ng_yetXyLZyRS2eGcwIncN0SQbKbl6rvKMxtwy8Hfm5AVSR6ftj7MAO4PNEANLhHmNN5RoZHWdf87tccGZHYx'
        //       },
        //       method: 'GET',
        //       dataType: 'json',
        //       success: function(response) {
        //         var businesses = response.businesses;
        //         var $searchResults = $('#search-results');
        //         $searchResults.empty();
        //         $.each(businesses, function(i, business) {
        //           const card = $('<div>').addClass('card');
        //           const cardBody = $('<div>').addClass('card-body');
        //           const name = $('<h2>').text(business.name);
        //           const address = $('<p>').text(business.location.address1 + ', ' + business.location.city + ', ' + business.location.state + ' ' + business.location.zip_code);
        //           const rating = $('<p>').text('Rating: ' + business.rating);
                  
        //           cardBody.append(name, address, rating,);
        //           card.append(cardBody);
        //           searchResults.append(card);
        //         });
        //       },
        //       error: function(xhr, status, error) {
        //         console.log('Error: ' + xhr.responseText);
        //       }
        //     });
        //   }