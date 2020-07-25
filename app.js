const koa = require('koa');
const json = require('koa-json');
const koaRouter = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const mysql = require('mysql');

const app = new koa();
const router = new koaRouter();


const things = ['Programming', 'My Family'];

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shah@1234',
    database: 'quotedb',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.log('Failure to connect');
        console.log(err);
    } else {
        console.log('connected to database');
    }
});

// Middleware
app.use(json());
app.use(bodyParser());
app.context.name = 'Shahzad Hafeez';
app.use(router.routes()).use(router.allowedMethods());


render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});


/* Routes */

// default router
//app.use(async ctx => ctx.body = { msg: 'this is a msg' });

// test route
router.get('/user', ctx => ctx.body = `Hello ${ctx.name}`);


router.get('/', async ctx => {
    await ctx.render('index', {
        title: 'Things I love:',
        things: things
    });
});

router.get('/add', async ctx => {
    await ctx.render('add');
});


router.post('/add', async ctx => {
    const body = ctx.request.body;
    things.push(body.thing);
    ctx.redirect('/');
});


router.get('/get', async ctx => {
    try {
        connection.query('SELECT * FROM thing', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ');
            console.log(results);
        });
        ctx.body = results;
    } catch (error) {
        ctx.body = "Error occured";
        console.log(error);
    }
});

app.listen(4000, () => {
    console.log('server is listening at 4000 port..');
})
