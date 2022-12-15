const { db } = require("../database");
const { isLoggedIn } = require("../lib/auth.js");

const signin = (req, res) => {
  res.render("signin");
};

const credentials = async (req, res) => {
  const { id } = req.user;
 let {isAdmin} = req.params;
 
  if (typeof (isAdmin) == 'undefined') {
    isAdmin = id;  
  } 
    

  try {
    //Backticks (`…`)

    await db
      .query("SELECT role as role FROM users WHERE id = ?", [isAdmin])
      .then(async (rows) => {
        const role = rows[0][0];

        if (role.role == "USER_ROLE") {
          await db
            .query(
              `SELECT 
            users.fullname          as fullname, 
            relatives.name          as name, 
            relatives.lastname      as lastname, 
            relatives.dni           as dni, 
            relatives.created_at    as created_at,
            relatives.relationship  as relationship  
                FROM users 
            INNER JOIN relatives ON users.id = relatives.user_id 
            WHERE 
                users.id = ? 
                and users.active = 1 and
                relatives.active= 1`,
              [isAdmin]
            )
            .then(async (rows) => {
              const credentials = rows[0];

              credentials.map((e) => {
                e.created_at = new Date(e.created_at).toISOString();
                e.created_at =
                  e.created_at.split("T")[0] +
                  " : " +
                  e.created_at.split("T")[1].replace("Z", "");
              });

              return res.status(200).render("credentialsList", { credentials });
            });
        }

        if (role.role == "ADMIN_ROLE"){
                const users = await db.query(`SELECT 
                  id, 
                  username, 
                  fullname, 
                  active 
                FROM users
                WHERE                 
                  users.active = 1` )
                .then( async (users) => {
                    const mainUsers = users[0];                    
                    res.status(200).render("users-crud", {mainUsers})
                })
        }

      });
  } catch (error) {
    console.log(error);
  }
};

const renderRelatives = async (req, res) => {
    const { id } = req.params;
    
    await db.query(
              `SELECT 
            users.fullname          as fullname, 
            users.id                as id,
            relatives.name          as name, 
            relatives.lastname      as lastname, 
            relatives.dni           as dni, 
            relatives.created_at    as created_at,
            relatives.relationship  as relationship,  
            relatives.id            as relativeid
                FROM users 
            INNER JOIN relatives ON users.id = relatives.user_id 
            WHERE 
                users.id = ? 
                and users.active = 1 and
                relatives.active= 1`,
              [id]
            )
            .then(async (rows) => {
              const credentials = rows[0];

              credentials.map((e) => {
                e.created_at = new Date(e.created_at).toISOString();
                e.created_at =
                  e.created_at.split("T")[0] +
                  " : " +
                  e.created_at.split("T")[1].replace("Z", "");
              });

              console.log(credentials);
              return res.status(200).render("credentialsEdit", { credentials });

            });
            
    
};

const addRelative = async (req, res) =>{

  const { id } = req.params;      
  res.status(200).render('credentialsAdd',{id});
}

const addRelatives = async (req, res) =>{
  const { id } = req.params;

  const { 
    name, 
    Lastname, 
    Dni,
    Relationship,
   } = req.body;

  const newRelative = {
    name,
    Lastname,
    Dni,
    Relationship,
    user_id: id,
    active: 1
  };

  // console.log(newRelative);

  await db.query("INSERT INTO Relatives set ?", [newRelative]);
  req.flash("success", "Relative Saved Successfully");
  res.redirect("/credentials");
}

const updateRelatives = async (req, res) => { 

  const { relativeid, id } = req.params;

  const { 
    Name, 
    Lastname, 
    Dni,
    Relationship,
   } = req.body;

  const newData = {
    Name,
    Lastname,
    Dni,
    Relationship
  };

    
  await db.query("UPDATE relatives set ? WHERE id = ?", [newData, relativeid])
              .then( () => {  
                req.flash("success", "Relative Updated Successfully");                                             
                res.redirect(`/editRelatives/${id}`);
              });
  
}

const deleteRelatives = async (req, res) =>{
  
  const {relativeid, id} = req.params;

  await db.query(`UPDATE relatives
                SET active = 0
                WHERE id = ?`, 
                [relativeid])
                .then( () => {          
                  req.flash("success", "Relative Removed Successfully");                                
                  res.redirect(`/editRelatives/${id}` );
                });
}

const updateMainUsers = async (req, res) => { 

  const { id } = req.params;
  const { 
    Name, 
    Lastname, 
    Dni,
    Relationship,
   } = req.body;

  const newData = {
    Name,
    Lastname,
    Dni,
    Relationship
  };

    
  await db.query("UPDATE relatives set ? WHERE id = ?", [newData, id])
              .then( () => {   
                req.flash("success", "Main User Updated Successfully");                      
                res.redirect(`/edit/${id}`);
              });
  
}

const deleteMainUser = async (req, res) =>{

  const {id} = req.params;

  await db.query(`UPDATE users
                SET active = 0
                WHERE id = ?`, 
                [id])
                .then( () => {         
                  req.flash("success", "Main User Removed Successfully");           
                  res.redirect("/credentials" );
                });
}


module.exports = {
  signin,
  credentials,
  renderRelatives,
  addRelative,
  addRelatives, 
  updateRelatives,
  deleteRelatives,
  updateMainUsers,
  deleteMainUser,
};
