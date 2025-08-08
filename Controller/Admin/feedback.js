const Feedback = require('../../Model/Admin/feedback');


exports.submitFeedback = async (req, res) => {
  try {
    const { email, name, mobile, message } = req.body;


    if (!email || !name || !mobile || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const feedback = new Feedback({
      email,
      name,
      mobile,
      message,
    });

    await feedback.save();

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};