const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router= Router();


// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const {email, password} = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });

    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
    }
  }
)

//api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введитекорректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      }

      const {email, password} = req.body;

      const user = await User.findOne({ email });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );

      res.json({ token, userId: user.id });

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

//api/auth/check
router.post(
  '/checking', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

      if (!token) {
        return res.status(401).json({ message: 'Нет авторизации' });
      };

      const decoded = jwt.verify(token, config.get('jwtSecret'));
      res.status(200).json({ message: 'Вход выполнен' })
    } catch (e) {
      res.status(500).json({ message: 'Нет авторизации' })
    }
  }
)

module.exports = router;