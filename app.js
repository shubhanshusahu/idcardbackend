const express = require('express')
const db = require('./server/database')
const app = express();
const { Leads } = require('./api/routes/Leads')
// import bodyParser from 'body-parser';
const bodyParser = require('body-parser')

// app.use('/',(req,res,next)=>{

//     db.query(`select * from Leads`, (err, results, fields) => {
//         if (err) {
//             return console.log(err)

//         }
//          res.send(results);
//     })
//         console.log('No route /')
//     })
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    return res.send('working fine!!!!!!!!!!!')
})
app.get('/leads', (req, res) => {
    const {limit, page} =req.query;
    const offset = (page -1) * limit;
    db.query(`select * from leads order by LeadId DESC limit ? offset ? `,[+limit, +offset], async (err, results1, fields) => {
        if (err) {
            return console.log(err)
        }
        let totalPage
        db.query(`select count(*) as count from leads`, async (err, results, fields) => {
            if (err) {
                return console.log(err)
            }
            totalPage =Math.ceil(results[0].count /limit);
            console.log({arr : results1,totalPage :totalPage})
        })
        
        
        return res.send({arr : results1,'totalPage' :totalPage});
    })
    console.log('show leads')
})


app.get('/leadsbydate', (req, res) => {
    const {dat} =req.query;

    db.query(`select * from leads where DATE(CreatedDate) = ? order by LeadId DESC`,[dat], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show leads by date',dat,results)
        return res.send(results);
    })
   
})
app.get('/students', (req, res) => {
    const {dat} =req.query;

    db.query(`select * from student`, async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('students',dat,results)
        return res.send(results);
    })
   
})
app.get('/leadsbystatus', (req, res) => {
    const {status} =req.query;

    db.query(`select * from leads where Status = ? order by LeadId DESC`,[status], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show leads by status',status,results)
        return res.send(results);
    })
   
})
app.get('/leadsbydashboard', (req, res) => {
    const {quer} =req.query;

    db.query(`select * from leads where ${quer} order by LeadId DESC`, async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show leads by quer',quer,results)
        return res.send({arr : results});
    })
   
})
app.get('/leadsbytext', (req, res) => {
    const {text} =req.query;

    db.query(`select * from leads where 
    ApplicantName LIKE ? or AgentId LIKE ? or APhone LIKE ?
      or ALocation LIKE ?   or LeadId LIKE ?  or CreatedDate LIKE ?`,
    [text,text,text,text,text,text].map(e=> '%'+ e + '%'), async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show leads by text',text,results)
        return res.send(results);
    })
   
})
app.post('/leads', (req, res) => {

    console.log(req.body)
    // res.send(req.body)
    db.query(`insert into leads (PlanId,AgentId,ApplicantName,APhone,ALocation,CreatedDate) values (?,?,?,?,?,?)`, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        
        return res.send(results);
        // db.query(`update Agents set Wallet = Wallet + 50 where Phone = ? `, req.body.AgentId, (err, results, fields) => {
        //     if (err) {
        //         return console.log(err)
    
        //     }
        //     console.log('Inserted 1 row', req.body.AgentId, results)
            

        // })
        
    })


    console.log('Inserted 1 row', req.body.AgentId)
})

app.delete('/leads', (req, res) => {

    db.query(`delete from leads where LeadId =3`, (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        return res.send(results);
    })
    console.log('Deleted leads')
})
////////////////////////////////////////////

app.post('/agent', (req, res) => {
    console.log(req.body)
    db.query(`insert into Agents (Name,Phone,Email,Password,Address,UPIid) values (?,?,?,?,?,?)`, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        return res.send(results);
    })
    console.log('Agent Account Created')
})

app.post('/login', (req, res) => {
    console.log(req.body)
    db.query(`select * from Agents where Phone =? and Password = ? `, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log(results)
        return res.send(results);
    })
    console.log('login api called')
})
app.get('/agents', (req, res) => {

    db.query(`select * from Agents`, (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        return res.send(results);
    })
    console.log('show agents')
})
app.put('/leads', (req, res) => {
    console.log(req.body)
    db.query(`update leads set status = ? where LeadId = ? `, [req.body.Status,req.body.LeadId], (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        console.log('Updated status', req.body.Status, results)
        return res.send(results);

    })
})
app.post('/leadstatus', (req, res) => {

    db.query(`select Status from leads where LeadId =? ` , [req.body.LeadId], (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        return res.send(results);
    })
    console.log('get lead status')
})
app.get('/admindashboard', (req, res) => {
    db.query(`select Status,count(Status) as Total from leads group by Status`, async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show lead dashboard',results)
        return res.send(results);
    })
   
})
app.get('/agentdashboard', (req, res) => {

    const {agentPhone} =req.query

    db.query(`select Status,count(Status) as Total from leads where AgentId = ?  group by Status `, agentPhone,async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show agent lead dashboard',results)
        return res.send(results);
    })
   
})

app.get('/upiid', (req, res) => {

    const {phone} =req.query

    db.query(`SELECT UPIid FROM Agents where Phone = ?; `, phone,async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('get upi id ',results)
        return res.send(results);
    })
   
})
app.put('/upiid', (req, res) => {

    const {phone,UPIid} =req.query

    db.query(`update Agents set UPIid = ? where  phone = ?;`,[UPIid, phone],async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('get upi id ',results)
        return res.send(results);
    })
   
})
module.exports = app;