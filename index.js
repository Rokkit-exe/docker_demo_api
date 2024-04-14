import mongoose from 'mongoose';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
config();

const DB_URL = process.env.DB_URL;

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

const todoSchema = new mongoose.Schema(
    {
        Text: {
            type: String,
            required: true
        },
        IsChecked: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Todo = mongoose.model("Todo", todoSchema);

app.get('/todo', async (req, res) => {
    try {
        const todo = await Todo.find();
        return res.status(200).json({ data: todo});
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
});

app.post('/todo', async (req, res) => {
    try {
        const data = req.body;
        console.log(data.message);
        const newtodo = new Todo({
            Text: data.Text,
            IsChecked: data.IsChecked,
        });
        const result = await Todo.create(newtodo);
        console.log(`todo added successfuly!\n${result}`);
        return res.status(201).json({
            result: result,
            data: data,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await Todo.findByIdAndUpdate(id, data, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        console.log(`Todo updated successfuly!\n${result}`);
        return res.status(200).json({ 
                message: 'Todo updated',
                data: result
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
});

app.delete('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Todo.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        console.log(`Todo deleted successfuly!\n${result}`);
        return res.status(200).json({ 
                message: 'Todo deleted',
                data: result
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
});

mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(5000, () => {
            console.log(`Server is listening on port ${5000}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

