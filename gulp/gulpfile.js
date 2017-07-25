//gulp
var gulp = require('gulp'); 
//合并文件
var concat = require('gulp-concat');
//hash改名
var rev = require('gulp-rev');
//根据manifest修改引用
var revCollector = require('gulp-rev-collector');
//异步执行
var gulpSequence = require('gulp-sequence');
//干掉目录层
var flatten = require('gulp-flatten');
//删除临时文件
var del = require('del');
//重写index
var htmlreplace = require('gulp-html-replace');

//////////////////////////////////////合并js库/////////////////////////////////////////
//重写index
gulp.task('reindex', function() {
  gulp.src('tempublish/index.html')
    .pipe(htmlreplace({
        'js': 'libs/libs.min.js'
    }))
    .pipe(gulp.dest('tempublish/'));
});

//合并js库引用
gulp.task('concatjs', function() {
    return gulp.src(['tempublish/libs/**/*','tempublish/polyfill/**/*'])
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('./tempublish/libs'))
		.pipe(rev())
		.pipe( rev.manifest({merge: true }) )
        .pipe(gulp.dest('./dist'));;

});
///////////////////////////////////////////////////////////////////////////////////////

//修改所有文件名并放到新release文件夹下 
//排除index.html favicon.ico
//并生成相关的manifest文件到dist
gulp.task('rename', function() {
    return gulp.src(['tempublish/**/*.*','!tempublish/index.html','!tempublish/favicon.ico'])
		.pipe(rev())
        .pipe(gulp.dest('./release'))
        .pipe( rev.manifest({merge: true }) )
        .pipe(gulp.dest('./dist'));

});
//移动index
gulp.task('moveindex', function() {
	return gulp.src(['tempublish/**/*.html'])
        .pipe(gulp.dest('./release'));
});

//处理图片，因为有相对路径所以做了扁平化文件路径干掉文件夹，只替换文件名
gulp.task('flattenpng', function() {   
	return gulp.src(['tempublish/**/*','!tempublish/index.html'])	
		.pipe(flatten())
		.pipe(gulp.dest('./dist'))	
		.pipe(rev())
        .pipe( rev.manifest({merge: true }) ) 
        .pipe(gulp.dest('./dist'));	
});



//通过hash来精确定位到html模板中需要更改的部分,然后将修改成功的文件生成到指定目录

gulp.task('revjs',function(){
    return gulp.src(['dist/rev-manifest.json','release/**/*.js'])
    .pipe( revCollector() )
    .pipe(gulp.dest('release'));
});
gulp.task('revres',function(){
    return gulp.src(['dist/rev-manifest.json','release/**/*.json'])
    .pipe( revCollector() )
    .pipe(gulp.dest('release'));
});
gulp.task('revfnt',function(){
    return gulp.src(['dist/rev-manifest.json','release/**/*.fnt'])
    .pipe( revCollector() )
    .pipe(gulp.dest('release'));
});
gulp.task('revhtml',function(){
    return gulp.src(['dist/rev-manifest.json','release/*.html'])
    .pipe( revCollector() )
    .pipe(gulp.dest('release'));
});
//删除临时文件 dist js文件夹 临时js
gulp.task('cleanjs', function (cb) {
  del([
    'dist','./release/libs/modules','./tempublish/libs/libs.min.js' ,'./release/polyfill'  
  ], cb);
});
//删除临时文件 dist
gulp.task('clean', function (cb) {
  del([
    'dist'    
  ], cb);
});
//删除上次的release文件
gulp.task('cleanrel', function (cb) {
  return del([
    'release'    
  ]);
});


//合并执行任务和合并js文件
gulp.task('refilejs', function(cb) {  
    gulpSequence(
        'cleanrel',
        'reindex',
        'concatjs',
		'rename',
		'moveindex',
		'flattenpng',
		'revjs',
		'revres',
		'revfnt',
		'revhtml',
		'cleanjs'
	)(cb);
});  

//合并执行任务
gulp.task('refile', function(cb) {  
    gulpSequence(
        'cleanrel',
        'rename',
        'moveindex',
        'flattenpng',
        'revjs',
        'revres',
        'revfnt',
        'revhtml',      
        'clean'
    )(cb);
});  

























