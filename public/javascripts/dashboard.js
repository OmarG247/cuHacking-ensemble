$(document).ready(() => {
    let link;
    $("#submit").click(() => {
      link = $("#user").val();
  
      console.log("requesting: ", link);
  
      $.get("/music", (data) => {
        console.log("Result playlist");
        console.log(data);
      });
    });
  });