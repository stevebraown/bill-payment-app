const requireFields = fields => (req, res, next) => {
  const missing = fields.filter(field => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length) {
    return res.status(400).json({
      error: {
        message: 'Missing required fields',
        fields: missing,
      },
    });
  }

  return next();
};

module.exports = { requireFields };
