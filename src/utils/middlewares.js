// check if body is not empty and that sent data are in JSON format
export const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res
      .status(400)
      .json({ error: "The sent data must necessarily be in JSON format" });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: "Missing json data" });
  } else {
    next();
  }
}

// check if inserted parameter is not a number
export const isParamANumber = (req, res, next) => {
  if(isNaN(req.params.slug)) {
    res.status(400).send({ error: "The parameter in the request URL must necessarly be a number!" });
  } else {
    next();
  }
}

// check if the 'date' parameter passed via query string is correctly formatted
export const IsQueryParametersDateValid = (req, res, next) => {
  const controlRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (req.query.date) {
  if(!controlRegex.test(req.query.date)) {
    res.status(400).send({ error: "The date parameter must be a string in YYYY-MM-DD format" });
    return;
  }
} 
next();
}

// check if the 'author_id' parameter passed via query string is correctly formatted
export const IsQueryParametersAuthorIdValid = (req, res, next) => {
  if (req.query.author_id) {
    if(isNaN(req.query.author_id)) {
      res.status(400).send({ error: "The author_id in the query parameters must necessarly be a number!" });
      return;
    }
  }
next();
}

// check if the 'city' parameter passed via query string is correctly formatted
export const IsQueryParametersCityValid = (req, res, next) => {
  if (req.query.city) {
    if(req.query.city.trim() === '' || req.query.city === null) {
      res.status(400).send({ error: "The city in the query parameters must necessarly be a not empty string!"});
      return;
    }
  }
next();
}

// check if the type of the interaction is a 'like' or a 'comment'
export const isAvailableInteraction = (req, res, next) => { 
  let { type } = req.body;
  type = type.toLowerCase();
  if ( type !== "like" && type !== "comment") {
    res.status(400).send({ error: "Interaction's type must necessarly be a Like or a Comment!"});
  } else {
    next();
  }
}