# Node.js recruitment task

## Installation
1. Clone this repository
2. Build docker image
```
docker-compose build
```
Run from project dir

```
JWT_SECRET=secret docker-compose up -d
```
Run test
```
JWT_SECRET=secret docker-compose run app npm run test
```
To stop the authorization service run

```
docker-compose down
```
## Request and response

Authorization token
```
curl --location --request POST '0.0.0.0:3000/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
"username": "premium-jim",
"password": "GBLtTyq3E_UNjFnpo9m6"
}'
```
Response:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzNCwibmFtZSI6IlByZW1pdW0gSmltIiwicm9sZSI6InByZW1pdW0iLCJpYXQiOjE2NTEwODU3MTIsImV4cCI6MTY1MTA4NzUxMiwiaXNzIjoiaHR0cHM6Ly93d3cubmV0Z3VydS5jb20vIiwic3ViIjoiNDM0In0.MSDy94_H9GMDTnZttI3GprpPABbrqGqzM_OK3m1NQk8"
}
```
Create movie request
```
curl --location --request POST '0.0.0.0:3000/movies' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzNCwibmFtZSI6IlByZW1pdW0gSmltIiwicm9sZSI6InByZW1pdW0iLCJpYXQiOjE2NTEwODU3MTIsImV4cCI6MTY1MTA4NzUxMiwiaXNzIjoiaHR0cHM6Ly93d3cubmV0Z3VydS5jb20vIiwic3ViIjoiNDM0In0.MSDy94_H9GMDTnZttI3GprpPABbrqGqzM_OK3m1NQk8' \
--header 'Content-Type: application/json' \
--data-raw '{
"title": "Everest"
}'
```
Response:
```
{
    "movie": {
        "title": "Everest",
        "released": "2015-09-25T00:00:00.000Z",
        "genre": "Action, Adventure, Biography",
        "director": "Baltasar Kormákur",
        "user_id": 434,
        "_id": "62699309167d0478c69b43f3"
    }
}
```
List movies request
```
curl --location --request GET '0.0.0.0:3000/movies' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzNCwibmFtZSI6IlByZW1pdW0gSmltIiwicm9sZSI6InByZW1pdW0iLCJpYXQiOjE2NTEwODU3MTIsImV4cCI6MTY1MTA4NzUxMiwiaXNzIjoiaHR0cHM6Ly93d3cubmV0Z3VydS5jb20vIiwic3ViIjoiNDM0In0.MSDy94_H9GMDTnZttI3GprpPABbrqGqzM_OK3m1NQk8' \
--data-raw ''
```
Response:
```
{
    "movies": [
        {
            "_id": "62699309167d0478c69b43f3",
            "title": "Everest",
            "released": "2015-09-25T00:00:00.000Z",
            "genre": "Action, Adventure, Biography",
            "director": "Baltasar Kormákur",
            "user_id": 434,
            "createdAt": "2022-04-27T19:01:29.930Z",
            "updatedAt": "2022-04-27T19:01:29.930Z",
            "__v": 0
        },
        {
            "_id": "626993a4167d0478c69b43f8",
            "title": "Intouchables",
            "released": "2016-05-01T00:00:00.000Z",
            "genre": "Short, Drama",
            "director": "Junyi Shen",
            "user_id": 434,
            "createdAt": "2022-04-27T19:04:04.392Z",
            "updatedAt": "2022-04-27T19:04:04.392Z",
            "__v": 0
        }
    ]
}
```
## Users

The auth service defines two user accounts that you should use

1. `Basic` user

```
 username: 'basic-thomas'
 password: 'sR-_pcoow-27-6PAwCD8'
```

1. `Premium` user

```
username: 'premium-jim'
password: 'GBLtTyq3E_UNjFnpo9m6'
```

