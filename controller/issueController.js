const Issue = require("../models/issueReport");
const mongoose = require("mongoose");

exports.reportIssue = async (req, res) => {
  console.log("Inside Report Issue");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  try {
    // Check if req.body exists and has required fields
    if (!req.body || !req.body.title || !req.body.description) {
      return res
        .status(400)
        .json({ error: "Missing required fields (title, description)" });
    }

    // Build issue data from request
    const issueData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || "",
      pincode: req.body.pincode || "",
      createdBy:
        req.body.userId && mongoose.Types.ObjectId.isValid(req.body.userId)
          ? req.body.userId
          : null,
    };

    // Handle uploaded image (single file)
    if (req.file) {
      // Use the full URL path for the client to access the image
      issueData.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    const newIssue = new Issue(issueData);
    console.log("inside try block");

    await newIssue.save();

    res
      .status(201)
      .json({ message: "Issue reported successfully", issue: newIssue });
  } catch (error) {
    console.error("Issue reporting failed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res
      .status(500)
      .json({ error: "Failed to report issue", details: error.message });
  }
};

exports.allReports = async (req, res) => {
  console.log("Inside allReports");

  try {
    // Check if userId is provided in query params for filtering
    const userId = req.query.userId;

    let allIssues;
    if (userId) {
      // Filter issues by user ID if provided
      allIssues = await Issue.find({ createdBy: userId });
      console.log(`Fetched ${allIssues.length} reports for user ${userId}`);
    } else {
      // Return all issues if no userId is provided (for admin/worker views)
      allIssues = await Issue.find();
      console.log(`Fetched all ${allIssues.length} reports`);
    }

    res.status(200).json(allIssues);
  } catch (error) {
    console.error("Failed to fetch all reports:", error);
    res.status(500).json({ error: "Failed to fetch all reports" });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Issue.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to update report" });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Issue.findByIdAndDelete(id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete report" });
  }
};
