const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();
app.use(cors());
app.use(express.json());

/*
 * Métodos HTTP:
 *
 * GET: Buscar informações do back-end,
 * POST: Criar uma informação no back-end,
 * PUT/PATCH: Alterar uma informação no back-end,
 * DELETE: Deletar uma informação no back-end.
 */

/*
 * Tipos de parâmetros:
 *
 * Query Params: Filtros e paginação,
 * Route Params: Identificar recursos (Atualizar/Deletar),
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON).
 */

/*
 * Middleware:
 *
 * Interceptador de requisições, pode interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequest(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);
  return next();
}

app.use(logRequest);

app.get('/projects', (req, res, next) => {
  const { title, owner } = req.query;

  const results = title ? projects.filter((project) => project.title.includes(title)) : projects;

  return res.json(results);
});

app.post('/projects', (req, res, next) => {
  const { title, owner } = req.body;

  const project = { id: uuid(), title, owner };
  projects.push(project);

  return res.json(project);
});

app.put('/projects/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete('/projects/:id', (req, res, next) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);

  return res.status(204).send();
});

app.listen(3333, () => {
  console.log('Server ON! 🟢');
});
