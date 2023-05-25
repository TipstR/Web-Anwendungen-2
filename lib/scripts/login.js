/**
 * Login eines Benutzers, Seite: login.html
 */

const fehlermeldung = document.getElementById("fehlermeldung");
const erfolg = document.getElementById("erfolg");

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
        console.log("Hallo Welt");
        // throw new Error(benutzerObj.nachricht);
        return null;
    }

    return benutzerObj;
};
