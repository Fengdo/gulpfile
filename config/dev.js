const {task,src,dest,watch,series,parallel} = require("gulp");
const $ = require('gulp-load-plugins')({overridePattern: true,pattern:["*"]});
const config = require("./config.js");
const gulpif = require("gulp-if");

// 项目信息
function project(cd) {
	console.log("project: " + config.projectName);
	console.log("now: " + config.now);
	console.log("type: "+ config.type);
	console.log("page:("+config.page.length+") "+ config.page);
	cd();
}

// 创建项目
function create(cd) {
	if(config.type=="sass") {
		var dirs = [config.src.root,config.src.css,config.src.sass,config.src.js,config.src.img,config.src.support];
	}else{
		var dirs = [config.src.root,config.src.css,config.src.less,config.src.js,config.src.img,config.src.support];
	}
	dirs.forEach(dir => {
	    $.mkdirp.sync(dir);
	});
	cd();
}

// 删除项目
function clean(cd) {
	$.del([config.projectRoot],cd());
}

// 删除src源文件(不曝光)
function clean_src(cd){
	return src(config.src.root,{read:false,allowEmpty:true})
		.pipe($.clean({force: true}))
	cd();
}

// 创建基本文件(html页面和scss)
function write_index(cd) {
	var files = config.page;
		files.forEach(function(item){
		$.fs.writeFile(config.src.root+"/"+item,"",function(err){
			if(err) return console.log(err);
		});			
	});
	cd()
}

function write_scss(cd) {
	if(config.type == "sass"){
		var files = [config.src.sass+"style.scss",config.src.sass+"_config.scss"];
	}else{
		var files = [config.src.less+"style.less",config.src.less+"config.less"];
	}
	var msg = "";
	files.forEach(function(item){
		if(item == config.src.sass+"style.scss"){
			msg = "@import 'config.scss';";
		}else if(item == config.src.less+"style.less"){
			msg = "@import 'config.less';";
		}else{
			msg = "";
		}
		$.fs.writeFile(item,msg,function(err){
			if(err) return console.log(err);
		});
	});
	cd();
}

function write_js(cd) {
	var file = config.src.js+"main.js";
	$.fs.writeFile(file,"",function(err){
		if(err) return console.log(err);
	})
	cd()
}

// 编译sass
function generate(cd) {
	if(config.type=="sass"){
		var file = config.src.sass+"*.scss";
	}else{
		var file = config.src.less+"*.less";
	}

	return src(file)
		.pipe(gulpif(config.type=="sass",$.sass({outputStyle:'expanded'}),$.less()))
		.pipe(dest(config.src.css))
	cd();
}

// 本地服务器
function server(cd) {
	$.browserSync.init({
		server:{
			baseDir:config.src.root,
			index:config.now
		}
	})
	watch([config.src.root+"/*.html",config.src.js+"*.js"]).on('change',$.browserSync.reload);
	watch([config.src.sass+"*.scss",config.src.less+"*.less"],generate).on('change',$.browserSync.reload);
	cd();
}

/* 曝光dev接口 */
exports.project = project; 					// 项目信息
exports.create = series(clean_src,
create,parallel(write_index,write_scss,write_js)); 	// 创建项目
exports.clean = clean; 						// 删除项目
exports.server = server; 					// 本地服务器
