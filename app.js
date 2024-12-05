const express = require('express')
const bodyParser = require('body-parser')
const mysql2 = require('mysql2/promise.js')
const path = require('path')
const moment = require('moment')
const session = require('express-session')
const { connect } = require('http2')
// HERENCIA PAQUETES
const app=express()
// ASignacion constante
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));// Utilizacion body parser funcionamiento
app.use(express.static(path.join(__dirname)));

//Configuracion de la sesion

app.use(session({
    secret: 'manzanascuidado22',
    resave: false,
    saveUninitialized: true,
}))

//Coneccion BBDD

const db=({
    host:'localhost',
    user:'root',
    password:'',
    database:'manzanascuidado'
})
//Registrar Usuario
app.post('/insetar', async(req,res)=>{
    const{Nombre, Apellido, Correo, Telefono,TipoDocumento,NumeroDocumento,MANZANAId_manzana}=req.body
    try{
        //verificar usuario
        const connect=await mysql2.createConnection(db)
        const [verificar]=await connect.execute('SELECT * FROM usuario WHERE NumeroDocumento=? AND TipoDocumento=?', [NumeroDocumento, TipoDocumento])
        if(verificar.length>0){
            res.status(409).send(`
                <script>
                    window.onload=function(){
                        alert("Este usuario ya existe")
                        window.location.href='/Inicio.html'
                    }
                </script>
                `)
        }
        else{
            await connect.execute('INSERT INTO usuario (Nombre, Apellido, Correo, Telefono,TipoDocumento,NumeroDocumento,MANZANAId_manzana) VALUES (?,?,?,?,?,?,?) ',[Nombre, Apellido, Correo, Telefono,TipoDocumento,NumeroDocumento,MANZANAId_manzana])
            res.status(201).send(`
                <script>
                    window.onload=function(){
                        alert("Usuario añadido correctamente")
                        window.location.href='/Inicio.html'
                    }
                </script>
                `)
                await connect.end()
        }
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})
//Enviar pagina de usuario
app.post('/Iniciar',async(req,res)=>{
    const{TipoDocumento,NumeroDocumento}=req.body
    try{
        const connect=await mysql2.createConnection(db)
        const [verificarInicio]=await connect.execute('SELECT * FROM usuario WHERE NumeroDocumento=? AND TipoDocumento=?', [NumeroDocumento, TipoDocumento])
        if (verificarInicio.length>0){
            const [man]= await connect.execute('SELECT manzana.Nombre FROM usuario INNER JOIN manzana ON usuario.Id_usuario = manzana.Id_manzana WHERE usuario.Nombre = ?', [verificarInicio[0].Nombre])
            req.session.usuario=verificarInicio[0].Nombre
            req.session.NumeroDocumento=NumeroDocumento
            const usuario={Nombre:verificarInicio[0].Nombre}
            res.locals.usuario=usuario
            res.locals.NumeroDocumento=NumeroDocumento
            res.sendFile(path.join(__dirname, 'Servicios.html'))
            await connect.end()
        }
        else{
            res.status(401).send(`
                <script>
                    window.onload=function(){
                        alert("No se ha encontrado la sesion")
                        window.location.href='/Inicio.html'
                    }
                </script>
                `)
        }
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})

//Enviar pagina de Admin
app.post('/IniciarAdmin',async(req,res)=>{
    const{TipoDocumento,NumeroDocumento}=req.body
    try{
        const connect=await mysql2.createConnection(db)
        const [verificaradmin]=await connect.execute('SELECT * FROM usuario WHERE NumeroDocumento=? AND TipoDocumento=?', [NumeroDocumento, TipoDocumento])
        console.log(verificaradmin[0].Nombre)
        if (verificaradmin.length>0){
            const [man]= await connect.execute('SELECT manzana.Nombre FROM usuario INNER JOIN manzana ON usuario.Id_usuario = manzana.Id_manzana WHERE usuario.Nombre = ?', [verificaradmin[0].Nombre])
            req.session.usuario=verificaradmin[0].Nombre
            req.session.NumeroDocumento=NumeroDocumento
            const usuario={Nombre:verificaradmin[0].Nombre}
            res.locals.usuario=usuario
            res.locals.NumeroDocumento=NumeroDocumento
            res.sendFile(path.join(__dirname, 'Admin.html'))
            await connect.end()
        }
        else{
            res.status(401).send(`
                <script>
                    window.onload=function(){
                        alert("No se ha encontrado la sesion")
                        window.location.href='/Inicio.html'
                    }
                </script>
                `)
        }
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})

app.get('/obtener-usuario', async(req,res)=>{
    const usuario = req.session.usuario
    if(usuario){
        res.json({Nombre:usuario})
    }
    else{
        res.status(401).send('usuario no encontrado')
    }
})

app.post('/obtener-servicios-usuario',async(req,res)=>{
    const usuario=req.session.usuario
    try{
        const connect = await mysql2.createConnection(db)
        const [datos] = await connect.execute ('SELECT servicio.Nombre FROM servicio INNER JOIN manzana_servicio ON manzana_servicio.ServicioId_servicio = servicio.Id_servicio INNER JOIN manzana ON manzana.Id_manzana = manzana_servicio.MANZANAId_manzana INNER JOIN usuario ON manzana.Id_manzana=usuario.MANZANAId_manzana WHERE usuario.Nombre="juan david";')
        console.log(datos)
        res.json ({servicios : datos.map(hijo => hijo.Nombre)}) 
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})
app.post('/obtener-servicios-admin',async(req,res)=>{
    const usuario=req.session.usuario
    try{
        const connect = await mysql2.createConnection(db)
        const [datos] = await connect.execute ('SELECT DISTINCT Nombre FROM servicio;')
        console.log(datos)
        res.json ({servicios : datos.map(hijo => hijo.Nombre)}) 
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})
app.post('/obtener-peticiones-admin', async (req, res) => {
    const usuario = req.session.usuario;

    try {
        const connect = await mysql2.createConnection(db);
        const [datos] = await connect.execute('SELECT * FROM solicitud;');
        console.log(datos);
        res.json({ peticiones: datos });
        await connect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send("Pailas");
        return;
    }
});
// <!-- Ruta para guardar los servicos seleccionados por el usuario -->
 app.post('/guardar-servicio-usuario', async (req,res) =>{
    const usuario = req.session.usuario
    const NumeroDocumento = (req.session.NumeroDocumento)
    const { servicio,FechaHora} = req.body;
    try{
      const conect= await mysql2.createConnection(db)
      const [IDU] = await conect.execute('SELECT Id_usuario FROM usuario WHERE NumeroDocumento=?',[NumeroDocumento]);
      await conect.query('INSERT INTO solicitud (Nombre,FechaHora,USUARIOId_usuario) values(?,?,?)',[servicio,FechaHora,IDU[0].USUARIOId_usuario]);
      res.status(200).send('Servicios guardados exitosamente');
      await conect.end();
    } catch(error){
        console.error('error en el servidor:',error);
        res.status(500).send('Error en el servidor');
    }
 });

//Añadir Manzana
app.post('/Agregar-Manzana', async(req,res)=>{
    const{Nombre, Direccion, Localidad}=req.body
    try{
        //verificar Manzana
        const connect=await mysql2.createConnection(db)
        const [verificar]=await connect.execute('SELECT * FROM manzana WHERE Nombre=? AND Direccion=? AND Localidad=?', [Nombre, Direccion, Localidad])
        if(verificar.length>0){
            res.status(409).send(`
                <script>
                    window.onload=function(){
                        alert("Esta manzana ya ha sido creada")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
        }
        else{
            await connect.execute('INSERT INTO manzana (Nombre,Direccion,Localidad) VALUES (?,?,?) ',[Nombre,Direccion,Localidad])
            res.status(201).send(`
                <script>
                    window.onload=function(){
                        alert("Manzana Añadida Correctamente")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
                await connect.end()
        }
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})
// Eliminar la manzana
app.post('/Eliminar-Manzana', async (req, res) => {
    const { Nombre } = req.body;

    try {
        const connect = await mysql2.createConnection(db);
    
        // Verificar si la manzana existe (si es necesario)
        const [verificar] = await connect.execute('SELECT * FROM manzana WHERE Nombre=?', [Nombre]);
    
        if (verificar.length > 0) {
            
            await connect.execute('DELETE FROM manzana WHERE Nombre=?', [Nombre]);
            res.status(201).send(`
                <script>
                    window.onload=function(){
                        alert("Manzana Eliminado Correctamente")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
        } else {
            alert("manzana no encontrada")
            res.status(404).json({ message: 'Manzana no encontrada' });

        }
    
        await connect.end();
    } catch (error) {
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
});
//Añadir Servicio
app.post('/Agregar-Servicio', async(req,res)=>{
    const{Nombre, Descripcion}=req.body
    try{
        //verificar servicio
        const connect=await mysql2.createConnection(db)
        const [verificar]=await connect.execute('SELECT * FROM servicio WHERE Nombre=? AND Descripcion=?', [Nombre, Descripcion])
        if(verificar.length>0){
            res.status(409).send(`
                <script>
                    window.onload=function(){
                        alert("Este servicio ya ha sido creada")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
        }
        else{
            await connect.execute('INSERT INTO servicio (Nombre,Descripcion) VALUES (?,?) ',[Nombre,Descripcion])
            res.status(201).send(`
                <script>
                    window.onload=function(){
                        alert("Servicio Añadido Correctamente")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
                await connect.end()
        }
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})
// Eliminar Servicio
app.post('/Eliminar-Servicio', async (req, res) => {
    const { Nombre } = req.body;

    try {
        const connect = await mysql2.createConnection(db);
    
        // Verificar si la manzana existe (si es necesario)
        const [verificar] = await connect.execute('SELECT * FROM servicio WHERE Nombre=?', [Nombre]);
    
        if (verificar.length > 0) {
            
            await connect.execute('DELETE FROM servicio WHERE Nombre=?', [Nombre]);
            res.status(201).send(`
                <script>
                    window.onload=function(){
                        alert("Servicio Eliminado Correctamente")
                        window.location.href='/Admin.html'
                    }
                </script>
                `)
        } else {
            res.status(404).json({ message: 'Servicio no encontrada' });
        }
    
        await connect.end();
    } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


//mostrar usuarios

app.post('/obtener-usuarios-admin',async(req,res)=>{
    const usuario=req.session.usuario
    try{
        const connect = await mysql2.createConnection(db)
        const [datos] = await connect.execute ('SELECT DISTINCT Nombre, Apellido, NumeroDocumento FROM usuario;')
        
        res.json({
            usuario: datos.map(hijo => ({
                Nombre: hijo.Nombre,
                Apellido: hijo.Apellido,
                NumeroDocumento: hijo.NumeroDocumento,
            }))
        });
        await connect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error)
        res.status(500).send("Pailas")
        return
    }
})

//editar usuario
app.put('/editar-usuario', async(req, res)=>{
    const usuario=req.session.usuario
    try{
        const connect = await mysql2.createConnection(db)
        //sin funciones aun
    }
    catch(error){
        console.error("error al editar usuario")
        res.status(500).send("pailas")
        return
    }

})


//Apertura del servidor 
app.listen(3000,()=>{
    console.log(`Servidor Node.js Escuchando`)
})