# ECOMMERCE-SHOP

e-commerce application

## Getting started

### Prerequisites

In order to install and run this project locally, you would need to have the following installed on you local machine.
- [**Node JS**](https://nodejs.org/en/)
- [**MySQL**](https://www.mysql.com/downloads/)

### Installation

- Clone this repository

```sh
git clone git@github.com/CEOehis/ecommerce-shop.git
```

- Navigatet to the project directory

```sh
cd path/to/ecommerce-shop

```

- Run `npm install` or `yarn` to instal the projects dependencies
- create a `.env` file and copy the contents of the `.env.sample` file into it and supply the values for each variable

```sh
cp .evn.sample .env
```

- Create a MySQL database and run the `sql` file in the database directory to migrate the database

```sh
cat ./src/database/database.sql | mysql -u <dbuser> -D <databasename> -p
```

## API Endpoints

### customers
`POST /api/v1/customers`

Creates a customer

Example request body:

```source-json
{
  "name: "John Doe",
  "email" : "jd@mail.com",
  "password": "password",
}
```

No authentication required, returns status `201`, the created customer resource and access token.

Required fields: `name`, `email`, `password`

`POST /api/v1/customers/login`

Logs in a customer

Example request body:

```source-json
{
  "email" : "jd@mail.com",
  "password": "password",
}
```

No authentication required, returns status `200` and the access token

Required fields: `email`, `password`

`GET /api/v1/customer`

Gets a customer's profile

Authentication required, returns status `200` and the logged in user's profile

`PUT /api/v1/customer`

Updates a customer's profile

Example request body:

```source-json
{
  name: 'Test user',
  password: 'password',
  dayPhone: '09091239898',
}
```

Authentication is required. Returns status `200` and customer profile.
Required fields: `name` `password`

`PUT /api/v1/customer/password`

Updates a customer's password

Example request body:

```source-json
{
  oldPassword: 'password',
  newPassword: 'newpassword',
}
```

Authentication is required. Returns status `200` and success message.
All fields are required

`PUT /api/v1/customer/billing-info`

Updates a customer's billing info

Example request body:

```source-json
{
  password: 'password',
  address1: '58, New place street',
  address2: 'By old place station',
  city: 'Kigali',
  region: 'North-West',
  postalCode: '88929',
  country: 'Newark',
}
```

Authentication is required. Returns status `200` and customer profile.
Required fields: `password`

### Products

`GET /api/v1/products`

Gets a list of items in the store

Additional query parameters can also be supplied to customize the page size of the paginated list

`GET /api/v1/products?limit=15&page=3`

Authentication required, returns status `200` and a paginated list of items.

`GET /api/v1/products/{product_id}`

Gets the details of an item in the store

Authentication required, returns status `200` and item data.
