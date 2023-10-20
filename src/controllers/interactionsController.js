// IMPORTS
import pool from '../utils/dbPool.js';

//
// READ
//
export async function getAllInteractions(req, res) {
  try {
    // query to DB
    const [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions`");
    // check if we get results
    if (interactions.length > 0) {
      res.status(200).json({message: "Here are all the interactions currently present on the app!", interactions});
    } else {
      res.status(404).json({message: "There are still no interactions on the app!"});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message})
  }
}

export async function getAllInteractionsOfAPost(req, res) {
  // take post id from params
  const post_id = Number(req.params.slug);
  try {
    //query to DB
    const [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions` WHERE `post_id` = ? ORDER BY `created_at` DESC", [post_id]);
    // check if we get results
    if (interactions.length > 0) {
      res.status(200).json({message: "Here is the list of interactions of the selected Post!", count: interactions.length, interactions});
    } else {
      res.status(404).json({ message: "The selected Post has no interactions yet!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message})
  }
}

//
// CREATE
//
export async function createNewInteraction(req, res) {
  // take data from request body
  let { type, author_id, post_id, content } = req.body;
  try {
    // control if each data is in correct format
    if (typeof(type) !== "string" || type.trim() === "") {
      res.status(400).json({error: "Enter all the required parameters to create a new interaction! Interaction's type must necessarly be a not empty string!"});
      return;
    } else if (isNaN(author_id)) {
      res.status(400).json({error: "Enter all the required parameters to create a new interaction! author_id must necessarly be a number!"});
      return;
    } else if (isNaN(post_id)) {
      res.status(400).json({error: "Enter all the required parameters to create a new interaction! post_id must necessarly be a number!"});
      return;
    }
    // control if the author of the interaction is an existing user
    const [user] = await pool.query("SELECT `id`, `nickname`, `age`, `city` FROM `users` where `id` = ?", [author_id]);
    if (!user[0]) {
      res.status(400).json({error: "Can't create a new interaction. The author of the interaction doesn't exist!"});
      return;
    }

    // control if the post where we are trying to append the interaction exists
    const [post] = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM `posts` WHERE `id` = ? ORDER BY `created_at` DESC LIMIT 1", [post_id]);
    if (!post[0]) {
      res.status(400).json({error: "Can't create a new interaction. The post where the interaction is being appended doesn't exist!"});
      return;
    }

    type = type.toLowerCase();
    // different behavior based on type of interaction
    if (type === 'comment') {
      // if interaction is a comment, we check if content is in correct format
      if(content === null || typeof(content) !== "string" || content.trim() === '') {
        res.status(400).json({error: "A comment must necessarly be a not empty string!"});
        return;
      }
      // if content is in correct format, we insert data into DB
      await pool.query("INSERT INTO `interactions` (`type`, `author_id`, `post_id`, `content`) VALUES (?, ?, ?, ?)", [type, author_id, post_id, content]);
    } else if (type === 'like'){
      // check if content is not null
      if(content !== null) {
        res.status(400).json({error: "A like can't have content different from null!"});
        return;
      }
      // check if the like we are trying to create already exists
      const [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions` WHERE `post_id` = ? AND `author_id` = ? ORDER BY `created_at` DESC", [post_id, author_id]);
      for (let interaction of interactions) {
        if (interaction.type.toLowerCase() === 'like') {
          res.status(400).json({error: "A user can't like a post more than once. This like already exists!"});
          return;
        }
      }
      // if there isn't already a like associated at the selected user and linked at the selected post, we create it
      await pool.query("INSERT INTO `interactions` (`type`, `author_id`, `post_id`, `content`) VALUES (?, ?, ?, ?)", [type, author_id, post_id, content]);
    }
    res.status(200).json({message: `Interaction of type ${type} successfully created!`})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//
// UPDATE
//
export async function updateInteraction(req, res) {
  // take data from request's body and parameters
  const interaction_id = Number(req.params.slug);
  let { type, author_id, content } = req.body;
  try {
    // check if author id is not a number
    if (isNaN(author_id)) {
      res.status(400).json({error: "Enter all the required parameters to update an interaction! author_id must necessarly be a number!"});
      return;
    }
    type = type.toLowerCase();
    // different behavior based on type of interaction
    if (type === "comment") {
      // if we are trying to update an interaction to a 'comment', check is content is in good format
      if(content === null || typeof(content) !== "string" || content.trim() === "") {
        res.status(400).json({error: "A comment must necessarly be a not empty string!"});
        return;
      }
      // if content of the comment is in good format, we try to update the interaction with a query to DB
      const [rows, fields] = await pool.query("UPDATE `interactions` SET `updated_at` = NOW(), `content` = ? WHERE `id` = ? AND `author_id` = ? AND `type` IN ('comment', 'Comment')", [content, interaction_id, author_id]);
      // if there are no affected rows, it means that the interaction itself doesn't exist
      if (rows.affectedRows === 0) {
        res.status(400).json({error: "Can't update the interaction. Selected Interaction doesn't exist!"})
        return;
      }
      res.status(200).json({message: "Comment updated successfully!"})
    } else if (type === "like"){
      // if we are trying to update an interaction to a 'like', we send an error.
      // This line also prevents the change of type of the existing interactions on DB.
        res.status(400).json({error: "Error. A like can't be updated!"})
      }
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//
// DESTROY
//
export async function deleteInteraction(req, res) {
  // take data from request's body and parameters
  const interaction_id = Number(req.params.slug);
  const {author_id} = req.body;
  try {
    // check if author id is not a number
    if (isNaN(author_id)) {
      res.status(400).json({error: "Enter all the required parameters to delete an interaction! author_id must necessarly be a number!"});
      return;
    }
    // if author id is in correct format, we try to delete the interaction with a query to DB
    let [rows, fields] = await pool.query("DELETE FROM `interactions` WHERE `id` = ? AND `author_id` = ?", [interaction_id, author_id]);
    // if there are no affected rows, it means that the interaction itself doesn't exist
    if (rows.affectedRows === 0) {
      res.status(404).json({error: "Can't delete the interaction. The selected Interaction doesn't already exist!"})
      return;
    } 
      res.status(200).json({message: 'Interaction successfully deleted!'})
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}