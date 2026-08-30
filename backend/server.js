const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* =========================
   FRONTEND
========================= */

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);

app.use(
    express.static(frontendPath)
);


app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );

});


/* =========================
   EMAIL CONFIGURATION
========================= */

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});


/* =========================
   TEST EMAIL CONNECTION
========================= */

transporter.verify((error) => {

    if (error) {

        console.log(
            "Email connection failed ❌"
        );

        console.log(
            error.message
        );

    } else {

        console.log(
            "Gmail SMTP connected successfully ✅"
        );

    }

});


/* =========================
   TEST API
========================= */

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Pratik Portfolio backend is working!"

    });

});


/* =========================
   CONTACT API
========================= */

app.post(
    "/api/contact",
    async (req, res) => {

        try {

            const {
                name,
                email,
                subject,
                message
            } = req.body;


            /* Validation */

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All fields are required."

                });

            }


            /* =========================
               EMAIL
            ========================= */

            const mailOptions = {

                from:
                    process.env.EMAIL_USER,

                to:
                    process.env.EMAIL_USER,

                replyTo:
                    email,

                subject:
                    "Portfolio Contact: " +
                    subject,

                text:
`New message from your portfolio

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}
`

            };


            await transporter.sendMail(
                mailOptions
            );


            /* =========================
               CONSOLE
            ========================= */

            console.log("");

            console.log(
                "================================"
            );

            console.log(
                "       NEW CONTACT MESSAGE"
            );

            console.log(
                "================================"
            );

            console.log(
                "Name:",
                name
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Subject:",
                subject
            );

            console.log(
                "Message:",
                message
            );

            console.log(
                "Email sent successfully ✅"
            );

            console.log(
                "================================"
            );

            console.log("");


            /* =========================
               RESPONSE
            ========================= */

            res.json({

                success: true,

                message:
                    "Message sent successfully!"

            });

        }

        catch (error) {

            console.error(
                "Email error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to send message. Please try again."

            });

        }

    }
);


/* =========================
   START SERVER
========================= */

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "===================================="
        );

        console.log(
            "      PRATIK PORTFOLIO SERVER"
        );

        console.log(
            "===================================="
        );

        console.log(
            `Website: http://localhost:${PORT}`
        );

        console.log(
            `Contact: http://localhost:${PORT}/contact.html`
        );

        console.log(
            `API: http://localhost:${PORT}/api/test`
        );

        console.log(
            "===================================="
        );

        console.log("");

    }
);
