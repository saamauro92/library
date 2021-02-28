const express = require("express");
const mysql = require("mysql");
const util = require("util");

const app = express();


app.use(express.json());


const conexion = mysql.createConnection({
 host: "sql11.freemysqlhosting.net",
user: "sql11394364",
password: 'ek4HQPAZHi',
database: 'sql11394364' 

});

conexion.connect((error) => {
    if(error){
        throw error;
    };
    console.log('conexion con db establecida')
});

const query = util.promisify(conexion.query).bind(conexion)


app.get('/', (req,res) => {
res.send("app conectada")
});

app.get('/api/personas', async (req, res) => {

    const respuesta = await query("select * from persona")
    
    res.json(respuesta)
});


app.get("/api/libros", async (req,res ) => {
try { 
    const respuesta = await query('select * from libros')
    res.json(respuesta);
 }
 catch(e){
    res.status(500).send("error inesperado")
}
});



// GET LIBRO/:id

app.get("/api/libros/:id", async (req,res) => {
    try {

const respuesta = await query('select * from libros where id=?', [req.params.id]);

if(respuesta.length==1){
    res.json(respuesta[0])   
}else {
    res.status(413).send('No se encuentra este libro')
}

    } catch(e){ 
    res.status(500).send('error inesperado');
 }

});
 


// POST /persona 


app.post('/api/persona', async (req,res) => {

    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const alias = req.body.alias
    const email = req.body.email

    try {
if(!nombre || !apellido || !email || !alias){
   res.status(413).send("faltan datos")
   throw new Error ("")
}

 
    const verificoEmail = await query('select * from persona where email = ?', [email]);
        if (verificoEmail.length > 0) {
            res.status(413).send("Email ya existe")
            throw new Error ("")
        }  

    const respuesta = await query("insert into persona (nombre, apellido, alias, email) values (?,?,?,?)", [nombre, apellido, alias, email])
    
    const registroPersona = await query("select * from persona where id=?", [respuesta.insertId])
    res.json(registroPersona[0])


    }catch(e){
        res.status(500).send("error inesperado")
    }


});



// PUT libro/:id


app.put("/api/libros/:id", async (req,res) => {


    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const categoria_id = req.body.categoria_id
    const persona_id = req.body.persona_id
 
    try {
    
        if(!descripcion){
            res.status(413).send("faltan datos")
            throw new Error ("")
         }
    
     const respuesta = await query("UPDATE libros SET descripcion=? where id=?", [descripcion,  req.params.id])

     const modificado = await query('select * libros where id=?', [req.params.id])

        res.json(modificado[0])
   
   
    }
    
    catch(e) { 
    res.status(500).send("error inesperado")
    }

})




app.listen(3000, ()=> {
    console.log("APP server working in port 3000")
})