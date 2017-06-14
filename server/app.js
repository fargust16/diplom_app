import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookiesMiddleware from 'universal-cookie-express';
import path from 'path';

import { serverPort } from '../etc/config.json';

import * as db from './utils/DataBaseUtils';

// Initialization of express application
const app = express();
db.setUpConnection();

app.use( bodyParser.json() );
app.use(cors({ origin: '*' }));
app.use(cookiesMiddleware());

app.use(express.static(__dirname + '../public'))

app.get('/competitions', (req, res) => {
    db.listOfComp().then(data => res.send(data))
});

app.post('/competitions', (req, res) => {
    db.addComp(req.body).then(data => res.send(data))
});

app.post('/competitions/start:comp_id', (req, res) => {
    db.startVote(req.params.comp_id, req.body).then(data => res.send(data))
});

app.delete('/competitions/:comp_id', (req, res) => {
    db.deleteComp(req.params.comp_id).then(data => res.send(data))
});


//-------------------------------------- participants


app.get('/participants', (req, res) => {
    db.listOfPart().then(data => res.send(data))
});

app.post('/participants', (req, res) => {
    db.addPart(req.body).then(data => res.send(data))
});

app.post('/participants/:part_id', (req, res) => {
    db.confirmedPart(req.params.part_id).then(data => res.send(data))
});

app.delete('/participants/:comp_id', (req, res) => {
    db.deletePart(req.params.comp_id).then(data => res.send(data))
});


//-------------------------------------- experts


app.get('/experts', (req, res) => {
    db.listOfExperts().then(data => res.send(data))
});

app.post('/experts/auth', (req, res) => {
    db.authExpert(req.body).then(data => res.send(data))
});

app.post('/experts', (req, res) => {
    db.addExpert(req.body).then(data => res.send(data))
});

app.post('/experts/rec:expert_id', (req, res) => {
    db.requestConfirm(req.params.expert_id).then(data => res.send(data))
});

app.post('/experts/conf:expert_id', (req, res) => {
    db.confirmExpert(req.params.expert_id).then(data => res.send(data))
});

app.delete('/experts/:expert_id', (req, res) => {
    db.deleteExpert(req.params.expert_id).then(data => res.send(data))
});

//-------------------------------------- experts

app.get('/voteResults', (req, res) => {
    db.listOfVoteResult().then(data => res.send(data))
});

app.post('/voteResults', (req, res) => {
    db.confirmVote(req.body).then(data => res.send(data))
});



//

const server = app.listen(serverPort, function() {
    console.log(`Server is up and running on port ${serverPort}`)
});