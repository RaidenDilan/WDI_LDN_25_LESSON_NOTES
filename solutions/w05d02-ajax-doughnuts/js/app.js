// jQuery
$(() => {

  $('form#new-doughnut').on('submit', createDoughnut);
  $('body').on('click', '.delete', removeDoughnut);
  getDoughnuts();
  
});

function createDoughnut(e){
  e.preventDefault();

  // our API uses JSON, so we need to make a javascript object! There are a lot of ways to do this, this just a basic example.
  const doughnut = {
    style: $('select#doughnut-style').val(),
    flavour: $('input#doughnut-flavour').val()
  };

  // create a new AJAX request
  $.post('https://ga-doughnuts.herokuapp.com/doughnuts', doughnut)
    .done((data) => {
      addDoughnut(data);
    });

  // clear our input box!
  $('input#doughnut-flavour').val(null);
}

function getDoughnuts(){
  $.get('https://ga-doughnuts.herokuapp.com/doughnuts')
    .done((data) => {
      $.each(data, (index, doughnut) => {
        addDoughnut(doughnut);
      });
    });
}

function addDoughnut(doughnut) {
  $('ul#doughnuts').prepend(`
    <li>${doughnut.flavour} - <em>${doughnut.style}</em> - <button data-id="${doughnut.id}" class="delete">Delete</button></li>
    `);
}

function removeDoughnut(){
  const id = $(this).data('id');

  $.ajax({
    // grab the id of the doughnut (that we stored in the button data-id attribute) and send it in our request
    url: `https://ga-doughnuts.herokuapp.com/doughnuts/${id}`,
    method: 'DELETE'
  }).done(() => {
    // remove the button's parent (the <li>) from the dom
    $(this).parent().remove();
  });
}
