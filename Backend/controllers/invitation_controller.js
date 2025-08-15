import Invitation from "../models/invitation_model.js";
import Activity from "../models/trip_model.js";
import User from "../models/user_model.js";
import Notification from "../models/notification.js";

export const sendInvitation = async (req, res) => {
  try {
    const { activityId, inviteeId } = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to invite" });
    }

    const existing = await Invitation.findOne({ activity: activityId, invitee: inviteeId });
    if (existing) {
      return res.status(400).json({ message: "Already invited" });
    }

    const invitation = await Invitation.create({
      activity: activityId,
      inviter: req.user._id,
      invitee: inviteeId,
    });

    const inviter = await User.findById(req.user._id);

    const message = `${inviter.firstName} invited you to join "${activity.title}"`;

    await Notification.create({
      user: inviteeId,
      message,
    });

    global.io.to(inviteeId.toString()).emit("notification:new", {
      message,
    });

    res.status(201).json({ message: "Invitation sent", invitation });
  } catch (err) {
    console.error("Send Invite Error:", err);
    res.status(500).json({ message: "Failed to send invitation" });
  }
};

export const getMyInvitations = async (req, res) => {
  try {
    const invites = await Invitation.find({
      invitee: req.user._id,
      status: "pending",
    })
      .populate("inviter", "firstName lastName")
      .populate("activity", "title location");

    res.status(200).json({ data: invites });
  } catch (err) {
    console.error("Get Invitations Error:", err);
    res.status(500).json({ message: "Error fetching invitations" });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ message: "Invalid response value." });
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    if (invitation.invitee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to respond to this invitation." });
    }

    invitation.status = response;
    await invitation.save();

    const activity = await Activity.findById(invitation.activity);
    if (response === "accepted" && activity && !activity.participants.includes(req.user._id)) {
      activity.participants.push(req.user._id);
      await activity.save();
    }

    const invitee = await User.findById(invitation.invitee);
    const inviter = await User.findById(invitation.inviter);

    const message = `${invitee.firstName} has ${response} your invitation to join "${activity.title}"`;

    await Notification.create({
      user: inviter._id,
      message,
    });

    global.io.to(inviter._id.toString()).emit("notification:new", {
      message,
    });

    res.json({ message: `Invitation ${response}.` });
  } catch (err) {
    console.error("Error responding to invitation:", err);
    res.status(500).json({ message: "Failed to respond to invitation." });
  }
};