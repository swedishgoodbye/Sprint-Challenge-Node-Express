const express = require('express')

const router = express.Router();

const aDb = require('../data/helpers/actionModel.js')

router.get('/', (req, res) => {
    aDb
    .get()
    .then(act => {
        res.status(200).json(act)
    })
    .catch(error => {
        res.status(500).json({error: 'Your search produced no acters.'})
    })
})

router.post('/', (req, res) => {
    // const {description, notes, completed} = req.body;
    // const {projId} = req.params;

    // const newAct = {description, notes, completed}

    const newAct = req.body

    
    aDb
    .insert(newAct)
    .then(desc => {
        res.status(200).json(desc)
    })
    .catch(error => {
        res.status(500).json({error: 'Could not post an action.'})
    })

})

router.get('/:id', (req, res) => {
    const {id} = req.params
    aDb
    .get(id)
    .then(aId => {
        res.status(200).json(aId)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    aDb
    .remove(id)
    .then(del => {
        res.status(200).json({message: `Action ${id} was deleted.`})
    })
    .catch(error => {
        res.status(500).json({error: 'Action not deleted.'})
    })
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const newAct = req.body;

    aDb
    .update(id, newAct)
    .then(upD => {
        res.status(200).json({message: `Action ${id} was updated.`})
    })
    .catch(error => {
        res.status(500).json({error: 'Action not updated'})
    })
})



module.exports = router;