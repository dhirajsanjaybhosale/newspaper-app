const twilio = require('twilio');

// Lazy initialization of Twilio client
let client = null;

const getClient = () => {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // Only initialize if credentials are provided
    if (accountSid && authToken) {
      client = twilio(accountSid, authToken);
    }
  }
  return client;
};

/**
 * Send an SMS message using Twilio
 * @param {string} to - The recipient's phone number (with country code, e.g., +1234567890)
 * @param {string} message - The message to send
 * @returns {Promise<Object>} - The Twilio message object
 */
const sendSMS = async (to, message) => {
  try {
    // In development, log the message instead of sending it
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS to ${to}: ${message}`);
      return { sid: 'test_sid', status: 'sent' };
    }

    const twilioClient = getClient();
    if (!twilioClient) {
      console.log(`📱 SMS to ${to}: ${message} (Twilio not configured)`);
      return { sid: 'no_client', status: 'skipped' };
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log(`✅ SMS sent to ${to}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    throw new Error('Failed to send SMS');
  }
};

/**
 * Send a WhatsApp message using Twilio
 * @param {string} to - The recipient's WhatsApp number (with country code, e.g., +1234567890)
 * @param {string} message - The message to send
 * @returns {Promise<Object>} - The Twilio message object
 */
const sendWhatsApp = async (to, message) => {
  try {
    // In development, log the message instead of sending it
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 WhatsApp to ${to}: ${message}`);
      return { sid: 'test_wa_sid', status: 'sent' };
    }

    const twilioClient = getClient();
    if (!twilioClient) {
      console.log(`📱 WhatsApp to ${to}: ${message} (Twilio not configured)`);
      return { sid: 'no_client', status: 'skipped' };
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
    });

    console.log(`✅ WhatsApp sent to ${to}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};

/**
 * Send a verification code via SMS
 * @param {string} phoneNumber - The phone number to verify
 * @returns {Promise<Object>} - The Twilio verification object
 */
const sendVerificationCode = async (phoneNumber) => {
  try {
    // In development, log the verification code instead of sending it
    if (process.env.NODE_ENV === 'development') {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`🔐 Verification code for ${phoneNumber}: ${verificationCode}`);
      return { status: 'pending', sid: 'test_verification_sid' };
    }

    const twilioClient = getClient();
    if (!twilioClient) {
      console.log(`🔐 Verification code for ${phoneNumber} (Twilio not configured)`);
      return { status: 'pending', sid: 'no_client' };
    }

    const verification = await twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    return verification;
  } catch (error) {
    console.error('❌ Error sending verification code:', error.message);
    throw new Error('Failed to send verification code');
  }
};

/**
 * Verify a code sent to a phone number
 * @param {string} phoneNumber - The phone number to verify
 * @param {string} code - The verification code
 * @returns {Promise<Object>} - The Twilio verification check object
 */
const verifyCode = async (phoneNumber, code) => {
  try {
    // In development, accept any code that's 6 digits
    if (process.env.NODE_ENV === 'development') {
      if (/^\d{6}$/.test(code)) {
        console.log(`✅ Verification code approved for ${phoneNumber}`);
        return { status: 'approved' };
      }
      console.log(`❌ Invalid verification code for ${phoneNumber}`);
      throw new Error('Invalid verification code');
    }

    const twilioClient = getClient();
    if (!twilioClient) {
      console.log(`✅ Verification code approved for ${phoneNumber} (Twilio not configured)`);
      return { status: 'approved' };
    }

    const verificationCheck = await twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code });

    return verificationCheck;
  } catch (error) {
    console.error('❌ Error verifying code:', error.message);
    throw new Error('Failed to verify code');
  }
};

module.exports = {
  sendSMS,
  sendWhatsApp,
  sendVerificationCode,
  verifyCode,
};
