const router = require("express").Router();
const mongoose = require("mongoose");
const events = require("../models/events");
const auth = require("./users/auth");
const form = require("../models/form");

// GET ROUTES

// get request for displaying all events
router.get("/", auth, async (req, res) => {
  try {
    const id = req.userid;
    const data = await events.find({ user: id });
    console.log(data);
    res.send({
      msg: "data fetched successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
});

//get request for displaying single event
router.get("/:title", auth, async (req, res) => {
  try {
    const id = req.userid;
    const title = req.params.title;
    const data = await events.findOne({ title, user: id });
    res.send({
      msg: "data fetched successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// POST ROUTES

// post request for adding event
// data required in the request body- title, website, start, end, organisation, location
router.post("/addroom", auth, async (req, res) => {
  try {
    const { title, website, start, end, organisation, location } = req.body;
    const newEvent = new events({
      user: req.userid,
      title,
      website,
      start,
      end,
      organisation,
      location,
    });
    //saving data in db
    const newEventInfo = await newEvent.save();
    console.log(newEventInfo);
    res.send({
      message: "new event added",
      event: newEventInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "something went wrong",
    });
  }
});

//Adding an api to extract the data from the form
router.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const Form = new form({
      name, email, message
    });
    //Saving data in Database
    const data = await Form.save();
    res.send({
      message: "Form sent successfully",
      data
    });
  } catch (error) {
    res.status(500).send({
      msg: "something went wrong"
    })
  }

});

// UPDATE ROUTES
// All the update routes will be written here

//This route will edit particular event
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userid;

    let event = await events.findById(eventId);

    if (!event) {
      return res.status(404).send("Not Found");
    }
    if (userId != event.user.toString()) {
      return res.status(401).send("Not Allowed");
    }

    const { title, website, start, end, organisation, location } = req.body;
    const newEvent = {};
    if (title) { newEvent.title = title }
    if (website) { newEvent.website = website }
    if (start) { newEvent.start = start }
    if (end) { newEvent.end = end }
    if (organisation) { newEvent.organisation = organisation }
    if (location) { newEvent.location = location }

    event = await events.findByIdAndUpdate(eventId, { $set: newEvent }, { new: true });
    res.json({
      message: "Event updated successfully",
      event
    });

  } catch (error) {
    console.log(err);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// DELETE ROUTES

// Route for Deleting an event
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userid;
    let event = await events.findById(eventId);
    if (!event) {
      return res.status(404).send("Not Found");
    }
    if (userId != event.user.toString()) {
      return res.status(401).send("Not Allowed");
    }

    event = await events.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" , event});
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

module.exports = router;
