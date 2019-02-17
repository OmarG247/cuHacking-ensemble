$(document).ready(() => {
  let link;
  $("#submit").click(() => {
    link = $("#user").val();

    console.log("requesting: ", link);

    $.post("/playlists", {
      link: link
    }, (data) => {
      console.log("Result playlist");
      console.log(data);
    });
  });
});