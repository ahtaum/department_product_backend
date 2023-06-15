# Install
- type in console or terminal `npm i` or `npm install`

- copy and rename **env.example** to **.env** and configure database

- run migrate `node ace migration:run --seed` or `node ace migration:fresh --seed` to migrate database and adding default user data

- run in local by typing `node ace serve --watch`

# Doc Api
use postman or other tools for testing this api

 ## **Users**

>  **Authorazation : None**

1. **Get Users :**

get all user data

**Method : Get**

    http://127.0.0.1:3333/v1/users

2. **Get User**

get single user data

**Method : Get**

Param :
**id : number**

    http://127.0.0.1:3333/v1/users/id
 
3. **Register**

add user

**Method : Post**

input :
**email : string
name: string
password: string
confirm_password: string**

    http://127.0.0.1:3333/v1/users/add

4. **Login**

authenticate user

**Method : Post**

input :
**email : string
password : string**

    http://127.0.0.1:3333/v1/users/login

5. **Logout**

destroy token user

**Method : Post**

    http://127.0.0.1:3333/v1/users/logout


## **Items**

> **Authorazation : Bearer Token**

1. Get Items

get all item data

**Method: Get**

    http://127.0.0.1:3333/v1/items

2. **Get Item**

get single item data

**Method: Get**

Params :
**id : number**

    http://127.0.0.1:3333/v1/items/id
 
 3. **Add Item**

add item data

**Method: Post**

Input :
**name : string
price : integer**

    http://127.0.0.1:3333/v1/items/add

4. **Update Item**

update item data

**Method: Put**

params:
**id : number**

input :
**name : string
price : integer**

    http://127.0.0.1:3333/v1/items/update/id

5. **Delete Item**

delete item data

**Method: Delete**

params:
**id : number**

    http://127.0.0.1:3333/v1/items/delete/id


## **Customer**

> **Authorazation : Bearer Token**

1. Get Customers

get all customer data

**Method: Get**

    http://127.0.0.1:3333/v1/customers

2. **Get Customer**

get single customer data

**Method: Get**

Params :
**id : number**

       http://127.0.0.1:3333/v1/customers/id

 
 3. **Add Customer**

add customer data

**Method: Post**

Input :
**name : string
phone: string**

    http://127.0.0.1:3333/v1/customers/add

4. **Update Customer**

update customer data

**Method: Put**

params:
**id : number**

Input :
**name : string
phone: string**

    http://127.0.0.1:3333/v1/customers/update/id

5. **Delete Customer**

delete customer data

**Method: Delete**

params:
**id : number**

    http://127.0.0.1:3333/v1/customers/delete/id


## **Sales Transcations**

> **Authorazation : Bearer Token**

1. **Get Sales**

get sales all data transactions

**Method: Get**

    http://127.0.0.1:3333/v1/sales

2. **Get Sale**

get sales single data

**Method: Get**

Params:
**id : number**

    http://127.0.0.1:3333/v1/sales/id


3. **Get Transactions**

To retrieve all transaction data that has been processed and obtain a summary in the form of total data.

**Method: Get**

    http://127.0.0.1:3333/v1/sales/get/transaction

4. **Create Sale**

creating transaction data

**Mehtod: Post**

Input :
**customerId: integer,
items : [
	itemId: integer,
	quantity: integer
]
discount: integer
shippingCost: integer
date: string(with some valid date format)**

Example input in postman with JSON :

    {
    
	    "customerId":  2,
    
	    "items":  [
    
	    {
	    
		    "itemId":  17,
		    
		    "quantity":  10
	    
	    },
	    
	    {
	    
		    "itemId":  18,
		    
		    "quantity":  3
	    
	    }
	    
	    ],
	    
	    "discount":  20,
	    
	    "shippingCost":  10,
	    
	    "date":  "2023-06-09T10:00:00Z"
	    
    }

**note:** you can add more item with array for adding item transaction

Endpoint :

    http://127.0.0.1:3333/v1/sales/createSale

5. **Update Sale**

updating transaction data

**Mehtod: Put**

Param:
**id: integer**

Input :
**customerId: integer,
items : [
	itemId: integer,
	quantity: integer
]
discount: integer
shippingCost: integer
date: string(with some valid date format)**

Example input in postman with JSON :

    {
    
	    "customerId":  2,
    
	    "items":  [
    
	    {
	    
		    "itemId":  17,
		    
		    "quantity":  10
	    
	    },
	    
	    {
	    
		    "itemId":  18,
		    
		    "quantity":  3
	    
	    }
	    
	    ],
	    
	    "discount":  20,
	    
	    "shippingCost":  10,
	    
	    "date":  "2023-06-09T10:00:00Z"
	    
    }

**note:** you can add more item with array for adding item transaction

