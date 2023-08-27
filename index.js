import express from 'express';
import { createClient } from '@supabase/supabase-js'
import morgan from 'morgan'
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from "dotenv";

const app = express();
dotenv.config();


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select()
        res.send(data).status(200).end();
    } catch (error) {
        res.status(404).send(error).end()
    }

});

app.get('/products/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select()
            .is('id', req.params.id)
        res.send(data).status(200).end();
    } catch (error) {
        res.status(404).send(error).end()

    }

});

app.post('/products', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .insert({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
            })
        res.send("created!!").status(200).end();

    } catch (error) {
        res.status(404).send(error).end()
    }

});

app.put('/products/:id', async (req, res) => {

    try {
        const { error } = await supabase
            .from('products')
            .update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            })
            .eq('id', req.params.id)
        res.send("updated: ", req.params.id).status(200).end();

    } catch (error) {
        res.status(404).send(error).end()

    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id)
        res.send("deleted: ", req.params.id).status(200).end();

    } catch (error) {
        res.status(404).send(error).end()

    }
});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.all("*", (req, res) => res.status(404).send("Page not found"))


app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});


module.exports = app