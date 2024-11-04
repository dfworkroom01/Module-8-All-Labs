const { MongoClient, ObjectId } = require("mongodb");

async function main() {
  const url = "mongodb://localhost:27017";
  const client = new MongoClient(url);

  try {
    await client.connect();

    // Create or get the database
    const database = client.db("BloggingApp");

    // Create collections
    const usersCollection = database.collection("users");
    const postsCollection = database.collection("posts");

    // Insert users
    const users = [
      {
        username: "Bree Cayne",
        email: "bree@example.com",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "dean_88",
        email: "dean88@example.com",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Wilma_wong",
        email: "wilma@example.com",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const userResults = await usersCollection.insertMany(users);
    console.log(
      `${userResults.insertedCount} users were inserted with the following IDs:`
    );
    console.log(userResults.insertedIds);

    // Insert posts
    const posts = [
      {
        userId: userResults.insertedIds[0],
        title: "Hi There",
        description: "I am new in this blog",
        imageUrl: "http://example.com/image1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userResults.insertedIds[1], // dean's ID
        title: "What a Life",
        description: "I am new too",
        imageUrl: "http://example.com/image2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userResults.insertedIds[2], // wilma's ID
        title: "Hobby?",
        description: "I am new too, anyone interested about cooking a retro dish?",
        imageUrl: "http://example.com/image3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const postResults = await postsCollection.insertMany(posts);
    console.log(
      `${postResults.insertedCount} posts were inserted with the following IDs:`
    );
    console.log(postResults.insertedIds);

    // To add likes to the first post
    await postsCollection.updateOne(
      { _id: postResults.insertedIds[0] },
      { $addToSet: { likes: userResults.insertedIds[1] } } // dean88 like the first post
    );

    console.log("Added a like from dean88 to the first post.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
