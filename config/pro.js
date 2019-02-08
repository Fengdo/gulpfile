const {task,src,dest,watch,series,parallel} = require("gulp");
const $ = require('gulp-load-plugins')({overridePattern: true,pattern:["*"]});
const config = require("./config.js");

// 删除dist文件
function clean_dist(cd){
	return src(config.dist.root,{read:false,allowEmpty:true})
		.pipe($.clean({force: true}))
	cd();
}

// 生成新的html
function html(cd) {
	return src(config.src.root+'/*.html')
	    .pipe($.processhtml())
	    .pipe(dest(config.dist.root));
	cd();
}

// 生成新的css
function css(cd) {
	return src(config.src.sass+"*.scss")
		.pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
		.pipe($.concat("style.css"))
		.pipe($.autoprefixer({browsers:["last 2 versions"],cascade:false}))
		.pipe($.cssnano())
		.pipe($.rename({suffix: '.min'}))
		.pipe(dest(config.dist.css));
	cd();
}

// 压缩图片
function img(cd) {
	return src(config.src.img+"*")
		.pipe($.imagemin([
		    $.imagemin.gifsicle({interlaced: true}),
		    $.imagemin.jpegtran({progressive: true}),
		    $.imagemin.optipng({optimizationLevel: 5}),
		    $.imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		]))
		.pipe(dest(config.dist.img))
	cd();
}

// 压缩js
function js(cd) {
	return src(config.src.js+"*.js")
		.pipe($.concat("main.js"))
		.pipe($.uglify())
		.pipe($.rename({suffix:".min"}))
		.pipe(dest(config.dist.js))
	cd();
}

// 生成zip文件
exports.zip = function(cd) {
	return src(config.dist.root+"/**/*")
		.pipe($.zip(config.project_name + ".zip"))
		.pipe(dest(config.project));
		cd();
}

/* 为gulpfile提供接口 */
exports.production = parallel(html,css,img,js); // 生成上线文件

// 删除上线文件
exports.remove = clean_dist;
