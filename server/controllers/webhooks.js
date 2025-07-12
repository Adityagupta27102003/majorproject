import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async(req, res) => {
    try {
        let payload;

        // ✅ Log incoming raw body
        console.log("🔥 Clerk Webhook Raw Payload:", JSON.stringify(req.body, null, 2));

        // ✅ Try verifying the webhook
        try {
            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = wh.verify(req.rawBody, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"],
            });
        } catch (verifyError) {
            console.warn("⚠️ Webhook verification failed:", verifyError.message);

            // Fallback to rawBody if not in production
            if (process.env.NODE_ENV !== "production") {
                payload = JSON.parse(req.rawBody); // force parse
            } else {
                throw verifyError;
            }
        }

        const { data, type } = payload;

        console.log("📦 Verified Payload Type:", type);
        console.log("🧑 Clerk User Data:", data);

        switch (type) {
            case "user.created":
                console.log("✅ Creating new user in DB...");
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: "",
                });
                console.log("✅ User created successfully.");
                break;

            case "user.updated":
                console.log("🔁 Updating user...");
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                });
                break;

            case "user.deleted":
                console.log("❌ Deleting user...");
                await User.findByIdAndDelete(data.id);
                break;

            default:
                return res.status(400).json({ error: "Unsupported event type" });
        }

        res.json({ success: true });

    } catch (err) {
        console.error("❌ Webhook handler error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};