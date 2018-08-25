// Get references to page elements
var $gameText = $("#gameSearch");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submitButton");
var $exampleList = $("#example-list");
var $addButton = $(".addButton");
// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  saveGame: function (game) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/games",
      data: JSON.stringify(game)
    });
  },
  getGames: function(game){
    return $.ajax({
      url: "api/gb/"+game,
      type: "GET"
    })
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault(); 
  $("#gameList").empty();

  let search = $gameText.val().trim();

  if (!(search)) {
    alert("You must enter a game!");
    return;
  }

  API.getGames(search).then(function(result) {
    result.forEach(game => {
      console.log(game);
      $("#gameList").append(`
      <div class="media gameMedia">
                    <img class="mr-3 gamePicture" src="${game.gamePicture}" alt="Generic placeholder image">
                    <div class="media-body">
                      <h5 class="mt-0" id="gameName">${game.gameName}</h5>
                      <p id="gameBio">${game.gameBio}</p>
                      <p><button class="btn btn-outline-danger mt-2 addButton" data-name="${game.gameName}" data-picture="${game.gamePicture}"
                      data-bio='${game.gameBio}' data-giantbombID="${game.giantbombID}" data-gbURL="${game.gbURL}" data-gameConsole="${game.gameConsole}"
                      type="submit">Add</button></p>
                    </div>
                  </div>
      `);
      
    });
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

var handleAddClick = function(){
  console.log($(this));


};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);


$(document).on("click", ".addButton", function() {

  console.log(`
  ${$(this).attr("data-name")}
  ${$(this).attr("data-picture")}
  ${$(this).attr("data-bio")}
  ${$(this).attr("data-giantbombID")}
  ${$(this).attr("data-gbURL")}
  ${$(this).attr("data-gameConsole")}
  
  `);
  let newGame = {
    gameName: $(this).attr("data-name"),
    summary: $(this).attr("data-bio"),
    gamePicture: $(this).attr("data-picture"),
    giantbombID: $(this).attr("data-giantbombID"),
    giantbombURL: $(this).attr("data-gbURL"),
    gameConsole: $(this).attr("data-gameConsole"),
    ownedStatus: "Owned",
    UserId: 1

  };

  API.saveGame(newGame).then(function(){
    alert("Added to DB!");
  });
  
  
});