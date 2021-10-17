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





app.listen(4000);

