# freshprep-server
The following repo is an attempt at Option B, Levels 1 & 2. The client repo can be seen [here](https://github.com/miguelmoya97/freshprep-client).

The server has 3 endpoints based on requirements:

- **GET /ids**, Returns a universally unique identifier
- **GET /users**, Returns user details
- **POST /users**, Returns a success, saving to a database. A failure response otherwise

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and run for Production

```sh
npm run build
npm run start
```
