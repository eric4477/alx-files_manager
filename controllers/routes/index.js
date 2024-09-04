import express from 'express';
import AppController from '../AppController';
import UsersController from '../UsersController';
import AuthController from '../AuthController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller

  // should return if Redis is alive and if the DB is alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // should return the number of users and files in DB
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // User Controller

  // should create a new user in DB
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // New authentication endpoints
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // User retrieval endpoint
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });
}

export default controllerRouting;
