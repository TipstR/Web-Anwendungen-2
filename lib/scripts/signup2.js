/**
 * Registrieren eines neuen Benutzers, Seite: register.html
 */

const signupForm = document.getElementById("signupForm");

const usernameInp = document.getElementById("benutzernameInput"); // Felder aus HTML-Code anhand ID
const emailInp = document.getElementById("emailInput");
const passwortInp = document.getElementById("passwortInput");

/**
 * Neuen Benutzer registrieren
 *
 * @param {string} benutzername Benutzername
 * @param {string} passwort Passwort
 * @param {string} email E-Mail-Adresse
 *
 * @returns Benutzer object
 */
const createBenutzer = async (benutzername, passwort, email) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json"); // Daten im Format JSON

    const benutzer = JSON.stringify({
        // Objekte "Benutzer" zusammenstellen
        benutzername: benutzername,
        passwort: passwort,
        email: email,
    });

    const reqOpt = {
        // HTTP-Request zusammenstellen
        method: "POST",
        headers: headers,
        body: benutzer
    };

    let res;
    try {
        res = await fetch("http://localhost:8000/api/benutzer", reqOpt); // Anfrage an Server
    } catch (e) {
        throw new Error("Fehler bei Server-Anfrage!");
    }

    const benutzerObj = await res.json(); // Rückmeldung als JSON erkennen
    if (benutzerObj.fehler) {
        throw new Error(benutzerObj.nachricht);
    }

    return benutzerObj;
};

/**
 * Absende-Event des Registrieren-Formulars, wird aufgerufen, wenn man auf "Signup" klickt
 *
 * @param {object} ev Submit event
 */
signupForm.onsubmit = async (ev) => {
    ev.preventDefault();

    const username = usernameInp.value;
    const email = emailInp.value; // Wert des E-Mail-Felds
    const pw = passwortInp.value;

    let benutzer;
    try {
        benutzer = await createBenutzer(username, pw, email); // Benutzer erstellen, s. oben
    } catch (err) {
        alert(err);

        return;
    }
    console.log(benutzer);

    alert(
        "Benutzer mit Benutzernamen " +
        benutzer.benutzername +
        " erfolgreich erstellt!"
    );

    location.href = "login.html"; // Weiterleitung auf Login-Seite
};
