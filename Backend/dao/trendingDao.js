const helper = require('../helper.js');

class TrendingDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(spiele_id) {
        var sql = 'SELECT * FROM trending WHERE spiele_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(spiele_id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by spiele_id=' + spiele_id);

        return result;
    }

    loadAll() {
        var sql = 'SELECT * FROM trending';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return result;
    }

    loadCoverPfade() {
        var sql = `SELECT spiele.cover_pfad FROM spiele, trending WHERE spiele.id = trending.spiele_id;`;
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return result;
    }

    exists(spiele_id) {
        var sql = 'SELECT COUNT(spiele_id) AS cnt FROM trending WHERE spiele_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(spiele_id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    // TODO Für ALLE Daten
    create(spiele_name = '') {

        // TODO "?" hinzufügen für jedes Datum
        var sql = 'INSERT INTO trending (spiele_name) VALUES (?)';
        var statement = this._conn.prepare(sql);                                       // So viele "?" wie Daten
        var params = [spiele_name];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    // TODO Für ALLE Daten
    update(spiele_id, spiele_name = '') {
        var sql = 'UPDATE trending SET spiele_name=? WHERE spiele_id=?';
        var statement = this._conn.prepare(sql);
        var params = [spiele_name];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(spiele_id);
    }

    delete(spiele_id) {
        try {
            var sql = 'DELETE FROM trending WHERE spiele_id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(spiele_id);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + spiele_id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + spiele_id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        console.log('TrendingDao [_conn=' + this._conn + ']');
    }
}

module.exports = TrendingDao;