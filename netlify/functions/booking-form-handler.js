export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { name, email, message, product, userAgent } = await req.json();

    // Basic validation
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
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
    mailgunData.append("from", "Acorn Pals <noreply@mg.acornpals.com>");
    mailgunData.append("h:Reply-To", email);
    mailgunData.append("to", "hi@acornpals.com");
    mailgunData.append("subject", `Acorn Pals Booking Inquiry from ${name}`);
    mailgunData.append(
      "text",
      `Name: ${name}\nEmail: ${email}\nProduct: ${product || "Not specified"}\nMessage: ${message || "No message"}\n\nSubmitted: ${new Date().toLocaleString()}\nUser Agent: ${userAgent || "Not provided"}\nIP Address: ${ip}`,
    );
    mailgunData.append(
      "html",
      `<p><strong>Name:</strong> ${name}<br>
<strong>Email:</strong> ${email}<br>
<strong>Product:</strong> ${product || "Not specified"}<br>
<strong>Message:</strong> ${message || "No message"}</p>
<p style="color: #6d6d6d; font-style: italic;">Submitted: ${new Date().toLocaleString()}<br>
User Agent: ${userAgent || "Not provided"}<br>
IP Address: ${ip}</p>`,
    );

    // Send via Mailgun
    const response = await fetch(
      `https://api.mailgun.net/v3/mg.acornpals.com/messages`,
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
        message: "Your inquiry has been sent! We'll respond within 24 hours.",
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
