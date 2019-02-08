const {task,src,dest,watch,series,parallel} = require("gulp");
const $ = require('gulp-load-plugins')({overridePattern: true,pattern:["*"]});

/* 配置文件 */
const config = require("./config/config.js"); // 路径配置(代码测试用)
const dev = require("./config/dev.js");       // 开发配置
const pro = require("./config/pro.js");		  // 上线配置

/* 开发模式 */
exports.project = dev.project;      // 项目信息
exports.create = dev.create; 		// 创建项目
exports.delete = dev.clean;   		// 删除项目
exports.server = dev.server; 		// 本地服务器

/* 上线模式 */
exports.production = pro.production; // 生成上线文件
exports.remove = pro.remove;         // 删除上线文件
exports.zip = pro.zip; 			 // 生成压缩文件

/* 代码测试 */
exports.test = function(cd) {
	var files = ["a.txt","b.txt"];
		files.forEach(function(item){
		$.fs.writeFile(item,"",function(err){
			if(err) return console.log(err);
		});			
	});
	cd();
}