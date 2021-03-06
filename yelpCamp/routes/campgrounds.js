var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
	middleware = require("../middleware");



//INDEX - Show all CGs
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

//NEW - Create new CG
router.post("/", function(req, res){
	var cgName = req.body.cgName;
	var cgImage = req.body.cgImage;
	var cgDescription = req.body.cgDescription;
	var cgAuthor = {username: req.user.username, id: req.user._id}
	var cgPrice = req.body.cgPrice;
	var newCG = {name: cgName, image: cgImage, description: cgDescription, author: cgAuthor, price: cgPrice};
	Campground.create(newCG, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Successfully created campground");
			res.redirect("/campgrounds");
		}
	});
});

//CREATE - Show form to create new CG
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW Route
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show", {campground: campground});	
		}
	});
});

//EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
		}
		else {
			res.render("campgrounds/edit", {campground: campground});
		}
	});
});

//UPDATE Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		if(err){
			req.flash("error", "Failed to edit campground")			
			res.redirect("/campgrounds");
		}
		else {
			req.flash("success", "Successfully edited campground")			
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Failed to delete campground")			
			res.redirect("/campgrounds");
		}
		else {
			req.flash("success", "Successfully deleted campground")			
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;
