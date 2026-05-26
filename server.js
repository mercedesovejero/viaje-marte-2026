require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a MongoDB Atlas usando variable de entorno
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const FormSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  nacimiento: String,
  recluta: String,
  rol: String,
  habilidades: [String],
  motivos: String,
  clave: String,
  fecha: { type: Date, default: Date.now }
});
const Formulario = mongoose.model('Formulario', FormSchema);

// Recibe el formulario
app.post('/api/formulario', async (req, res) => {
  await Formulario.create(req.body);
  res.send('<h2>¡Formulario recibido! Gracias por participar.</h2><a href="/">Volver</a>');
});

// Panel web para ver respuestas
app.get('/panel', async (req, res) => {
  const respuestas = await Formulario.find().sort({ fecha: -1 });
  let html = `<h1>Respuestas de usuarios</h1><table border="1" cellpadding="5"><tr>
  <th>Nombre</th><th>Email</th><th>Nacimiento</th><th>Recluta</th><th>Rol</th><th>Habilidades</th><th>Motivos</th><th>Fecha</th></tr>`;
  respuestas.forEach(r => {
    html += `<tr>
      <td>${r.nombre}</td>
      <td>${r.email}</td>
      <td>${r.nacimiento}</td>
      <td>${r.recluta}</td>
      <td>${r.rol}</td>
      <td>${Array.isArray(r.habilidades) ? r.habilidades.join(', ') : r.habilidades || ''}</td>
      <td>${r.motivos}</td>
      <td>${new Date(r.fecha).toLocaleString()}</td>
    </tr>`;
  });
  html += `</table>`;
  res.send(html);
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));