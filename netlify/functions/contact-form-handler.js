import {
  checkForSpamKeywords,
  checkForGibberish,
  checkHoneypot,
  checkSubmissionSpeed,
} from "./spam-prevention.js";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await req.json();
    const { name, email, phone, source, message, userAgent } = data;

    // Spam prevention: Check honeypot field
    if (checkHoneypot(data)) {
      console.log("Spam detected - honeypot field filled:", {
        websiteFieldValue: data["website"],
        name,
        email,
        timestamp: new Date().toISOString(),
      });

      // Return success to user but don't send email (silent rejection)
      return new Response(
        JSON.stringify({
          success: true,
          message: "Your message has been sent! We'll get back to you soon.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Spam prevention: Check if form was submitted too quickly
    const speedCheck = checkSubmissionSpeed(data);
    if (speedCheck.isTooFast) {
      console.log(
        `Spam prevention: Form submitted in ${speedCheck.timeTaken} seconds`,
      );
      return new Response(
        JSON.stringify({
          error: "Please take your time filling out the form.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Spam prevention: Check for spam keywords
    const spamCheck = checkForSpamKeywords(data);
    if (spamCheck.isSpam) {
      console.log("Spam detected - keywords found:", spamCheck.matchedKeywords);
      console.log("Blocked submission data:", {
        name,
        email,
        phone,
        matchedKeywords: spamCheck.matchedKeywords,
        timestamp: new Date().toISOString(),
      });

      // Return success to user but don't send email (silent rejection)
      return new Response(
        JSON.stringify({
          success: true,
          message: "Your message has been sent! We'll get back to you soon.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Spam prevention: Check for random gibberish text
    const gibberishCheck = checkForGibberish(data);
    if (gibberishCheck.isGibberish) {
      console.log(
        "Spam detected - gibberish text found:",
        gibberishCheck.suspiciousFields,
      );
      console.log("Blocked submission data:", {
        name,
        email,
        phone,
        suspiciousFields: gibberishCheck.suspiciousFields,
        timestamp: new Date().toISOString(),
      });

      // Return success to user but don't send email (silent rejection)
      return new Response(
        JSON.stringify({
          success: true,
          message: "Your message has been sent! We'll get back to you soon.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Basic validation
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: "Name, email, and phone are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract IP address from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      context.ip ||
      "Unknown";

    // Prepare email data
    const mailgunData = new URLSearchParams();
    mailgunData.append("from", "nextgenghs.com <noreply@mg.nextgenghs.com>");
    mailgunData.append("h:Reply-To", email);

    // If testing email, send to testing address
    const recipientEmail = email === "test@scalebloom.com"
      ? "forms+testing@scalebloom.com"
      : "info@nextgenghs.com";

    mailgunData.append("to", recipientEmail);
    mailgunData.append("bcc", "forms@scalebloom.com");
    mailgunData.append("subject", `Contact Form Entry from ${name}`);
    mailgunData.append(
      "text",
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nHow did you find us: ${source || "Not provided"}\nMessage: ${message || "No message"}\n\nSubmitted: ${new Date().toLocaleString()}`,
    );
    mailgunData.append(
      "html",
      `<p><strong>Name:</strong> ${name}<br>
<strong>Email:</strong> ${email}<br>
<strong>Phone:</strong> ${phone || "Not provided"}<br>
<strong>How did you find us:</strong> ${source || "Not provided"}<br>
<strong>Message:</strong> ${message || "No message"}</p>
<p style="color: #6d6d6d; font-style: italic;">Submitted: ${new Date().toLocaleString()}</p>`,
    );

    // Send via Mailgun
    const response = await fetch(
      `https://api.mailgun.net/v3/mg.nextgenghs.com/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${process.env.MAILGUN_API_KEY}`,
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: mailgunData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailgun error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent! We'll get back to you soon.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
