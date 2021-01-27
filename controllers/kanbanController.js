exports.index = function (req, res) {
    const dbController = new MysqlController()
    let parseUrl = require('querystring').parse(
            req.url.replace("/?", "")
        )

    dbController.connection.query(`SELECT id, title, status FROM tasks WHERE id_user LIKE '${parseUrl.userId}'`,
        (err, response) => {
            dbController.destructor()

            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            } else {
                if (response.length > 0) {
                    var json = JSON.stringify(response)
                }

                res.render('kanban', {
                    userLogin: parseUrl.userLogin,
                    userId: parseUrl.userId,
                    userTasks: json || "[]"
                })
            }
        }
    )
}

exports.create = function (req, res) {
    const dbController = new MysqlController()
    dbController.connection.query(`INSERT INTO tasks (id_user, title, status) VALUES ('${req.body.id_user}', '${req.body.title}', 'todo')`,
        (err) => {
            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            } else {
                dbController.connection.query(`SELECT id FROM tasks WHERE id_user LIKE '${req.body.id_user}' AND title LIKE '${req.body.title}'`,
                    (err, response) => {
                        dbController.destructor()

                        if (err) {
                            res.render('error', {
                                message: 'SQL Error',
                                error: err
                            });
                        } else {
                            if (response.length > 0) {
                                res.status(200).send(String(response[response.length - 1].id))
                            }
                        }
                    }
                )
            }
        }
    )
}

exports.update = function (req, res) {
    const dbController = new MysqlController()
    dbController.connection.query(`UPDATE tasks SET status = '${req.body.status}' WHERE id LIKE ${Number(req.body.id)}`,
        (err) => {
            if (err) {
                res.render('error', {
                    message: 'SQL Error',
                    error: err
                });
            }
            else {
                res.status(200).send("ok")
            }
        }
    )
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