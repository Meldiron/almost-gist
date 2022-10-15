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

  const defaultReactionsArray = [];

  const maxAllowedReaction = +req.variables['MAX_ALLOWED_REACTION'];
  for (let i = 0; i <= maxAllowedReaction; i++) {
    defaultReactionsArray.push(0);
  }

  client
    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

  const payload = JSON.parse(req.variables['APPWRITE_FUNCTION_EVENT_DATA']);
  console.log("Document ID:", payload.$id);

  const event = req.variables['APPWRITE_FUNCTION_EVENT'];
  console.log("Event: " + event);

  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];
  console.log("User ID: " + userId);

  const isCreate = event.endsWith('create');
  const isUpdate = event.endsWith('update');
  const isDelete = event.endsWith('delete');

  if (isCreate) {
    console.log("Processing create event.");

    await database.updateDocument("prod", "gists", payload.$id, {
      createdBy: userId ?? undefined,
      reactions: defaultReactionsArray
    });

    res.json({
      success: true,
      type: "create"
    });
    return;
  } else if (isUpdate) {
    console.log("Processing update event.");

    const newReactions = [];

    for (let index = 0; index <= maxAllowedReaction; index++) {
      const response = await database.listDocuments("prod", "reactions", [
        Query.equal("resourceId", payload.$id),
        Query.equal("resourceType", "gists"),
        Query.equal("reactionIndex", index),
        Query.limit(1)
      ]);

      const totalReactions = response.total;
      newReactions.push(totalReactions);
    }

    const totalReactionsOld = payload.reactions.reduce((value, current) => value + current, 0);
    const totalReactionsNew = newReactions.reduce((value, current) => value + current, 0);

    const userOld = payload.createdBy;
    const userNew = userId;

    console.log(totalReactionsOld, " | ", totalReactionsNew);
    console.log(userOld, " | ", userNew);

    if (totalReactionsOld !== totalReactionsNew || (userOld !== userNew && userNew)) {
      console.log("Updating again, values changed");

      await database.updateDocument("prod", "gists", payload.$id, {
        createdBy: userId ?? undefined,
        reactions: newReactions
      });

    } else {
      console.log("Skipping update, values did not change.");
    }

    res.json({
      success: true,
      type: "update"
    });
    return;
  } else if (isDelete) {
    console.log("Processing delete event.");

    const getAllPages = async (collectionId, queries, cursor = null) => {
      const currentQueries = [
        ...queries,
        Query.limit(100)
      ];

      if (cursor) {
        currentQueries.push(Query.cursorAfter(cursor));
      }

      const response = await database.listDocuments("prod", collectionId, currentQueries);

      if (response.documents.length < 100) {
        return response.documents;
      }

      const nextCursor = response.documents[response.documents.length - 1];

      return [
        ...response.documents,
        ...(await getAllPages(collectionId, queries, nextCursor))
      ]
    }

    const gistReactions = await getAllPages("reactions", [
      Query.equal("resourceType", "gists"),
      Query.equal("resourceId", payload.$id)
    ]);

    console.log("Processing ", gistReactions.length, " gist reactions.");

    for (const reaction of gistReactions) {
      await database.deleteDocument("prod", "reactions", reaction.$id);
    }

    const comments = await getAllPages("comments", [Query.equal("gistId", payload.$id)]);

    console.log("Processing ", comments.length, " comments.");

    for (const comment of comments) {
      const reactions = await getAllPages("reactions", [
        Query.equal("resourceType", "comments"),
        Query.equal("resourceId", comment.$id)
      ]);

      console.log("Processing ", reactions.length, " comment reactions");

      for (const reaction of reactions) {
        await database.deleteDocument("prod", "reactions", reaction.$id);
      }

      await database.deleteDocument("prod", "comments", comment.$id);
    }

    res.json({
      success: true,
      type: "delete"
    });
    return;
  }

  res.json({
    success: false,
    message: "Event not recognized."
  });
};
