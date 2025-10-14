const express = require('express');
const TeamController = require('./team.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./team.validation');

const router = express.Router();

router.post(
  '/',
  validations.createTeam(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.create)
);

router.get(
  '/',
  RequestWrapper(TeamController.list)
);

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.getById)
);

router.put(
  '/:id',
  validations.updateTeam(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.update)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.remove)
);

router.get(
  '/:id/members',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.getTeamMembers)
);

router.post(
  '/:id/members',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.addMember)
);

router.delete(
  '/:id/members/:userId',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(TeamController.removeMember)
);

module.exports = router;
