import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async(req, res) => {
    try {
        let payload;

        // ✅ Try verifying first
        try {
            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = wh.verify(req.rawBody, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"],
            });
        } catch (verifyError) {
            console.warn("Webhook verification failed:", verifyError.message);

            // ⚠️ Force use of raw body if in development
            if (process.env.NODE_ENV !== "production") {
                payload = JSON.parse(req.rawBody); // force parse
            } else {
                throw verifyError;
            }
        }

        const { data, type } = payload;

        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: "",
                });
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                });
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                return res.status(400).json({ error: "Unsupported event type" });
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Webhook handler error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};