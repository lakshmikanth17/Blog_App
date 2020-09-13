var bodyParser     = require("body-parser"),
	expressSanti   = require("express-sanitizer"),
	methodOverride = require("method-override"),
	mongoose  	   = require("mongoose"),
	express    	   = require("express"),
	app 	       = express();

//app config
mongoose.connect("mongodb://localhost:27017/blog_app", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanti());
app.use(methodOverride("_method"));

//mongoose/model config
var blogSchema = new mongoose.Schema({
	 title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes

app.get("/", function(req,res){
	res.redirect("/blogs");
});


//INDEX Route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err, blogData){
		if(err){
			console.log("Error");
		} else {
			res.render("index", {blogs: blogData});
		}
	});
});
//NEW Route
app.get("/blogs/new", function(req,res){
	res.render("new");
});

 
//CREATE route
app.post("/blogs", function(req,res){
	//create blog 
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else{
			//redirect to the index page
			res.redirect("/blogs");
		}
	});
	
});


//SHOW Route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog})
		}
	})
})

//EDIT Route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
	
});

//UPDATE route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
		
	}); 
});

//DELETE Route
app.delete("/blogs/:id", function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("blogs");
		} else {
			res.redirect("/blogs");
		}
	})
	//redirect to home
});
//Blog.create({
	//title: "Test Blog",
	//image: "https://images.thrillophilia.com/image/upload/s--6m7wbglN--/c_fill,dpr_1.0,f_auto,fl_strip_profile,g_center,h_450,q_auto,w_753/v1/images/photos/000/046/102/original/1.jpg.jpg",
	//body: "Hello"
	
//});


app.listen(process.env.PORT = 3000, process.env.IP, function(){
	console.log("server has started")
});