Endpoint :

    http://127.0.0.1:3333/v1/sales/updateSale/id


6. **Delete Sale**

delete sale transaction some data

**Method: Delete**

Params :
**id : integer**

    http://127.0.0.1:3333/v1/sales/deleteSale/10

## Main Features

1. **Retrive Token**

you can run this endpoint :

    http://127.0.0.1:3333/v1/users/login

**Authorization : None**
**Method : Post**

input in postmant or yours Api tools :

JSON :

    {
    	"email": "your@email.email"
    	"password": "your_password"
    }

this will Generate response api like this example :

    {
        "code": 200,
        "message": "OK",
        "token": {
            "type": "bearer",
            "token": "MjI.FcmFBc_J9-ctjtOZAVjxPzCyPxGCytc9S8ZJPCuARq-fWwVDiiKyeYlMGjuL",
            "expires_at": "2023-06-16T11:14:14.673+07:00"
        },
        "user_data": {
            "id": 1,
            "email": "admin@admin.dev",
            "name": "Admin",
            "remember_me_token": null,
            "created_at": "2023-06-10T11:45:51.000+07:00",
            "updated_at": "2023-06-10T11:45:51.000+07:00"
        }
    }

the **token** will apear use that token for accessing endpoint by set header **Bearer Token** in postman or your Api Test tools

2. **Creating Transactions or Sales**

If you want to make a transaction, there are some rules to follow:

- Make sure customer data exists.
- Make sure item data exists.

These rules apply to the endpoints that utilize customer and item data.

**Authorization : Bearer Token**
**Method : Post**

Endpoint :

    http://127.0.0.1:3333/v1/sales/createSale

Input Example in JSON :

    {
	    
	    "customerId":  2,
	    
	    "items":  [
	    
		    {
		    
			    "itemId":  17,
			    
			    "quantity":  10
		    
		    },
		    
		    {
		    
			    "itemId":  18,
			    
			    "quantity":  3
		    
		    }
	    
	    ],
	    
	    "discount":  20,
	    
	    "shippingCost":  10,
	    
	    "date":  "2023-06-09T10:00:00Z"
    
    }

**Notes :** You can add as many **items** as you want to the array.

3. **Get Transaction Sale Data**

Retrieve all customer transaction data that has been processed, including the total cost of the entire transaction.

**Authorization : Bearer Token**
**Method : Get**

Endpoint :

    http://127.0.0.1:3333/v1/sales/get/transaction

Api Response Example :

    {
	    
	    "code":  200,
	    
	    "message":  "OK",
	    
	    "tableData":  [
	    
		    {
		    
			    "transaction_no":  1,
			    
			    "date":  "2023-06-09T10:00:00.000Z",
			    
			    "customer_name":  "Adit",
			    
			    "quantity":  20,
			    
			    "subtotal":  "600000.00",
			    
			    "discount":  "20.00",
			    
			    "shipping_cost":  "10.00",
			    
			    "total_cost":  "600000.00"
		    
		    },
		    
		    {
		    
			    "transaction_no":  1,
			    
			    "date":  "2023-06-18T17:33:00.000Z",
			    
			    "customer_name":  "Adit",
			    
			    "quantity":  3,
			    
			    "subtotal":  "72000.00",
			    
			    "discount":  "0.00",
			    
			    "shipping_cost":  "0.00",
			    
			    "total_cost":  "72000.00"
		    
		    },
		    
		    {
		    
			    "transaction_no":  2,
			    
			    "date":  "2023-06-09T10:00:00.000Z",
			    
			    "customer_name":  "Wirakawardhana Tumenggung",
			    
			    "quantity":  13,
			    
			    "subtotal":  "390000.00",
			    
			    "discount":  "50.00",
			    
			    "shipping_cost":  "10.00",
			    
			    "total_cost":  "390000.00"
		    
		    },
		    
		    {
		    
			    "transaction_no":  2,
			    
			    "date":  "2023-06-17T06:30:00.000Z",
			    
			    "customer_name":  "Wirakawardhana Tumenggung",
			    
			    "quantity":  3,
			    
			    "subtotal":  "90000.00",
			    
			    "discount":  "10.00",
			    
			    "shipping_cost":  "5000.00",
			    
			    "total_cost":  "90000.00"
		    
		    },
		    
		    {
		    
			    "transaction_no":  3,
			    
			    "date":  "2023-06-14T15:29:00.000Z",
			    
			    "customer_name":  "Tamara",
			    
			    "quantity":  6,
			    
			    "subtotal":  "180000.00",
			    
			    "discount":  "30.00",
			    
			    "shipping_cost":  "10000.00",
			    
			    "total_cost":  "180000.00"
		    
		    }
		    
	    ],
	    
	    "grandTotal":  "1332000.00"
    
    }
