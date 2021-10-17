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


app.get("/categories", async (req, res) =>{
    const result = await connection.query(`SELECT * FROM categories;`);
    res.send(result.rows);
});

app.post("/categories", async (req, res) =>{
    const {name} = req.body;
    
    if(name.length === 0) {
        res.status(400).send("Não pode estar vazio");
    }

    const resultConsulta = await connection.query(`SELECT * FROM categories WHERE name = $1`, [name]);

    if(resultConsulta.rows.length !== 0) {
        res.status(409).send("Esta categoria já existe");
    }else{
        const result = await connection.query(`INSERT INTO categories (name) VALUES ($1);`, [name]);
        res.send("deu bom");
    }    
});


app.get("/games", async (req, res) =>{
    const {name} = req.query;
    
    try{
        if(name !== undefined){
            const entrada = name + "%";
            const resultParte = await connection.query(`SELECT * FROM games WHERE name LIKE $1;`,[entrada]);
            res.send(resultParte.rows);

        }
        else{
            const result = await connection.query(`SELECT * FROM games;`);
            res.send(result.rows);
        }
    }catch{
        res.sendStatus(500);
    }
});

app.post("/games", async (req,res)=>{
    const {
        name,
        image,
        stockTotal,
        categoryId,
        pricePerDay
    } = req.body;

    if(name.length === 0){
        res.status(400).send("Nome vazio");
    }

    if(stockTotal <= 0 || pricePerDay <= 0){
        res.status(400).send("Valor inválido");
    }

    try{
        console.log("OI");
        const resultNome = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if(resultNome.rows.length !==0){
            res.sendStatus(409);
        }else{
            const result = await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`, [name,image, stockTotal, categoryId, pricePerDay]);
            res.send("deu bom");
        }
    }catch{
        res.sendStatus(500);
    }
    
});

app.get("/customers", async (req,res)=>{
    const {cpf} = req.query;
    
    try{
        if(cpf !== undefined){
            const entrada = cpf + "%";
            const resultParte = await connection.query(`SELECT * FROM customers WHERE name LIKE $1;`,[entrada]);
            res.send(resultParte.rows);
        } else{
            const result = await connection.query(`SELECT * FROM customers;`);
            res.send(result.rows);
        }
    }catch{
        res.sendStatus(500);
    }
});

app.get("/customers/:id", async (req,res)=>{
    const id = Number(req.params.id);
    
    try{
        const result = await connection.query(`SELECT * FROM "customers" WHERE id = $1;`, [id]);
        if(result.rows.length !== 0){
            res.send(result.rows);
        }else{
            res.sendStatus(404);
        }
    }catch{
        res.sendStatus(500);
    }
});

app.post("/customers", async (req,res)=>{
    const {
        name,
        phone,
        cpf,
        birthday
    } = req.body;

    if(!name && !phone && !cpf && !birthday){
        res.sendStatus(201);
    }
    if(name.length === 0){
        res.sendStatus(400);
    }
    if(cpf.length !== 11){
        res.sendStatus(400);
    }
    let phoneNumber = true;
    for(let i = 0; i < phone.length; i++){
        const pn = phone[i];
        if(isNaN(Number(pn))){
            phoneNumber = false;
            break;
        }
    }
    if(!phoneNumber){
        res.status(400).send("eai");
    }

    try{
        const resultQuery = await connection.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);

        if(resultQuery.rows.length === 0){
            console.log(birthday);
            const result  = await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
            res.send("deu bom");
        } else{
            res.sendStatus(409);
        }
    }catch{
        res.sendStatus(500);
    }

});

app.put("/customers/:id", (res, req)=>{
    
});



app.listen(4000);

