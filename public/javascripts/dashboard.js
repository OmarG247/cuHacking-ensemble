$(document).ready(() => {
    $.get("/music", (data) => {
        console.log("Result playlist");
        let temp = document.getElementById('allTracks').innerHTML;

        for (let i = 0; i < data[0].length; i++) {
            temp += `<iframe src="https://open.spotify.com/embed/track/${data[0][i].track.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
        }

        document.getElementById('allTracks').innerHTML = temp;

        console.log(data);
    });
});