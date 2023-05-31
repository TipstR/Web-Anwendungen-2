function getHeader() {
    let content = '';

    if (typeof localStorage.getItem("Benutzer") != "string") {

        content = ` <nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="../index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="../Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="../index.html" class="L1 remove_text_decoration" id="store"> Store </a>
                                <a href="../html/login.html" class="L1 remove_text_decoration" id="library"> Login </a>
                                <a href="../html/about.html" class="L1 remove_text_decoration" id="about"> About </a>
                            </section>
                            <section id="style search cart">
                                <a> <label for="search"></label><input type="text" id="search" placeholder="Search" > </a>
                                <a href="../html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="../Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
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
                                <a href="../index.html" class="L1 remove_text_decoration" id="store"> Store </a>
                                <a href="../html/library.html" class="L1 remove_text_decoration" id="library"> Library </a>
                                <a href="../html/about.html" class="L1 remove_text_decoration" id="about"> About </a>
                            </section>
                            <section id="style search cart">
                                <a> <label for="search"></label><input type="text" id="search" placeholder="Search" > </a>
                                <a href="../html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="../Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
                            </section>
                        </section>
                    </nav>`;
    }

    $('#header').html(content);

}



function getIndexHeader() {
    let content = '';

    if (typeof localStorage.getItem("Benutzer") != "string") {
        content = ` <nav id= "nav1">
                        <section id= "header line">
                            <section id="style logo">
                                <a href="index.html" class="L1 remove_text_decoration" id="logo"> <img id="logoImage" src="Backend/resources/logo.png" alt="logo"></a>
                            </section>
                            <section id= "menu style">
                                <a href="index.html" class="L1 remove_text_decoration" id="store"> Store </a>
                                <a href="html/login.html" class="L1 remove_text_decoration" id="library"> Login </a>
                                <a href="html/about.html" class="L1 remove_text_decoration" id="about"> About </a>
                            </section>
                            <section id="style search cart">
                                <a> <label for="search"></label><input type="text" id="search" placeholder="Search" > </a>
                                <a href="html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
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
                                <a href="index.html" class="L1 remove_text_decoration" id="store"> Store </a>
                                <a href="html/library.html" class="L1 remove_text_decoration" id="library"> Library </a>
                                <a href="html/about.html" class="L1 remove_text_decoration" id="about"> About </a>
                            </section>
                            <section id="style search cart">
                                <a> <label for="search"></label><input type="text" id="search" placeholder="Search" > </a>
                                <a href="html/cart.html" class="L1 remove_text_decoration" id="cart"> <img src="Backend/resources/cart.png" alt="cart" width="30" height="30"> </a>
                            </section>
                        </section>
                    </nav> `;
    }

    $('#header').html(content);

}