import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());
const PORT = 3000;

// In-memory data store
let students = [];
let idCounter = 1;

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student CRUD API',
      version: '1.0.0',
      description: 'Manage student records with full CRUD operations',
    },
  },
  apis: ['./server.js'], // Swagger annotations in this file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- 🔵 GET all students -------------------- */
/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get the complete list of student records
 *     responses:
 *       200:
 *         description: A list of students
 */
app.get('/students', (req, res) => {
  res.json(students);
});

/* -------------------- 🟢 POST create a student -------------------- */
/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 */
app.post('/students', (req, res) => {
  const student = { id: idCounter++, ...req.body };
  students.push(student);
  res.status(201).json(student);
});

/* -------------------- 🔵 GET student by ID -------------------- */
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Fetch details of a specific student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id == req.params.id);
  student ? res.json(student) : res.status(404).send('Not Found');
});

/* -------------------- 🟡 PUT update student by ID -------------------- */
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Modify the name of an existing student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
app.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  students[index] = { ...students[index], ...req.body };
  res.json(students[index]);
});

/* -------------------- 🔴 DELETE student by ID -------------------- */
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove a student record from the system by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Student deleted successfully
 */
app.delete('/students/:id', (req, res) => {
  students = students.filter(s => s.id != req.params.id);
  res.sendStatus(204);
});

/* -------------------- 🚀 Start Server -------------------- */
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
});