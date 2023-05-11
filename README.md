# TODO APP

## Try it

### Clone the repo

```bash
git clone https://github.com/MirzayevOrzu/simple-mvc-todo-app.git
```

Switch to **e2e-test-ui** branch if you want to see E2E UI tests

```bash
git checkout e2e-test-ui
```

### Move to project folder

```bash
cd simple-mvc-todo-app
```

### Clean install the dependencies

```bash
npm ci
```

### Run the project

```bash
node index.mjs
```

Now you can view project in [localhost:3001](http://localhost:3001)

### Testing

To see tests running visually, run command

```bash
npm run cypress:open
```

To just run tests, and see results in terminal

```bash
npm run cypress:e2e
```
