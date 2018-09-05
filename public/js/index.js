// Get references to page elements
var $gameText = $("#gameSearch");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submitButton");
var $exampleList = $("#example-list");

var selectedUser = 0;
// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
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
  updateGame: function (game) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "PUT",
      url: "../api/games",
      data: JSON.stringify(game)


    })
  },

  getGames: function (game) {
    return $.ajax({
      url: "api/gb/" + game,
      type: "GET"
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
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
var handleFormSubmit = function (event) {
  event.preventDefault();
  $("#gameList").empty();

  let search = $gameText.val().trim();

  if (!search) {
    alert("You must enter a game!");
    return;
  }

  API.getGames(search).then(function (result) {
    result.forEach(game => {
      console.log(game);
      $("#gameList").append(`
      <div class="media gameMedia">
                    <img class="mr-3 gamePicture" src="${
  game.gamePicture
}" alt="Generic placeholder image">
                    <div class="media-body">
                      <h5 class="mt-0" id="gameName">${game.gameName}</h5>
                      <p id="gameBio">${game.gameBio}</p>
                      <p><button class="btn btn-outline-danger mt-2 addButton" data-name="${
  game.gameName
}" data-picture="${game.gamePicture}"
                      data-bio='${game.gameBio}' data-giantbombID="${
  game.giantbombID
}" data-gbURL="${game.gbURL}" data-gameConsole="${game.gameConsole}"
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
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

$(document).on("click", ".addButton", function () {
  console.log(`
  ${$(this).attr("data-name")}
  ${$(this).attr("data-picture")}
  ${$(this).attr("data-bio")}
  ${$(this).attr("data-giantbombID")}
  ${$(this).attr("data-gbURL")}
  ${$(this).attr("data-gameConsole")}
  ${$("#userSelect")}
  
  `);
  let newGame = {
    gameName: $(this).attr("data-name"),
    summary: $(this).attr("data-bio"),
    gamePicture: $(this).attr("data-picture"),
    giantbombID: $(this).attr("data-giantbombID"),
    giantbombURL: $(this).attr("data-gbURL"),
    gameConsole: $(this).attr("data-gameConsole"),
    ownedStatus: "Owned",
    UserId: selectedUser
  };

  API.saveGame(newGame).then(function () {
    alert("Added to DB!");
  });
});

//plagarismo



$(document).ready(function () {
  $(".editForm").submit(function (event) {
    event.preventDefault();
    let formID = $(this).attr("data-id");
    let putName = $(".nameFor" + formID).val();
    let putStatus = $(".ownFor" + formID).val();
    let putURL = $(".urlFor" + formID).val();
    let putSummary = $(".summary" + formID).val();
    let putConsole = $(".console" + formID).val();
    console.log(`Putting...
    Name: ${putName}
    Status: ${putStatus}
    URL: ${putURL}
    Summary: ${putSummary}
    Console: ${putConsole}
    `);
    let gameUpdate = {
      id: formID,
      gameName: putName,
      giantbombURL: putURL,
      ownedStatus: putStatus,
      gameConsole: putConsole
    };
    API.updateGame(gameUpdate).then(function () {
      alert("Updated in Database!");
    })

  });

  // $(".editSubmit").on("click", function(){
  //   event.preventDefault();
  //   console.log($(this).parent().serialize());
  // })

  $("select").on("change", function () {
    selectedUser = this.value;
  });
  // Getting references to the name input and author container, as well as the table body
  var nameInput = $("#author-name");
  var authorList = $("tbody");
  var authorContainer = $(".author-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an Author
  $(document).on("submit", "#author-form", handleAuthorFormSubmit);
  $(document).on("click", ".delete-author", handleDeleteButtonPress);

  // Getting the initial list of Authors
  getAuthors();

  // A function to handle what happens when the form is submitted to create a new Author
  function handleAuthorFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (
      !nameInput
      .val()
      .trim()
      .trim()
    ) {
      return;
    }
    // Calling the upsertAuthor function and passing in the value of the name input
    upsertAuthor({
      name: nameInput.val().trim()
    });
  }

  // A function for creating an author. Calls getAuthors upon completion
  function upsertAuthor(authorData) {
    $.post("/api/users", authorData).then(getAuthors);
  }

  // Function for creating a new list row for authors
  function createAuthorRow(authorData) {
    var newTr = $("<tr>");
    newTr.data("author", authorData);
    newTr.append("<td class='user-name'>" + authorData.name + "</td>");
    newTr.append(
      "<td class='user-games'> " + authorData.Games.length + "</td>"
    );
    newTr.append(
      "<td><a href='/user/" + authorData.id + "'>Go to Games</a></td>"
    );
    newTr.append(
      "<td><a href='/user/" + authorData.id + "'>Add A Game</a></td>"
    );
    newTr.append(
      "<td><a style='cursor:pointer;color:red' class='delete-author'>Delete User</a></td>"
    );
    return newTr;
  }

  // Function for retrieving authors and getting them ready to be rendered to the page
  function getAuthors() {
    $.get("/api/users", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createAuthorRow(data[i]));
      }
      renderAuthorList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of authors to the page
  function renderAuthorList(rows) {
    authorList
      .children()
      .not(":last")
      .remove();
    authorContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      authorList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no authors
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an Author before you can create a Post.");
    authorContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("author");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/users/" + id
    }).then(getAuthors);
  }
});


$(".dropdown-toggle").dropdown();