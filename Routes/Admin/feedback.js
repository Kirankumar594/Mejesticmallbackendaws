const express = require('express');
const { submitFeedback, getAllFeedback } = require('../../Controller/Admin/feedback');
const {Authentication,Authorization}=require("../../Authentication/auth")
const router = express.Router();


router.post('/feedback',Authentication, submitFeedback);


router.get('/getallfeedback',Authentication, getAllFeedback);

module.exports = router;