/**
 * Login eines Benutzers, Seite: login.html
 */

const loginForm = document.getElementById("loginForm");

const emailInp = document.getElementById("emailInput");
const passwortInp = document.getElementById("passwordInput");

/**
 * Benutzer am Server einloggen
 *
 * @param {string} email Email
 * @param {string} passwort Passwort
 * @returns Benutzer object
 */
const loginBenutzer = async (email, passwort) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const benutzer = JSON.stringify({
        email: email,
        passwort: passwort
    });

    const reqOpt = {
        method: "POST",
        headers: headers,
        body: benutzer
    };

    let res;
    try {
        res = await fetch(
            "http://localhost:8000/api/benutzer/login",
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
 * @param {object} event Submit event
 */
loginForm.onsubmit = async (event) => {
    event.preventDefault();

    const email = emailInp.value;
    const passwort = passwortInp.value;

    let angemeldeterBenutzer;    try {
        angemeldeterBenutzer = await loginBenutzer(email, passwort);
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
