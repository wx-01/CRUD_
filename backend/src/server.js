import express from 'express';
import cors from 'cors';
import { getStudent,getStudents,postStudent,deleteStudent} from './database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
const frontendBuildPath = join(__dirname, '../../frontend/dist');
app.use(express.static(frontendBuildPath));


app.get('/students',async (req,res)=>{
          const students =await getStudents(req.body);
          res.json(students)
})
app.post('/students',async (req,res)=>{
const students =await postStudent(req.body);
    console.log(students);
    res.send('ok')
})

app.delete('/students/:id', async (req, res) => {
          const { id } = req.params; // get the id from URL
          try {
            const result = await deleteStudent(id); // call function to delete
            res.json({ message: 'Student deleted successfully', result });
          } catch (err) {
            console.error("Delete error:", err);
            res.status(500).json({ error: "Failed to delete student" });
          }
        });
        


app.listen(8081,()=>{
console.log("listening..")

})