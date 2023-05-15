/**
 * Signup eines Benutzers, Seite: login.html
 */

const signupForm = document.getElementById("signupForm");
const benutzernameInp  = document.getElementById("benutzernameInput")
const emailInp = document.getElementById("emailInput");
const passwortInp = document.getElementById("passwortInput");

/**
 * Benutzer am Server einloggen
 * @param {string} benutzername Benutzername
 * @param {string} email Email
 * @param {string} passwort Passwort
 * @returns Benutzer object
 */
const signupBenutzer = async (benutzername, email, passwort) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const benutzer = JSON.stringify({
        benutzername: benutzername,
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
            "http://localhost:8000/api/benutzer/signup/id",
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
 * Signup-Formular abgesendet
 *
 * @param {object} event Submit event
 */
signupForm.onsubmit = async (event) => {
    event.preventDefault();

    const benutzername = benutzernameInp.value;
    const email = emailInp.value;
    const passwort = passwortInp.value;


    let angemeldeterBenutzer;    try {
        angemeldeterBenutzer = await loginBenutzer(benutzername, email, passwort);
    } catch (err) {
        alert(err);

        return;
    }

    alert(
        "Benutzer mit Emailn " +
        angemeldeterBenutzer.email +
        " erfolgreich registriert!"
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
