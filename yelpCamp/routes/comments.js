var express    = require("express"),
    router     = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment");


// NEW Comment
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE Comment
router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}	
	});
});

// Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
