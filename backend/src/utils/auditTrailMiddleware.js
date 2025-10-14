const { createNamespace } = require('cls-hooked');
const { parseEntityAndAction } = require('./parseEntityAndAction');

const auditTrailNs = createNamespace('audit-trail');

const auditTrailMiddleware = (req, res, next) => {
  const { body, params, query, originalUrl, method } = req;
  const combineData = { ...body, ...params, ...query };
  const result = parseEntityAndAction(method, originalUrl);

  auditTrailNs.run(() => {
    auditTrailNs.set('data', combineData);
    auditTrailNs.set('params', params);
    auditTrailNs.set('query', query);
    auditTrailNs.set('originalUrl', originalUrl);
    auditTrailNs.set('method', method);
    auditTrailNs.set('action', result?.action);
    auditTrailNs.set('entity', result?.entity);
    next();
  });
};

const getAuditTrail = (keyname) => {
  return auditTrailNs.get(keyname);
};

module.exports = { auditTrailMiddleware, getAuditTrail };

