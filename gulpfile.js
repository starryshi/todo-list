//加载插件
var gulp = require('gulp');

var sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');

// 编译sass
// 在命令行输入 gulp sass 启动此任务
gulp.task('sass',function(){
	return sass('sass/')
	.on('error',function(err){
		console.error('Error',err.message);
	})
	.pipe(gulp.dest('src/stylesheets'));
});

// 自动编译 Sass
// 在命令行使用 gulp auto 启动此任务
// gulp.task('auto',function () {
//     // 监听文件修改，当文件被修改则执行 images 任务
//     gulp.watch('sass/**/*.scss', ['sass']);
// });

//压缩CSS
gulp.task('styles', function() {
	gulp.src('src/stylesheets/**/*.css')
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
});


gulp.task('scripts', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))

});

//压缩图片
gulp.task('images', function() {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/img'))

});

//清除文件
gulp.task('clean', function(cb) {
	del(['dist/css', 'dist/js', 'dist/img'], cb) //用一个回调函数（cb）确保在退出前完成任务。
});

gulp.task('default', ['clean'] ,function() {
	gulp.run('styles', 'scripts', 'watch');
});

gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch('src/stylesheets/**/*.css', ['styles']);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/img/**/*', ['images']);
	
	//自动刷新页面
	livereload.listen();
	gulp.watch(['dist/**']).on('change', livereload.changed);
});