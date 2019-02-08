const project = require("./project.js");	// 项目名称和开发页面设置
const projectRoot = "./"+ project.name; // 项目根目录
const src = projectRoot+"/src"; 		// 源文件
const dist = projectRoot+"/dist"; 		// 打包上线

/* 配置目录 */
const config = {
	projectName : project.name,
	projectRoot : projectRoot,
	now : project.now,
	type : project.type,
	page : project.page,
	src:{
		root:src,
		css:src+"/css/",
		js:src+"/js/",
		img:src+"/img/",
		sass:src+"/sass/",
		less:src+"/less/"
	},
	dist:{
		root:dist,
		css:dist+"/css/",
		js:dist+"/js/",
		img:dist+"/img/",
	}
}

/* 曝光config接口 */
module.exports = config;