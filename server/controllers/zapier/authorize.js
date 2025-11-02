// controllers/zapier/authorize.js

const url = require("url");

const buildUrl = (base, options, hash) => {
  const newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }

  Object.keys(options).forEach((key) => {
    newUrl.query[key] = options[key];
  });
  if (hash) {
    newUrl.hash = hash;
  }
  return url.format(newUrl);
};

module.exports = {
  authorize: (req, res) => {
    const redirectParam = encodeURIComponent(JSON.stringify(req.query || {}));

    const frontendApproveUrl = buildUrl(
      // change this to your frontend approve URL
      `http://localhost:5173/zapier/authorize`,
      {
        redirect: redirectParam,
      },
    );

    return res.redirect(frontendApproveUrl);
  },
};
