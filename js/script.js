const url = "https://localhost:7204/Movie"
const url1 = "https://localhost:5001/Movie"
const url2 = "http://88.200.103.129:81/Movie"
let state = false;

//ob nalaganju okna
$(document).ready(() => {
    getAllMovies();

    //submit obrazca
    $("#movie-add-form").submit((event) => {
        var val = $("input[type=submit][clicked=true]").val();
        event.preventDefault();
        let data = { id: $("#movie-list tr").length };
        $.map($("#movie-add-form").serializeArray(), function (n, i) {
            data[n['name']] = n['value'];
        });

        //glede na to kateri gumb je pritisnjen, val je vrednost input polja submit
        if (val === "localy") {
            appendData(data);
            sendMessage("Uspešno dodajanje filma na strani odjemalca", "alert alert-success")
        } else if (val == "server")
            addMovie(data);
    })

    //pridobi tisti submit gumb, ki je bil pritisnjen
    $("form input[type=submit]").click(function () {
        //odstrani clicked vsem
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        //pritisnjenemu doda clicked
        $(this).attr("clicked", "true");
    });

    //ko je gumb poglej vse pritisnjen, se mora spremeniti višina, overflow ostane auto
    $("#all").click(() => {
        if (!state) {
            state = true
            $("#wrapper")[0].style.height = "auto";
        }
        else {
            state = false;
            $("#wrapper")[0].style.height = "35vh";
        }


    })

})

function getAllMovies() {
    $.ajax({
        url: url2 + "/getAllMovies",
        type: "GET",
        success: function (result) {
            result.forEach(movie => {
                appendData(movie);
            })
        },
        error: function (err) {
            console.log(err);
            sendMessage("Prišlo je do napake", "alert alert-danger")
        }
    });
}

function addMovie(movie) {
    $.ajax({
        url: url2 + "/addMovie",
        type: 'POST',
        data: JSON.stringify(movie),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            appendData(data[data.length - 1]);
            sendMessage("Uspešno dodajanje filma na strani strežnika", "alert alert-success")
        },
        error: function (err) {
            console.log(err);
            sendMessage("Prišlo je do napake", "alert alert-danger")
        }
    });
}

function appendData({ id, title, author, lenghtMin, genre }) {
    $("#movie-list").append(
        `<tr>   
            <td>${id}</td>
            <td>${title}</td>
            <td>${author}</td>
            <td>${lenghtMin}</td>
            <td>${genre}</td>
        </tr>`
    );
}

function sendMessage(msg, type) {
    let icon = type == "alert-danger" ? "<i class='fas fa-exclamation-triangle me-2'></i>" : "";
    $("#message").html(`
        <div class='${type + " alert-dismissible fade show"}' role='alert'>
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
    );
}