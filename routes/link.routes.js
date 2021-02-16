const {Router} = require('express');
const config = require('config');
const auth = require('../middleware/auth.middleware');
const router = Router();


router.get('/', auth, async (req, res) => {
  try {
    // const links = await Link.find({ owner: req.user.userId })
    const ans = {answer: "Всё клево, работает"};
    res.json(ans);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = router;