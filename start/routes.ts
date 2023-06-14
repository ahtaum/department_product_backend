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

  // Authorization Environtment
  Route.group(() => {

    // Items Data
    Route.group(() => {
      Route.get("/", "ItemsController.getItems")
      Route.get("/:id", "ItemsController.getItem")
      Route.post("/add", "ItemsController.store")
      Route.put("/update/:id", "ItemsController.update")
      Route.delete("/delete/:id", "ItemsController.destroy")
    }).prefix("items")
  
    // Customer Data
    Route.group(() => {
      Route.get("/", "CustomersController.getCustomers")
      Route.get("/:id", "CustomersController.getCustomer")
      Route.post("/add", "CustomersController.store")
      Route.put("/update/:id", "CustomersController.update")
      Route.delete("/delete/:id", "CustomersController.destroy")
    }).prefix("customers")

    // Sales Data
    Route.group(() => {
      Route.get("/", "SalesController.getSales")
      Route.get("/:id", "SalesController.getSale")
      Route.get("/get/transaction", "SalesController.getCustomersWithSalesAndSalesDet")
      Route.post("/createSale", "SalesController.createSale")
      Route.put("/updateSale/:id", "SalesController.updateSale")
      Route.delete("/deleteSale/:id", "SalesController.deleteSale")
    }).prefix("sales")

  }).middleware("auth")

}).prefix("v1")
