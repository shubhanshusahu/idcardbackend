const { createPool } = require('mysql');
const pool = createPool({
    host: '88.99.105.11',
    user: 'alfaxsol_shubhanshu',
    password: 'alphaX2024',
    database: 'alfaxsol_idcard',
    connectionLimit: 1000,
})
pool.query('select * from Schools', (err, results, fields) => {
    if (err) {
        return console.log(err)

    }
    return console.log(results);
})
module.exports = pool

// MYSQL_ADDON_HOST=blxgrcztywgalnqwbvsn-mysql.services.clever-cloud.com
// MYSQL_ADDON_DB=blxgrcztywgalnqwbvsn
// MYSQL_ADDON_USER=u6xgd67fhqnbcamt
// MYSQL_ADDON_PORT=3306
// MYSQL_ADDON_PASSWORD=u1hOJRUnTHnp3bp12Lf1
// MYSQL_ADDON_URI=mysql://u6xgd67fhqnbcamt:u1hOJRUnTHnp3bp12Lf1@blxgrcztywgalnqwbvsn-mysql.services.clever-cloud.com:3306/blxgrcztywgalnqwbvsn