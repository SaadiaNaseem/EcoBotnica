import express from 'express';
import Report from '../models/report.js';
import Message from '../models/message.js';
import userModel from '../models/userModel.js';

const router = express.Router();

// 🟢 TEST ROUTES - ADD THESE TEMPORARILY
router.get('/test', (req, res) => {
  res.json({ message: 'Reports API is working! ✅' });
});

router.get('/test-delete', (req, res) => {
  res.json({ message: 'Delete routes are working! ✅' });
});

// GET /api/reports - Get all reports
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all reports...');
    const reports = await Report.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${reports.length} reports`);
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reports/resolve-message/:id - Delete message and report
router.delete('/resolve-message/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deleting message for report: ${req.params.id}`);
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      console.log('❌ Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }

    console.log('Deleting message:', report.messageText, 'by user:', report.reportedUser);

    // Delete the reported message using YOUR field names
    const deleteResult = await Message.deleteOne({ 
      text: report.messageText,
      user: report.reportedUser
    });

    console.log('✅ Message delete result:', deleteResult);

    // Delete the report
    await Report.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Message deleted and report resolved successfully',
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('❌ Error in resolve-message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reports/resolve-user/:id - Delete user and their messages
router.delete('/resolve-user/:id', async (req, res) => {
  try {
    console.log(`⛔ Deleting user for report: ${req.params.id}`);
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      console.log('❌ Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }

    const username = report.reportedUser;
    console.log('Deleting user:', username);

    // Delete the user using YOUR field name
    const userDeleteResult = await userModel.deleteOne({ name: username });
    console.log('✅ User delete result:', userDeleteResult);

    // Delete all messages by this user using YOUR field name
    const messagesDeleteResult = await Message.deleteMany({ user: username });
    console.log('✅ Messages delete result:', messagesDeleteResult);

    // Delete the report
    await Report.findByIdAndDelete(req.params.id);

    res.json({ 
      message: `User ${username} deleted successfully`,
      userDeleted: userDeleteResult.deletedCount,
      messagesDeleted: messagesDeleteResult.deletedCount
    });
  } catch (error) {
    console.error('❌ Error in resolve-user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reports/:id - Delete report only
router.delete('/:id', async (req, res) => {
  try {
    console.log(`📝 Deleting report only: ${req.params.id}`);
    
    const report = await Report.findByIdAndDelete(req.params.id);
    
    if (!report) {
      console.log('❌ Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }

    console.log('✅ Report deleted successfully');
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;