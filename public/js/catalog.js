$(document).ready(function() {
  $("#item-profile").on("click", () => {
    let id = this.data();
    $.ajax({
      type: GET,
      url: `/api/games/:${id}`
    }).then(results => {
      console.log(results);
      let name = results.gameName;
      let summary = results.sumary;
      let pic = results.gamePicture;
      let id = results.giantbombID;
      let url = results.giantbombURL;
      let ownership = results.ownedStatus;
      $(".modal-img").attr("src",pic);
      $(".name").text("Name: "+name);
      $(".own").text("Owner Status: " + ownership);
      $(".id").text("Giantbomb ID: " + id);
      $(".url").text("Giantbomb URL: "+url);
      $(".summary").text("Short Game Summary: "+summary);
    });
  });
});
