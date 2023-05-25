/**
 * Registrieren eines neuen Benutzers, Seite: signup.html
 */

const signupForm = document.getElementById("signupForm");

const benutzernameInp = document.getElementById("benutzernameInput"); // Felder aus HTML-Code anhand ID
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
        console.log(reqOpt);
        res = await fetch("http://localhost:8000/api/benutzer", reqOpt); // Anfrage an Server
        console.log(res);
    } catch (e) {
        throw new Error("Fehler bei Server-Anfrage!");
    }

    const benutzerObj = await res.json(); // Rückmeldung als JSON erkennen
    if (benutzerObj.fehler) {
        throw new Error(benutzerObj.nachricht);
    }

    return benutzerObj;
};
