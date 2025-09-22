//i copy dis from my bed needa changed
const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);
    const SQLSTATEMENT = `
    
      DROP TABLE IF EXISTS Reviews;
      DROP TABLE IF EXISTS Pet;
      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS FitnessChallenge;
      DROP TABLE IF EXISTS UserCompletion;
      
      
      

      CREATE TABLE User (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username TEXT,
      skillpoints INT,
      password TEXT NOT NULL   ,
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      email TEXT NOT NULL
      );

      CREATE TABLE FitnessChallenge (
      challenge_id INT AUTO_INCREMENT PRIMARY KEY,
      creator_id INT NOT NULL,
      challenge TEXT NOT NULL,
      skillpoints INT NOT NULL
      );

      INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints)
      VALUES
      (1, 'Complete 2.4km within 15 minutes', 50),
      (1, 'Cycle around the island for at least 50km', 100),
      (2, 'Complete a full marathon (42.2km)', 200),
      (2, 'Hold a plank for 5 minutes', 50),
      (2, 'Perform 100 push-ups in one session', 75);


      CREATE TABLE UserCompletion (
      complete_id INT AUTO_INCREMENT PRIMARY KEY,
      challenge_id INT NOT NULL,
      user_id INT NOT NULL,
      completed BOOL NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
      );




    
      
      CREATE TABLE Reviews (
      review_id INT AUTO_INCREMENT PRIMARY KEY,
      challenge_id INT NOT NULL,
      user_id INT NOT NULL,
      review_amt INT NOT NULL,
      review TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id),
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      );







      CREATE TABLE Pet (
      pet_id INT AUTO_INCREMENT PRIMARY KEY,
      owner_id INT NOT NULL,
      rarity ENUM('Common', 'Rare', 'Mythic') NOT NULL,
      overall_existence_value INT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES User(user_id)
      );

      `;
    pool.query(SQLSTATEMENT, callback);
  }
});




