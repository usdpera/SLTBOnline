const Route = require('../models/Route'); // Assuming a Mongoose model

exports.addRoute = async (req, res) => {
    const { Origin, Destination, Distance, Name, RouteID } = req.body;

    // Validation
    if (!Origin || !Destination || !Distance || !Name || !RouteID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Save route to database
        const newRoute = new Route({ Origin, Destination, Distance, Name, RouteID });
        await newRoute.save();

        res.status(201).json({ message: "Route added successfully!", route: newRoute });
    } catch (error) {
        res.status(500).json({ error: "Failed to add route." });
    }
};
