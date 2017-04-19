var express         =   require('express'),
    app             =   express(),
    bodyParser      =   require('body-parser'),
    cookieParser    =   require('cookie-parser'),
    session         =   require('express-session'),
    sanitizeHtml    =   require('sanitize-html'),
    mailer          =   require('express-mailer'),
    i18n            =   require('i18n');

i18n.configure({
    locales: ['en', 'pt-br', 'fr'],
    directory: __dirname + "/locales",
    defaultLocale: 'pt-br',
    cookie: 'i18n'
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("technoviking"));

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'ginomoguerra@gmail.com',
    pass: 'G10v4nn3*'
  }
});

app.use(session({
    secret: "technoviking",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));

app.use(i18n.init);

app.get('/', function(req, res){
    res.setLocale(req.cookies.i18n);
    res.render('index', {
        i18n: res
    })
});

app.post('/', function(req, res){
    app.mailer.send('email', {
        to: 'giovanneguerra@hotmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Test Email', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
      }, function (err) {
        if (err) {
          // handle error
          console.log(err);
          res.send('There was an error sending the email');
          return;
        }
        res.send('Email Sent');
      });
    var clean = sanitizeHtml(req.body.form)
    res.render('index', {form: clean});
});

app.get('/en', function(req, res){
    res.cookie('i18n', 'en');
    res.redirect('/');
});

app.get('/pt-br', function(req, res){
    res.cookie('i18n', 'pt-br');
    res.redirect('/');
});

app.get('/fr', function(req, res){
    res.cookie('i18n', 'fr');
    res.redirect('/');
});

app.get('/*', function(req, res){
    res.render("404");
});

if(!module.parent){
    app.listen('8000', 'localhost', function(){
        console.log('Server has started');
    });
}
