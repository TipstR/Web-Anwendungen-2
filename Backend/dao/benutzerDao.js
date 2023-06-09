const helper = require('../helper.js');
const md5 = require('md5');


class BenutzerDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Benutzer WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        return result;
    }

    loadUserGames(id) {
        var sql = 'SELECT Spiele FROM Benutzer WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);
        return result;
    }

    loadCart(id) {
        var sql = 'SELECT warenkorb FROM Benutzer WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);
        return result;
    }



    // gameIds is delivered as a string
    updateUserGames(userId, gameIds) {
        var sql = 'UPDATE Benutzer SET Spiele=Spiele || ? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [gameIds, userId];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        return result;
    }


    loadAll() {
        var sql = 'SELECT * FROM Benutzer';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Benutzer WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    isUniqueEmail(email) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Benutzer WHERE email=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(email);

        if (result.cnt == 0)
            return true;

        return false;
    }

    isUniqueUsername(benutzername) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Benutzer WHERE benutzername=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(benutzername);

        if (result.cnt == 0)
            return true;

        return false;
    }

    hasAccess(email, passwort) {
        var sql = 'SELECT ID FROM Benutzer WHERE email=? AND passwort=?';
        var statement = this._conn.prepare(sql);
        var params = [email, md5(passwort)];
        var result = statement.get(params);

        if (helper.isUndefined(result))
            throw new Error('No such email or password');

        return this.loadById(result.id);
    }

    addItemToCart(userId, gameId) {
        const sql = 'UPDATE Benutzer SET warenkorb=warenkorb || ? WHERE id=?';
        const statement = this._conn.prepare(sql);
        const params = [gameId + ',', userId];
        const result = statement.run(params);

        if (helper.isUndefined(result)) {
            throw new Error('no such user');
        }

        return result;
    }

    create(benutzername = '', email = '', passwort = '') {
        var sql = 'INSERT INTO Benutzer (benutzername, email, passwort, spiele, warenkorb) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [benutzername, email, md5(passwort), '', ','];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(id, benutzername = '', neuesPasswort = null) {
        if (helper.isNull(neuesPasswort)) {
            var sql = 'UPDATE Benutzer SET benutzername=? WHERE id=?';
            var statement = this._conn.prepare(sql);
            var params = [benutzername, id];
        } else {
            var sql = 'UPDATE Benutzer SET benutzername=?,passwort=? WHERE id=?';
            var statement = this._conn.prepare(sql);
            var params = [benutzername, md5(neuesPasswort), id];
        }
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Benutzer WHERE id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    deleteCart(id) {
        try {
            var sql = 'UPDATE Benutzer SET warenkorb=? WHERE id=?';
            var statement = this._conn.prepare(sql);
            var params = [",", id]
            var result = statement.run(params);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    deleteItemFromCart(userid, gameid) {
        try {
            const expression = "," + gameid + ",";
            var sql = "UPDATE Benutzer SET warenkorb=REPLACE(warenkorb, ?, ',') WHERE id=?";
            console.log("Generiertes SQL: " + sql);
            console.log("Expression: " + expression);
            var statement = this._conn.prepare(sql);
            var params = [expression, userid];
            var result = statement.run(params);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + userid);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + userid + '. Reason: ' + ex.message);
        }
    }


    toString() {
        console.log('BenutzerDao [_conn=' + this._conn + ']');
    }
}

module.exports = BenutzerDao;