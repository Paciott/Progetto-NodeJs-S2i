// IMPORTS
import pool from '../utils/dbPool.js';

//
// READ
//
export async function getAllPosts(req, res) {
  // take data from request's query string
  const author_id = Number(req.query.author_id);
  const date = req.query.date;
  let posts = [];
  try {
    // different behavior based on the data we got
    if (author_id && date) {
      // if we have both author id and date, we search on DB posts made by selected author and made on the selected date
      const res = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM `posts` WHERE `author_id` = ? AND DATE(`created_at`) = ? ORDER BY `created_at` DESC", [author_id, date]);
      posts = res[0];
    } else if (author_id) {
      // if we have only the author id we search on DB posts made by selected author
      const res = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM `posts` WHERE `author_id` = ? ORDER BY `created_at` DESC", [author_id]);
      posts = res[0];
    } else if (date) {
      // if we have only the date we search on DB posts made on the selected date
      const res = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM `posts` WHERE DATE(created_at) = ? ORDER BY `created_at` DESC", [date]);
      posts = res[0];
    } else {
      // if we have no data passed via query string, we fetch all posts unfiltered from DB
      const res = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM posts ORDER BY `created_at` DESC");
      posts = res[0];
    }
    if (posts.length > 0) {
      //if we got posts from DB, we search and append each post's interactions
      for (let post of posts) {
        let [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions` WHERE `post_id` = ?", [post.id]);
        post.interactions = interactions;
      }
      res.status(200).json({message: "Here is the requested posts list", count: posts.length, posts});
    } else {
      res.status(404).json({ message: "No posts found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getPostById(req, res) {
  // take data from request's query string and params
  const post_id = Number(req.params.slug);
  let interactions_date = req.query.date;
  let interactions_city = req.query.city;
  try {
    // we fetch the post with the passed ID from DB
    let [post] = await pool.query("SELECT `id`, `title`, `created_at`, `updated_at`, `author_id` FROM `posts` WHERE `id` = ? ORDER BY `created_at` DESC LIMIT 1", [post_id]);
    post = post[0];
    // if this post exists, we made different queries based on the data passed via query string in order to filter the post's interactions
    if (post) {
      let interactions = [];
      if (interactions_date && interactions_city) {
        // if we have both interactions date and interactions city, we search the post's interactions matching those two data.
        [interactions] = await pool.query("SELECT `interactions`.`id`, `interactions`.`type`, `interactions`.`created_at`, `interactions`.`updated_at`, `interactions`.`author_id`, `interactions`.`post_id`, `interactions`.`content` FROM `interactions` LEFT JOIN `users` ON `interactions`.`author_id` = `users`.`id` WHERE `interactions`.`post_id` = ? AND DATE(`interactions`.`created_at`) = ? AND `users`.`city` = ?", [post_id, interactions_date, interactions_city]);
      } else if (interactions_date) {
        // if we have only the interactions date, we search the post's interactions matching this data.
        [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions` WHERE `post_id` = ? AND DATE(`created_at`) = ?", [post_id, interactions_date]);
      } else if (interactions_city) {
        // if we have only the interactions city, we search the post's interactions matching this data.
        interactions_city = interactions_city.toLowerCase();
        [interactions] = await pool.query("SELECT `interactions`.`id`, `interactions`.`type`, `interactions`.`created_at`, `interactions`.`updated_at`, `interactions`.`author_id`, `interactions`.`post_id`, `interactions`.`content` FROM `interactions` LEFT JOIN `users` ON `interactions`.`author_id` = `users`.`id` WHERE `users`.`city` = ?", [interactions_city]);
      } else {
        // if we have no data passed via query string, we fetch all interactions unfiltered from DB
        [interactions] = await pool.query("SELECT `id`, `type`, `created_at`, `updated_at`, `author_id`, `post_id`, `content` FROM `interactions` WHERE `post_id` = ?", [post_id]);
      }
      // we append the found interactions under the post
      post.interactions = interactions; 
      res.status(200).json({message: "Here is the chosen post!", post});
    } else {
      res.status(404).json({ message: "No post found with selected ID!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

//
// CREATE
//
export async function createNewPost(req, res) {
  // take data from request's body
  const { title, author_id } = req.body;
  try {
    // check if data from body are correctly formatted
    if (typeof(title) !== "string" || title.trim() === '') {
      res.status(400).json({error: "Please insert all the required parameters for the creation of a Post! Post title must be a not empty string"});
      return;
    } else if (isNaN(author_id)) {
      res.status(400).json({error: "Please insert all the required parameters for the creation of a Post! The post's author_id must be a number!"});
      return;
    }
    // check if the user who is trying to make a new post exists
    const [user] = await pool.query("SELECT `id`, `nickname`, `age`, `city` FROM `users` where `id` = ?", [author_id]);
    if (!user[0]) {
      res.status(400).json({error: "The user who's trying to make a post doesn't exist!"});
      return;
    }
    // if controls are passed, we try to insert the new post in the DB via query
    const [rows, fields] = await pool.execute("INSERT INTO `posts` (`title`, `author_id`) VALUES (?, ?)", [title, author_id]);
    res.status(200).json({message: "Post successfully created!"})
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

//
// UPDATE
//
export async function updatePost(req, res) {
  // take data from request's body and params
  const post_id = req.params.slug;
  const { title, author_id } = req.body;
  try {
    // check if data from body are correctly formatted
    if (typeof(title) !== "string" || title.trim() === '') {
      res.status(400).json({error: "Please insert all the required parameters for the update of a Post! Post title must be a not empty string!"});
      return;
    } else if (isNaN(author_id)) {
      res.status(400).json({error: "Please insert all the required parameters for the update of a Post! The post's author_id must be a number!"});
      return;
    }
    // try to update the post via query DB
    const [rows, fields] = await pool.execute("UPDATE `posts` SET `title` = ?, `updated_at` = NOW() WHERE `id` = ? AND `author_id` = ?", [title, post_id, author_id]);
    if (rows.affectedRows === 0) {
      // if there are no affected rows, it means that the post doesn't exist on DB
      res.status(400).json({error: "Can't update post. Selected Post doesn't exist!"})
      return;
    } 
    res.status(200).json({message: "Post successfully updated!"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

//
// DESTROY
//
export async function deletePost(req, res) {
  // take data from request's body and params
  const post_id = req.params.slug;
  const { author_id } = req.body;
  try {
    // check if author id is not a number
    if (isNaN(author_id)) {
      res.status(400).json({error: "Please insert all the required parameters to delete a Post! The post's author_id must be a number!"});
      return;
    }
    // try to delete the post via query DB
    let [rows, fields] = await pool.execute("DELETE FROM `posts` WHERE `id` = ? AND `author_id` = ?", [post_id, author_id]);
    if (rows.affectedRows === 0) {
    // if there are no affected rows, it means that the post doesn;t exist on DB
      res.status(404).json({error: "Can't delete post. The selected Post doesn't already exist!"});
      return;
    }
    // delete post's interactions via query DB
    [rows, fields] = await pool.execute("DELETE FROM `interactions` WHERE `post_id` = ?", [post_id]);
    res.status(200).json({message: "Post successfully deleted!"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}