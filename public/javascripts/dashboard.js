$(document).ready(() => {
    $.get("/music", (data) => {
        console.log("Result playlist");
        let temp = document.getElementById('allTracks').innerHTML;

        let size = data.length - 1;

        console.log(size);

        for (let i = 0; i < data[size].length; i++) {
            temp += `<iframe src="https://open.spotify.com/embed/track/${data[size][i].track.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
        }

        document.getElementById('allTracks').innerHTML = temp;

        console.log(data);
    });
});