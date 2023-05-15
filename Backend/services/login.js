/**
 * Login eines Benutzers, Seite: login.html
 */

const loginForm = document.getElementById("loginForm");

const emailInp = document.getElementById("emailInput");
const pwInp = document.getElementById("passwordInput");

/**
 * Benutzer am Server einloggen
 *
 * @param {string} email Email
 * @param {string} pw Passwort
 * @returns Benutzer object
 */
const loginBenutzer = async (email, pw) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const benutzer = JSON.stringify({
        email: email,
        passwort: pw
    });

    const reqOpt = {
        method: "POST",
        headers: headers,
        body: benutzer
    };

    let res;
    try {
        res = await fetch(
            "http://localhost:8000/api/forumsbenutzer/login",
            reqOpt
        );
    } catch (e) {
        throw new Error("Fehler bei Server-Anfrage!");
    }

    const benutzerObj = await res.json();
    if (benutzerObj.fehler) {
        throw new Error(benutzerObj.nachricht);
    }

    return benutzerObj;
};

/**
 * Login-Formular abgesendet
 *
 * @param {object} ev Submit event
 */
loginForm.onsubmit = async (ev) => {
    ev.preventDefault();

    const email = emailInp.value;
    const pw = pwInp.value;

    let angemeldeterBenutzer;
    try {
        angemeldeterBenutzer = await loginBenutzer(email, pw);
    } catch (err) {
        alert(err);

        return;
    }

    alert(
        "Benutzer mit Emailn " +
        angemeldeterBenutzer.email +
        " erfolgreich eingeloggt!"
    );

    localStorage.setItem(
        "angemeldeterBenutzer",
        JSON.stringify(angemeldeterBenutzer)
    );

    location.href = "index.html"; // Weiterleitung auf Index-Seite
};

// bereits angemeldet
if (localStorage.getItem("angemeldeterBenutzer")) {
    location.href = "index.html"; // Weiterleitung auf Index-Seite
}
