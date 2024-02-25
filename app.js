const express = require('express')
const db = require('./server/database')
const app = express();
const { Leads } = require('./api/routes/Leads')
// import bodyParser from 'body-parser';

const bodyParser = require('body-parser')
app.use(express.json());
// const cors = require('cors');
const multer = require("multer")
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  })


  
  app.use('/uploads',express.static("./uploads"))
// image config
var imgconfig =multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"uploads/")
    },
        filename:(req,file,callback)=>{
            callback(null,`image-${Date.now()}.${file.originalname}`)
        }
})
// image filter
const isimage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }
    else{
        callback(null,Error("Only images are allowed!"))
    }
}

//image upload 
var upload =multer ({
    storage :imgconfig,
    limits: {fileSize:'2000000'},
    fileFilter:isimage
})
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



app.get('/schools', (req, res) => {
    // const {dat} =req.query;

    db.query(`select * from Schools`, async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show all schools',results)
        return res.send(results);
    })
   
})
app.get('/teachers', (req, res) => {
    // const {dat} =req.query;

    db.query(`select * from user  where userrole ='teacher'`, async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show all teachers',results)
        return res.send(results);
    })
   
})
app.get('/students', (req, res) => {
    const {schoolid} =req.query;

    db.query(`select * from student where instituteid =?`,[schoolid], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('students',schoolid,results)
        return res.send(results);
    })
   
})
app.get('/student', (req, res) => {
    const {idstudent} =req.query;

    db.query(`select * from student where idstudent =?`,[idstudent], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('idstudent',idstudent)
        return res.send(results);
    })
   
})
app.get('/studentsbyschoolid', (req, res) => {
    const {schoolid,clas} =req.query;

    db.query(`select * from student where instituteid =? and class =?`,[schoolid,clas], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('students',schoolid,results)
        return res.send(results);
    })
   
})

app.get('/school', (req, res) => {
    const {idSchool} =req.query;

    db.query(`select * from Schools where idSchool = ?`,[idSchool], async (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log('show leads by status',idSchool,results)
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
app.put('/studentPhoto',upload.single("photo"), (req, res) => {
    console.log(req.body)
    const {data} = req.body;
    const {filename} = req.file

    if(!filename){
        res.status(422).json({status:   422,message:"fill all the details!"})
    }
    try{
        db.query(`update student set pic = ? where idstudent =?`,
                    [filename,JSON.parse(data).idstudent],
                      (err, results, fields) => {
                if (err) {
                    return console.log(err)
                }
                else{
                    res.status(201).json({status:201,message:"Successfully Updated!!!",data : results })
                }
            })
    }catch(e){
        res.status(422).json({status: 422,e})
    }
})
app.post('/student',upload.single("photo"), (req, res) => {

    console.log(req.body)
    const {data} = req.body;
    const {filename} = req.file

    if(!filename || !data){
        res.status(422).json({status:   422,message:"fill all the details!"})
    }

    try{
        db.query(`insert into student (instituteid,studname,rollno,enrollno,class,section,
                    father_name,mother_name,blood_group,dob,address,pincode,gender,contactno,pic) 
                    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [...JSON.parse(data),filename],
                      (err, results, fields) => {
                if (err) {
                    return console.log(err)
                }
                else{
                    res.status(201).json({status:201,message:"Successfully submitted!!!",data : results })
                }
            })
    }catch(e){
        res.status(422).json({status: 422,e})
    }

    // res.send(req.body)
    // db.query(`insert into student (instituteid,studname,rollno,enrollno,class,section,
    //         father_name,mother_name,blood_group,dob,address,pincode,pic,gender,contactno) 
    //         values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, Object.values(req.body), (err, results, fields) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     return res.send(req.body.data);
        
    // })

    // res.send(req.body.data);
    // console.log('Inserted 1 photo', JSON.stringify(req.body.data))
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
app.post('/school', (req, res) => {
    console.log(req.body)
    db.query(`insert into Schools (SchoolRedgNo,SchoolnName,SchoolAddress) values (?,?,?)`, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        return res.send(results);
    })
    console.log('School Account Created')
})
app.post('/teacher', (req, res) => {
    console.log(req.body)
    db.query(`insert into user (username,usermail,userphone,userpass,userrole,schoolid) values (?,?,?,?,'teacher',?)`, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        return res.send(results);
    })
    console.log('Teacher Account Created')
})

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
    db.query(`select * from user where usermail =? and userpass = ? `, Object.values(req.body), (err, results, fields) => {
        if (err) {
            return console.log(err)
        }
        console.log(Object.values(req.body),'body recd')
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
app.delete('/student', (req, res) => {
    const {idstudent} =req.query;
    db.query(`delete from student where idstudent = ?`,idstudent, (err, results, fields) => {
        if (err) {
            return console.log(err)

        }
        console.log('Student deleted',idstudent)
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
app.post('/importexcel', (req, res) => {
    // (instituteid,studname,rollno,enrollno,class,section,
    //     father_name,mother_name,blood_group,dob,address,pincode,gender,contactno,pic) 
    let val = req.body
    let keys =Object.keys(val[0])
    let transformToarr = val.map(r=> Object.values(r))
    console.log(keys,'keys excel')
    let insquery =`insert into student (${keys})`
    console.log(insquery.replace(/['‘’"“”]/g, ''));
    console.log(transformToarr,'transformed excel')
    db.query(`${insquery.replace(/['‘’"“”]/g, '')} values ?`,
    [transformToarr], async (err, results, fields) => {
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
app.put('/student', (req, res) => {

    const {idstudent} =req.query
    db.query(`update student set instituteid=?,studname=?,rollno=?,enrollno=?,class=?,section=?,
        father_name=?,mother_name=?,blood_group=?,address=?,pincode=?,gender=?,contactno=? where idstudent =?`,
      [
        req.body.instituteid,
        req.body.studname,
        req.body.rollno,
        req.body.enrollno,
        req.body.class,
        req.body.section,
        req.body.father_name,
        req.body.mother_name,
        req.body.blood_group,
        // req.body.dob,
        req.body.address,
        req.body.pincode,
        req.body.gender,
        req.body.contactno,
        idstudent,

      ],
          (err, results, fields) => {
    if (err) {
        return console.log(err)
    }
    else{
        res.status(201).json({status:201,message:"Updated submitted!!!",data : results })
    }
})

    // db.query(`update student set UPIid = ? where  phone = ?;`,[UPIid, phone],async (err, results, fields) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     console.log('get upi id ',results)
    //     return res.send(results);
    // })
   
})
module.exports = app;