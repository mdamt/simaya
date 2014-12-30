$(document).ready(function() {
  $("#category-input").change(function(){
    $('input[name="profile[id]"][nip-check="true"]').keydown(function(event) {
      // Allow: backspace, delete, tab, escape, and enter
      if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) || 
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        } else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
          event.preventDefault(); 
        }   
      }
    });
    var idLength = parseInt($("option[data-id]:selected").attr("data-length"));
    $('input[name="profile[id]"][nip-check="true"]').keyup(function(event) {
      if ( event.which == 13 ) {
        event.preventDefault();
      }
      var counter = $('input[name="profile[id]"][nip-check="true"]').val().length;
      console.log(counter);
      if (counter == idLength) {
        $('#nip-control').removeClass('error');
        $('#nip-help-inline').html('');
      } else if (counter > idLength || counter < idLength) {
        $('#nip-control').addClass('error');
        $('#nip-help-inline').html('Nomor identitas harus '+idLength+' angka');
      }
    });
    $('input[name="profile[id]"][nip-check="false"]').keyup(function(event) {
      if ( event.which == 13 ) {
        event.preventDefault();
      }
      var counter = $('input[name="profile[id]"][nip-check="false"]').val().length;
      console.log(counter);
      if (counter == idLength) {
        $('#id-control').removeClass('error');
        $('#id-help-inline').html('');
      } else if (counter > idLength || counter < idLength) {
        $('#id-control').addClass('error');
        $('#id-help-inline').html('Nomor identitas harus '+idLength+' angka');
      }
    });
  });
});
