const express = require('express')

const router = express.Router();

const pDb = require('../data/helpers/projectModel.js')

router.get('/', (req, res) => {
    pDb
    .get()
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(error => {
        res.status(500).json({error: 'Found no projects.'})
    })
})

router.post('/', (req, res) => {
    const { name, description } = req.body
    const newProj = { name, description }
    if(newProj.name.length < 0 || newProj.name.length > 128){
        res.status(404).json({error: 'Keep your name text between 1-128 characters'})
    }
    if(newProj.description < 0 || newProj.description > 128){
        res.status(404).json({error: 'Keep your description text between 1-128 characters'})
    }

    else{


    pDb
    .insert(newProj)
    .then(newP => {
        res.status(201).json(newP)
    })
    .catch(error => {
        res.status(500).json({error: 'Project could not be added.'})
    })
}

})

router.get('/:projId', (req, res) => {
    const {projId} = req.params;
    if (projId === undefined){
        res.status(404).json({message:'That project doesnt exist dude.'})
    }else{
    pDb
    .get(projId)
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(error => {
        res.status(500).json({error: 'That project does not exist dude.'})
    })
}
})

router.put('/:projId', (req, res) => {
    const {projId} = req.params;
    const { name, description } = req.body;

    const projUp = { name, description };

    if(projId < 0){
        res.status(404).json({message: 'Please enter a valid project ID to update.'})
    }
    else{

    pDb
    .update(projId, projUp)
    .then(updated => {
        res.status(200).json({message: `Project ${projId} has been updated.`}) 
    })

    .catch(error => {
            res.status(500).json({error: `Project ${projId} could not be updated :(.`})
        
    })}
})

router.delete('/:projId', (req, res) => {
    const {projId} = req.params;

    pDb
    .remove(projId)
    .then(del => {
        res.status(200).json({message: `Project ${projId} was deleted.`})
    })
    .catch(error => {
        res.status(500).json({error: 'The project could not be deleted.'})
    })
})

module.exports = router;