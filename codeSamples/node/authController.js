const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const AuthService = require('./authService');

const authService = new AuthService();

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        error: err ? err.message : 'Login or password is wrong',
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      const token = jwt.sign(user, config.get('auth.jwt.secret'));
      return res.send({ user, token });
    });
  })(req, res);
});

router.post('/sign-up', (req, res) => {
  authService
    .register(req.body)
    .then(() => res.send({ message: 'ok' }))
    .catch(err => res.status(400).send({ error: err.message }));
});

router.post('/reset-pass', (req, res) => {
  const { password, confirmPassword, reset_password_token: resetPasswordToken } = req.body;
  authService
    .resetPassword(password, confirmPassword, resetPasswordToken)
    .then(() => res.send({ message: 'ok' }))
    .catch(err => res.status(400).send({ error: err.message }));
});

router.post('/request-pass', (req, res) => {
  const { email } = req.body;
  authService
    .requestPassword(email)
    .then(() => res.send({ message: `Email with reset password instructions was sent to email ${email}.` }));
});

router.post('/sign-out', (req, res) => {
  res.send({ message: 'ok' });
});

module.exports = router;
