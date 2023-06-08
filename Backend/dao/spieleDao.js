const helper = require('../helper.js');

class SpieleDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Spiele WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        return result;
    }

    loadByIdList(idListString) {
        let idList = idListString.toString().split(",");
        console.log(idList);
        let sql = 'SELECT * FROM Spiele WHERE ';
        for (let i = 0; i < idList.length; i++) {
            console.log(idList[i]);
            console.log(typeof idList[i]);
            if (i == idList.length - 1) {
                sql += "id='" + idList[i] + "';";
            } else {
                sql += "id='" + idList[i] + "' OR ";
            }
        }
        const statement = this._conn.prepare(sql);
        console.log(statement);
        console.log("idListString: " + idListString);
        console.log("statement: " + statement.all());
        const result = statement.all();

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        return result;
    }


    loadAll() {
        var sql = 'SELECT * FROM Spiele';
        var statement = this._conn.prepare(sql);
        console.log(statement);
        console.log("statement.all(): " + statement.all());
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Spiele WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(name = '', cover_pfad = '', beschreibung = '', klappentext = '') {

        var sql = 'INSERT INTO Spiele (name,cover_pfad,beschreibung,klappentext) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [name, cover_pfad, beschreibung, klappentext];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    createReview(spiele_id, benutzername, bewertungstext, sterneanzahl) {

        var sql = 'INSERT INTO Bewertungen (spiele_id,benutzername,bewertungstext,sterneanzahl) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [spiele_id, benutzername, bewertungstext, sterneanzahl];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(spiele_id);
        // return this.loadById(result.lastInsertRowid);
    }

    loadReviews(spiele_id) {
        var sql = 'SELECT * FROM Bewertungen WHERE spiele_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(spiele_id);

        return result;
    }

    update(id, name = '', cover_pfad = '', beschreibung = '', klappentext = '') {
        var sql = 'UPDATE Spiele SET name=?,cover_pfad=?,beschreibung=?,klappentext=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [name, cover_pfad, beschreibung, klappentext, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Spiele WHERE id=?';
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
        console.log('SpieleDao [_conn=' + this._conn + ']');
    }
}

module.exports = SpieleDao;