import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const {Pool} = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});


app.get("/categories", (req, res) =>{
    const promise = connection.query(`SELECT * FROM categories;`);
    try{
    promise.then(result =>{
        console.log(result);
        res.send(result.rows);
    })
    }catch(err){
        res.send(err);
    }
   
});

app.post("/categories", (req, res) ={
   
})

 //res.send(categorias);



app.listen(4000);

