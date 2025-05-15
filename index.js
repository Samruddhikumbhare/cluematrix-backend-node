require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthenticateRouter = require("./router/authenticateRouter");
const HomeRouter = require("./router/homeRouter");
const VisionMissionRouter = require("./router/VisionMissionRouter");
const clientRouter = require("./router/clientRouter");
const teamCollaborationRouter = require("./router/teamCollaborationRouter");
const productRouter = require("./router/productRouter");
const contactInfoRouter = require("./router/contactInfoRouter");
const AboutRouter = require("./router/AboutRouter");
const JourneyRouter = require("./router/JourneyRouter");
const serviceRouter = require("./router/serviceRouter");
const privacyPolicyRouter = require("./router/privacyPolicyRouter");
const blogsRouter = require("./router/blogsRouter");
const termsConditionRouter = require("./router/termsConditionRouter");
const refundPolicyRouter = require("./router/refundPolicyRouter");
const subscribeNewsletterRouter = require("./router/subscribeNewsletterRouter");
const userContactRouter = require("./router/userContactRouter");
const scheduleDemoRouter = require("./router/scheduleDemoRouter");
const chartRouter = require("./router/chartRouter");
const teamsRouter = require("./router/teamsRouter");
const paymentRouter = require("./router/paymentRouter");
const EnrollTrainingRouter = require("./router/EnrollTrainingRouter");
const ShowServiceRouter = require("./router/ShowServiceRouter");
const Testimonial = require("./router/testimonialRouter");
const event = require("./router/eventRouter");
const scheduleServiceRouter = require("./router/scheduleServiceRouter");

const path = require("path");

//cors policy
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

//create express object
const app = express();

// Define the directory where your uploaded images are stored
app.use("/images", (req, res, next) => {
  express.static(path.join(__dirname, "images"))(req, res, (err) => {
    if (err) {
      // Handle the error or send a 404 response
      res.status(404).send("Not Found");
    } else {
      next();
    }
  });
});

//except request from any url
app.use(cors(corsOptions));

//for getting data from form
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//authentication routes
app.use(AuthenticateRouter);

//home page routes
app.use("/api/home", HomeRouter);

//visionmission page routes
app.use("/api", VisionMissionRouter);

//client page routes
app.use("/api", clientRouter);

//team collaboration page routes
app.use("/api", teamCollaborationRouter);

//product page routes
app.use("/api", productRouter);

//contact page routes
app.use("/api", contactInfoRouter);

//teams page routes
app.use("/api", teamsRouter);

//about page routes
app.use("/api", AboutRouter);

//journey page routes
app.use("/api", JourneyRouter);

//what service page routes
app.use("/api", serviceRouter);

//what blogs page routes
app.use("/api", blogsRouter);

//what privacy policy page routes
app.use("/api", privacyPolicyRouter);

//what termscondition page routes
app.use("/api", termsConditionRouter);

//what refundPolicy page routes
app.use("/api", refundPolicyRouter);

//what subscribe newsletter page routes
app.use("/api", subscribeNewsletterRouter);

//what userContact page routes
app.use("/api", userContactRouter);

//what schedule demo page routes
app.use("/api", scheduleDemoRouter);

//what chart for dashboard page routes
app.use("/api", chartRouter);

//what chart for paymentgateway page routes
app.use("/api", paymentRouter);

//what enroll page routes
app.use("/api", EnrollTrainingRouter);

//what show service page routes
app.use("/api", ShowServiceRouter);

//what show testimonail page routes
app.use("/api", Testimonial);

//what show event page routes
app.use("/api", event);

//what show event page routes
app.use("/api", scheduleServiceRouter);

//in which port server start
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
