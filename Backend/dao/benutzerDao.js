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

    isunique(email) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Benutzer WHERE email=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(email);

        if (result.cnt == 0)
            return true;

        return false;
    }

    hasaccess(email, passwort) {
        var sql = 'SELECT ID FROM Benutzer WHERE email=? AND passwort=?';
        var statement = this._conn.prepare(sql);
        var params = [email, md5(passwort)];
        var result = statement.get(params);

        if (helper.isUndefined(result))
            throw new Error('User has no access');

        return this.loadById(result.id);
    }

    create(benutzername = '', email = '', passwort = '') {
        var sql = 'INSERT INTO Benutzer (benutzername, email, passwort) VALUES (?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [benutzername, email, md5(passwort)];
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

    toString() {
        console.log('BenutzerDao [_conn=' + this._conn + ']');
    }
}

module.exports = BenutzerDao;