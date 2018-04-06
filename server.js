const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const aDb = require('./data/helpers/actionModel.js');
const pDb = require('./data/helpers/projectModel.js');

const server = express();


function logger(req, res, next) {
    console.log('body: ', req.body);

    next();
}

// middleware
server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());
server.use(logger);

server.get('/api', function(req, res){
    res.json({ api: 'Running...'})
})


server.get('/api/project', (req, res) => {
    pDb
    .get()
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(error => {
        res.error(500).json({error: 'Found no projects.'})
    })
})

server.post('/api/project', (req, res) => {
    const { name, description } = req.body
    const newProj = { name, description }
    if(newProj.name.length < 0 || newProj.name.length > 128){
        res.error(404).json({error: 'Keep your name text between 1-128 characters'})
    }
    if(newProj.description < 0 || newProj.description > 128){
        res.error(404).json({error: 'Keep your description text between 1-128 characters'})
    }

    else{


    pDb
    .insert(newProj)
    .then(newP => {
        res.status(201).json(newP)
    })
    .catch(error => {
        res.error(500).json({error: 'Project could not be added.'})
    })
}

})

server.get('/api/project/:projId', (req, res) => {
    const {projId} = req.params;

    pDb
    .get(projId)
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(error => {
        res.error(500).json({error: 'That project does not exist.'})
    })
})

server.put('/api/project/:projId', (req, res) => {
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
            res.error(500).json({error: `Project ${projId} could not be updated :(.`})
        
    })}
})

server.delete('/api/project/:projId', (req, res) => {
    const {projId} = req.params;

    pDb
    .remove(projId)
    .then(del => {
        res.status(200).json({message: `Project ${projId} was deleted.`})
    })
    .catch(error => {
        res.error(500).json({error: 'The project could not be deleted.'})
    })
})

// server.get('/api/project/:projId/actions', (req, res) => {
//     const {projId} = req.params;

//     pDb
//     .getProjectActions(projId)
//     .then(acts => {
//         res.status(200).json(acts)
//     })
//     .catch(error => {
//         res.error(500).json({error: 'That project has no actions.'})
//     })
// })

// server.post('/api/project/:projId/actions', (req, res) => {
//     const {description} = req.body;
//     const {projId} = req.params;
    
//     aDb
//     .insert(projId, description)
//     .then(desc => {
//         res.status(200).json(desc)
//     })
//     .catch(error => {
//         res.status(500).json({error: 'Could not post an action.'})
//     })

// })

// server.put('/api/project/:projId/actions/:actionId', (req, res) => {
//     const {description} = req.body;
//     const {projId} = req.params;
//     const {actId} = req.params;

//     aDb
//     .update(actId, description)
//     .then(updated => {
//         res.status(200).json({message: `Action ${actId} has been updated.`})
//     })
//     .catch(error =>{
//         res.status(500).json({error: `Action ${actId} could not be updated.`})
//     })
// })

// server.delete('/api/project/:projId/actions/:actionId', (req, res) => {
//     const {projId} = req.params;
//     const {actId} = req.params;

//     aDb
//     .remove(actId)
//     .then(del => {
//         res.status(200).json({message: `Action ${actId} was deleted.`})
//     })
//     .catch(error => {
//         res.status(500).json({error: 'Action not deleted.'})
//     })
// })

server.get('/api/actions', (req, res) => {
    aDb
    .get()
    .then(act => {
        res.status(200).json(act)
    })
    .catch(error => {
        res.status(500).json({error: 'Your search produced no acters.'})
    })
})

server.post('/api/actions', (req, res) => {
    // const {description, notes, completed} = req.body;
    // const {projId} = req.params;

    // const newAct = {description, notes, completed}

    const newAct = req.body

    
    aDb
    .insert( newAct)
    .then(desc => {
        res.status(200).json(desc)
    })
    .catch(error => {
        res.status(500).json({error: 'Could not post an action.'})
    })

})

server.get('/api/actions/:actId', (req, res) => {
    const {actId} = req.params
    aDb
    .get(actId)
    .then(aId => {
        res.status(200).json(aId)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

server.delete('/api/actions/:id', (req, res) => {
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

server.put('/api/actions/:id', (req, res) => {
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



// server.get('/api/actions/projact/:projId', (req, res) => {
//     const {projId} = req.params;

//     pDb
//     .getProjectActions(projId)
//     .then(acts => {
//         res.status(200).json(acts)
//     })
//     .catch(error => {
//         res.error(500).json({error: 'That project has no actions.'})
//     })
// })





const port = 5000;
server.listen(port, () => console.log('API running on port 5000'))