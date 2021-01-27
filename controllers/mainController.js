// Display home page
exports.index = function (req, res) {
    res.render('index', {
        title: 'Animal 2077'
    });
}

// Display store login
exports.login = function (req, res) {
    if (req.body['login-btn'] != null)
        login(req, res)
    else
        register(req, res)
}

class MysqlController {
    connection

    constructor() {
        this.connection = require('mysql').createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'first_node_app_db'
        })
    }

    destructor() {
        this.connection.end()
    }
}

var dbController = new MysqlController()

function login(req, res) {
    signIn(res, req.body.login, req.body.password)
}

function register(req, res) {
    dbController.connection.query(`INSERT INTO users (login, email, password) VALUES ('${req.body.login}', '${req.body.email}', '${req.body.password}')`,
        (err) => {
            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            } else {
                signIn(res, req.body.login, req.body.password)
            }
        }
    )
}

function signIn(res, login, password) {
    dbController.connection.query(`SELECT id FROM users WHERE login LIKE '${login}' AND password LIKE '${password}'`,
        (err, rows) => {
            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            } else {
                if (rows.length > 0) {
                    res.redirect(
                        require('url').format({
                            pathname:"/kanban",
                            query: {
                                "userLogin": login,
                                "userId": rows[0].id,
                                "userTasks": userTasksJSON(res, rows[0].id) || "[]"
                            }
                        })
                    );
                }
            }
            dbController.destructor()
        }
    )
}

function userTasksJSON(res, id) {
    dbController.connection.query(`SELECT id, title, status FROM tasks WHERE id_user LIKE '${id}'`,
        (err, response) => {
            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            } else {
                if (response.length > 0) {
                    return JSON.stringify(response)
                }
            }
        }
    )
}