const express = require ('express')
const Team = require ('./models/team')
const mongoose = require('mongoose')
////////////////////

const app = express()
const port = process.env.PORT 
////////////////////////
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
/////////////////////////
app.use(express.json())

app.post('/team', async (req, res) => {
    const team = new Team(req.body)

    try {
        await team.save()
        res.status(201).send({team})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/search', async (req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }
    const search = req.query
    
    try {
    if (req.query.name)
    {
        const team = await Team.find({name: {$regex: req.query.name, $options: '$i'}})
        return res.send(team)
    }
    const team = await Team.find(search)
    .sort(sort)
    .limit(parseInt(req.query.limit))
    .skip(parseInt(req.query.skip))
    
    if (team.length === 0){
        return res.status(400).send('No data found!')
    }

    res.send(team) 
    } catch (e) {
        res.send()
    }

})

app.get('/team', async (req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }
    const match = {}
    if (req.query.search) {
        const parts = req.query.search.split('=')
        match[parts[0]] = parts[1] 
    }

    try {
        const team = await Team.find(match)
        .sort(sort)
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        if (team.length === 0){
            return res.status(400).send('No data found!')
        }

        res.send(team)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/team/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const team = await Team.findOne({_id})
        if (!team) {
            return res.status(404).send()
        }
        res.send(team)
    } catch (e) {
        res.status(500).send()
    }
})

app.patch('/team/:id', async (req, res) => {
    const updates = Object.keys(req.body)

    try {
        const team = await Team.findOne({_id: req.params.id})
        if (!team) {
            res.status(404).send()
        }

        updates.forEach((update) => team[update] = req.body[update])
        await team.save()
        res.send(team)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete('/team/:id', async (req, res) => {
    try {
        const team = await Team.findOneAndDelete({_id: req.params.id})

        if (!team) {
            return res.status (404).send()
        }

        res.send(team)
    } catch (e) {
        res.status(500).send()
    }
})

app.delete('/team', async (req, res) => {

    
    try {
        const team = await Team.deleteMany({})
        res.send(team)
    } catch (e) {
        res.status(500).send()
        
    }
})

///////////////////////////////////

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})




