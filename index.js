const express = require('express');
const { createClient } = require('@supabase/supabase-js')
const morgan = require('morgan')
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv");

const app = express();
dotenv.config();


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use(cors());

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select()

        res.json(
            { code: 200, message: "success", data: data }
        )
        res.status(200).end();
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

        res.json(
            { code: 200, message: "created", data: data }
        )
        res.status(200).end();
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

        res.json(
            { code: 200, message: "created", data_id: req.params.id }
        )
        res.status(200).end();
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

        res.json(
            { code: 200, message: "updated", data_id: req.params.id }
        )
        res.status(200).end();

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
        res.json(
            { code: 200, message: "deleted", data_id: req.params.id }
        )
        res.status(200).end();

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




exports.app = app