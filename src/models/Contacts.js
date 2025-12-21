import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // ✅ NO UNIQUE: Multiple contacts can have the same email (contact form submissions)
    },
    message: {
      type: String,
      required: true,
    }
});

const ContactModel = mongoose.models?.Contact || mongoose.model('Contact', contactSchema);

export default ContactModel;
