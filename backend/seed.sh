appwrite databases createDocument --databaseId prod --collectionId gists --documentId 'homepage' --data '{"name": "README.md","content":"# Welcome 👋\n\nSign in with GitHub to start creating new gists."}'

appwrite databases createDocument --databaseId prod --collectionId comments --documentId 'unique()' --data '{"gistId": "homepage","content":"**Cant wait** to start using `this website`! 🎉"}'