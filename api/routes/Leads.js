const express =require('express')
const router = express.Router();
const db = require('../../server/database')

// router.get('/', (req,res,next)=>{
// db.query(`select * from Leads where LeadId ='P1'`, (err, results, fields) => {
//     if (err) {
//         return console.log(err)

//     }
//      res.send(results);
// })
// console.log('show leads')
// })
 const Leads =(req,res,next)=>{
    db.query(`select * from Leads where LeadId ='P1'`, (err, results, fields) => {
    if (err) {
        return console.log(err)

    }
     res.send(results);
})
    console.log('show leads')
}

exports.module = Leads