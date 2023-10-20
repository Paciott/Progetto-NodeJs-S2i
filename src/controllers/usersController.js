// IMPORTS
import pool from '../utils/dbPool.js';

//
// READ
//
export async function getAllUsers(req, res) {
  try {
    // query to get users on DB
    const [users] = await pool.query("SELECT `id`, `nickname`, `age`, `city` FROM `users`");
    // if the query gives back users, we display them
    if (users.length > 0) {
      res.status(200).json({message: "Here is the registered users list!", users});
    } else {
      res.status(404).json({message: "No user is registered to the app yet!"});
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

export async function getUserById(req, res) {
  // take data from request's parameters
  const user_id = Number(req.params.slug);
  try {
    // query to get the user by ID
    let [user] = await pool.query("SELECT `id`, `nickname`, `age`, `city` FROM `users` where `id` = ?", [user_id]);
    user = user[0];
    // if the query gives back a user, we display it
    if (user) {
      res.status(200).json({message: "Here is the selected user!", user});
    } else {
      res.status(404).json({message: "No user found!"});
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

//
// CREATE
//
export async function createNewUser(req, res) {
  // take data from request's parameters
  let { nickname, age, city } = req.body;
  try {
    // check if data from body are correctly formatted
    if (typeof(nickname) !== "string" || nickname.trim() === "") {
      res.status(400).json({error: "Enter all the required parameters to create a new user! Nickname must necessarily be a not empty string!"});
      return;
    } else if (isNaN(age) || age <= 0) {
      res.status(400).json({error: "Enter all the required parameters to create a new user! Age must necessarily be a number greater than zero!"});
      return;
    } else if (typeof(city) !== "string" || city.trim() === "") {
      res.status(400).json({error: "Enter all the required parameters to create a new user! City must necessarily be a not empty string!"});
      return;
    }
    city = city.toLowerCase();
    // query to insert the new user into DB
    await pool.query("INSERT INTO `users` (`nickname`, `age`, `city`) VALUES (?, ?, ?)", [nickname, age, city]);
    res.status(200).json({message: "User was created successfully!"})
  } catch (error) {
    // custom error to notify that the chosen nickname is already used
    if (error.code === 'ER_DUP_ENTRY') {
      error.message = "Sorry, the selected nickname it's already used";
    }
    res.status(400).json({ error: error.message });
  }
}

//
// UPDATE
//
export async function updateUser(req, res) {
  // take data from request's parameters and body
  let { nickname, age, city } = req.body;
  const user_id = Number(req.params.slug);
  try {
    // check if data from body are correctly formatted
    if (nickname === "" || typeof(nickname) !== "string") {
      res.status(400).json({error: "Enter all the required parameters to update an existing user! Nickname must necessarily be a not empty string!"});
      return;
    } else if (isNaN(age) || age <= 0) {
      res.status(400).json({error: "Enter all the required parameters to update an existing user! Age must necessarily be a number greater than zero!"});
      return;
    } else if (typeof(city) !== "string" || city.trim() === "") {
      res.status(400).json({message: "Enter all the required parameters to update an existing user! City must necessarily be a not empty string!"});
      return;
    }

    city = city.toLowerCase();
    // query to update the existing user
    const [rows, fields] = await pool.query("UPDATE `users` SET `nickname` = ?, `age`= ?, `city`= ? WHERE `id` = ?", [nickname, age, city, user_id]);
    if (rows.affectedRows === 0) {
      // if there are no affected rows, it means that the user doesn't exist on DB
      res.status(400).json({message: "Can't update user. Selected user doesn't exist!"})
      return;
    } 
    res.status(200).json({message: "User updated successfully"});  
  } catch (error) {
    // custom error to notify the update of the nickname field with an already used nickname
    if (error.code === "ER_DUP_ENTRY") {
      error.message = "Sorry, the selected nickname it's already used";
    }
    res.status(400).json({ error: error.message });
  }
}

//
// DESTROY
//
export async function deleteUser(req, res) {
  // take data from request's parameters
  const user_id = Number(req.params.slug);
  try {
    // query to delete selected user
    let [rows, fields] = await pool.query("DELETE FROM `users` WHERE `id` = ?", [user_id]);
  if (rows.affectedRows === 0) {
    // if there are no affected rows, it means that the user doesn't exist on DB
    res.status(404).json({ error: "There is no user to delete with the selected ID"});
    return;
  }
    res.status(200).json({message: "User successfully deleted!"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}