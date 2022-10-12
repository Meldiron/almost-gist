const { Databases, Client, Query, ID, Permission, Role } = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new Client();
  const database = new Databases(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['MAX_ALLOWED_REACTION']
  ) {
    res.json({
      success: false,
      message: "Function was not set up properly."
    });
    return;
  }

  client
    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];
  console.log("User ID", userId);

  let payload;

  try {
    payload = JSON.parse(req.payload ?? '{}');
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Function payload could not be parsed."
    });
    return;
  }

  if (!payload.resourceId || (!payload.reactionIndex && payload.reactionIndex !== 0) || !payload.resourceType) {
    res.json({
      success: false,
      message: "Function payload is missing properties."
    });
    return;
  }

  const { resourceId, resourceType, reactionIndex } = payload;

  console.log("Resource ID", resourceId);
  console.log("Resource Type", resourceType);
  console.log("Reaction Index", reactionIndex);

  const maxAllowedReaction = +req.variables['MAX_ALLOWED_REACTION'];

  if (reactionIndex < 0 || reactionIndex > maxAllowedReaction) {
    res.json({
      success: false,
      message: "Reaction not supported."
    });
    return;
  }

  const serach = await database.listDocuments("prod", "reactions", [
    Query.equal("userId", userId),
    Query.equal("resourceId", resourceId),
    Query.equal("resourceType", resourceType),
    Query.equal("reactionIndex", reactionIndex),
    Query.limit(1)
  ]);

  const didReactAlready = serach.documents.length > 0;

  console.log("Did React", didReactAlready);

  if (didReactAlready) {
    const reactionId = serach.documents[0].$id;
    await database.deleteDocument("prod", "reactions", reactionId);
  } else {
    await database.createDocument("prod", "reactions", ID.unique(), {
      userId,
      resourceId,
      resourceType,
      reactionIndex
    }, [
      Permission.read(Role.user(userId)),
    ])
  }

  console.log("Updating " + resourceType + " attribute");

  const newReactions = [];

  for (let index = 0; index <= maxAllowedReaction; index++) {
    const response = await database.listDocuments("prod", "reactions", [
      Query.equal("resourceId", resourceId),
      Query.equal("resourceType", resourceType),
      Query.equal("reactionIndex", index),
      Query.limit(1)
    ]);

    const totalReactions = response.total;
    newReactions.push(totalReactions);
  }

  await database.updateDocument("prod", resourceType, resourceId, {
    reactions: newReactions
  });

  console.log("Done");

  res.json({
    success: true,
  });
};
