// $(document).ready(() => {
//     let link;
//     $("#submit").click(() => {
//       link = $("#user").val();
  
//       console.log("requesting: ", link);
  
//       $.post("http://localhost:3000/playlists", {
//         link: link
//       }, (data) => {
//         console.log("Result playlist");
//         console.log(data);
//       });
//     });
//   });