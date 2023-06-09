import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  // Users Data
  Route.group(() => {
    Route.get("/", "UsersController.getUsers")
    Route.get("/:id", "UsersController.getUser")
    Route.post("/login", "UsersController.login")
    Route.post("/logout", "UsersController.logout")
    Route.post("/add", "UsersController.register")
  }).prefix("users")

  // Items Data
  Route.group(() => {
    Route.get("/", "ItemsController.getItems")
    Route.get("/:id", "ItemsController.getItem")
    // Route.post("/add", "ItemsController.register")
  }).prefix("items").middleware("auth")

}).prefix("v1")
