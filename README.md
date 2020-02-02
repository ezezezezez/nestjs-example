## NestJS Example

#### A task management RESTful API example

[Testing Front-end](http://nestjs-task-management-example-ky.s3-website.ap-east-1.amazonaws.com/)

Development setup: `npm i && npm run start:dev`

Test: `npm test`

DB Settings please check `config` folder

#### Testing endpoints

- Sign up

```bash
curl -X POST localhost:3000/auth/signup -H 'Content-Type: application/json' -d '{ "username": "hello1", "password": "World123" }'
```

- Log in

```bash
curl -X POST localhost:3000/auth/login -H 'Content-Type: application/json' -d '{ "username": "hello1", "password": "World123" }'
```

- Get all tasks, optional filters: `q=searchKey&status=(OPEN|IN_PROGRESS|DONE)`

```bash
curl -X GET localhost:3000/task -H 'Authorization: Bearer <accessToken returned from Log in>'
```

- Create a task

```bash
curl -X POST localhost:3000/task -H 'Authorization: Bearer <accessToken returned from Log in>' -H 'Content-Type: application/json' -d '{ "title": "New task", "description": "Some description" }'
```

- Delete a task

```bash
curl -X DELETE localhost:3000/task/:taskId -H 'Authorization: Bearer <accessToken returned from Log in>'
```

- Update a task

```bash
curl -X PATCH localhost:3000/task/:taskId -H 'Authorization: Bearer <accessToken returned from Log in>' -H 'Content-Type: application/json' -d '{ "title": "Updated title", "status": "DONE" }'
```
