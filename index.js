const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const { supabase } = require("./config/supabase.js")
const { openai } = require("./config/openai.js")


const app = express();


// using morgan for logs
app.use(morgan('combined'));


app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use(cors());


app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select()

        res.json(
            { code: 200, message: "success", data: data, db_error: error }
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
            .select("*")
            .eq("id", req.params.id)

        res.json(
            { code: 200, message: "get", data: data }
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
            { code: 200, message: "created" }
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

app.post('/chatgpt', async (req, res) => {
    try {
        const { content } = req.body

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: content }],
            model: 'gpt-3.5-turbo',
        });

        res.json(
            { code: 200, message: completion }
        )
        res.status(200).end();
    } catch (error) {
        res.status(404).send(error).end()
    }
});

app.get('/chatgpt-test', async (req, res) => {
    try {

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: "hi, where are you from?" }],
            model: 'gpt-3.5-turbo',
        });

        res.json(
            { code: 200, message: completion }
        )
        res.status(200).end();
    } catch (error) {
        res.status(404).send(error).end()
    }
});

app.all("*", (req, res) => res.status(404).send("Page not found"))


app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});



module.exports = app



