async function getHeader() {
    let content = '';

    if (typeof localStorage.getItem("token") != "string") {

        content = ` <nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="../index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="../Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="../index.html" class="L1 remove_text_decoration" id="store"> Shop </a>
                                <a href="../html/login.html" class="L1 remove_text_decoration" id="library"> Login </a>
                                <a href="../html/about.html" class="L1 remove_text_decoration" id="about"> Über uns </a>
                            </section>
                        </section>
                    </nav>`;
    }

    else {
        content = ` <nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="../index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="../Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="../index.html" class="L1 remove_text_decoration" id="store"> Shop </a>
                                <a href="../html/library.html" class="L1 remove_text_decoration" id="library"> Bibliothek </a>
                                <a href="../html/about.html" class="L1 remove_text_decoration" id="about"> Über uns </a>
                            </section>
                            <section id="style search cart">
                                <a class="L1 remove_text_decoration" id="logout" onclick="logout()"> Ausloggen </a>
                                        <span id="username">` + await getUsername()  + `</span>
                                <a href="../html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="../Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
                            </section>
                        </section>
                    </nav>`;
    }

    document.getElementById("header").innerHTML = content;

}



async function getIndexHeader() {
    let content = '';

    if (typeof localStorage.getItem("token") != "string") {
        content = ` <nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="index.html" class="L1 remove_text_decoration" id="store"> Shop </a>
                                <a href="html/login.html" class="L1 remove_text_decoration" id="library"> Login </a>
                                <a href="html/about.html" class="L1 remove_text_decoration" id="about"> Über uns </a>
                            </section>
                        </section>
                    </nav>`;
    }

    else {
        content = `<nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="index.html" class="L1 remove_text_decoration" id="store"> Shop </a>
                                <a href="html/library.html" class="L1 remove_text_decoration" id="library"> Bibliothek </a>
                                <a href="html/about.html" class="L1 remove_text_decoration" id="about"> Über uns </a>
                            </section>
                            <section id="style search cart">
                            
                                        <a class="L1 remove_text_decoration" id="logout" onclick="logout()"> Ausloggen </a>
                                        <span id="username">` + await getUsername()  + `</span>
                                
                                <a href="html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
                            </section>
                        </section>
                    </nav> `;
    }

    document.getElementById("header").innerHTML = content;

}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}


async function getUsername() {
    let username;
    try {
        username = (await $.ajax({
            url: "http://localhost:8000/api/benutzer/gib/" + encodeURIComponent(localStorage.getItem("token")),
            method: "get",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })).benutzername;
    } catch(error) {
        console.log(error);
    }

    if (!username) {
        logout();
        return;
    }
    console.log(username);
    return username;
}