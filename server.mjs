import express from 'express';
import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 3003;

app.use(cookieParser());

app.use(express.json());

app.use(cors({
	origin: '*'
}));

app.use(session({
	genid: (req) => {
		return crypto.randomUUID();
	},
	name: 'usid',
	secret: ['test secre key', 'test secret key 2'],
	resave: false,
	saveUninitialized: true,
	//cookie: {/*secure: true*/ maxAge: 60*1000}
}));

// auth
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});
// facebook
passport.use(new FacebookStrategy({
		clientID: '415983733528264',
		clientSecret: '09ebbd8117b6c476ecda0a88f6a8515b',
		callbackURL: "http://localhost:3003/auth/facebook/callback"
	}, function(accessToken, refreshToken, profile, cb) {
		// add refresh token
		console.log(accessToken, refreshToken, profile);
		return cb(null, profile);
		//User.findOrCreate({ facebookId: profile.id }, function (err, user) {
		//	return cb(err, user);
		//});
	}
));

//

// google
passport.use(new GoogleStrategy({
		clientID: '341813737788-6b4k473h2nf4tkd2e32kk33ti2ojv4hu.apps.googleusercontent.com',
		clientSecret: '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',
		//callbackURL: "http://localhost:3003/auth/google/callback"
		callbackURL: "https://blooming-wave-53194.herokuapp.com/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		// add refresh token
		console.log(accessToken, refreshToken, profile);
		done(null, profile);
		//User.findOrCreate({ googleId: profile.id }, function (err, user) {
		//	return done(err, user);
		//});
	}
));

// end passport
app.use(passport.initialize());
app.use(passport.session());


// middleware
function middlewareIsAuth(req, res, next) {
	if(!req.user) {
		return res.status(403).json({message: `Access to api for unauthorized users is denied`});
	}
	next();
}

function middlewareIsAuthRedirect(req, res, next) {
	if(!req.user) {
		return res.redirect('/');
	}
	next();
}

function middlewareYesAuthRedirect(req, res, next) {
	if(req.user) {
		return res.redirect('/user');
	}
	next();
}


// add facebook
app.get('/auth/facebook', middlewareYesAuthRedirect, passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' /*'/login'*/ }),
	function(req, res) {
		res.redirect('/user');
	}
);

app.get('/auth/google', middlewareYesAuthRedirect, passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
	passport.authenticate('google', { failureRedirect: '/' /*'/login'*/ }),
	function(req, res) {
		res.redirect('/user');
	}
);

// static

//app.use('/user/', express.static(path.resolve() + "/../user/build"));




let storage = {'Sis!': 0, 'Bro!': 0, last: {}};

// app

app.get('/api/main', middlewareIsAuth, (req, res) => {
	return res.json({
		userName: `${req.user.displayName}(${req.user.provider})`,
		lastMessage: {
			message: storage.last.message || 'NULL',
			userName: storage.last.userName || 'NULL',
			date: storage.last.date || Date.now()
		}
	});
});

app.post('/api/logout', middlewareIsAuth, (req, res) => {
	req.logout();
	res.redirect('/');
});

app.post('/api/send-message', middlewareIsAuth, (req, res) => {
	console.log('send', JSON.stringify(req.body.message));
	
	if(req.body.message === 'Sis!') {
		storage["Sis!"]++;
		storage.last.message = 'Sis!';
		storage.last.userName = `${req.user.displayName}(${req.user.provider})`;
		storage.last.date = Date.now();
	} else if(req.body.message === 'Bro!') {
		storage["Bro!"]++;
		storage.last.message = 'Bro!';
		storage.last.userName = `${req.user.displayName}(${req.user.provider})`;
		storage.last.date = Date.now();
	}
	
	res.json({
		userName: `${req.user.displayName}(${req.user.provider})`,
		lastMessage: {
			message: storage.last.message || 'NULL',
			userName: storage.last.userName || 'NULL',
			date: storage.last.date || Date.now()
		}
	});
});



app.get('/public-api/main', (req, res) => {
	res.json({"Sis!": storage["Sis!"], "Bro!": storage["Bro!"]});
});

// get react


app.get('/user', middlewareIsAuthRedirect, (req, res) => {
	res.status(200).sendFile(path.resolve("user/build/index.html"));
});



app.get('/', middlewareYesAuthRedirect, (req, res) => {
	res.status(200).sendFile(path.resolve("guest/build/index.html"));
});

app.use('/', express.static(path.resolve() + "/user/build"));

app.use('/', express.static(path.resolve() + "/guest/build"));

// connect port
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});
