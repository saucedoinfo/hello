// ---------------------------------------> Start Import

//HTML
import htmlmin from "gulp-htmlmin";

//CSS
import postcss from "gulp-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

//JavaScript
import gulp from "gulp";
import babel from "gulp-babel";
import terser from "gulp-terser";

//PUG
import pug from "gulp-pug";

//SASS
import sass from "gulp-sass";

//Common
import concat from "gulp-concat";

//Clean CSS
import clean from "gulp-purgecss";

//Caché bust
import cacheBust from "gulp-cache-bust";

//Optimización imágenes
import imagemin from "gulp-imagemin";

//Browser sync
import { init as server, stream, reload } from "browser-sync";

//Plumber
import plumber from "gulp-plumber";


// //Typescript
// import ts from "gulp-typescript";


// ---------------------------------------> End Import
// ---------------------------------------> Start const
const production = false;

//Variables/constantes
const cssPlugins = [cssnano(), autoprefixer()];

// const gulp = require("gulp")
// const pug = require('gulp-pug')
// const plumber = require("gulp-plumber")

// const browserSync = require('browser-sync')

// const server = browserSync.create()


// ---------------------------------------> End const
// ---------------------------------------> Start Config

gulp.task("html-min", () => {
	return gulp
		.src("./src/*.html")
		.pipe(plumber())
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true,
			})
		)
		.pipe(gulp.dest("./docs"));
});

gulp.task("styles", () => {
	return gulp
		.src("./src/css/*.css")
		.pipe(plumber())
		.pipe(concat("styles-min.css"))
		.pipe(postcss(cssPlugins))
		.pipe(gulp.dest("./docs/assets/css"))
		.pipe(stream());
});

gulp.task("babel", () => {
	return gulp
		.src("./src/js/*.js")
		.pipe(plumber())
		.pipe(concat("scripts-min.js"))
		.pipe(babel())
		.pipe(terser())
		.pipe(gulp.dest("./docs/assets/js"));
});

gulp.task("views", () => {
	return gulp
		.src("./src/views/pages/*.pug")
		.pipe(plumber())
		.pipe(
			pug({
				pretty: production ? false : true,
			})
		)
		.pipe(
			cacheBust({
				type: "timestamp",
			})
		)
		.pipe(gulp.dest("./docs"));
});

gulp.task("sass", () => {
	return gulp
		.src("./src/sass/*.scss")
		.pipe(plumber())
		.pipe(
			sass({
				outputStyle: "compressed",
			})
		)
		.pipe(concat("styles-min.css"))
		.pipe(postcss(cssPlugins))
		.pipe(gulp.dest("./docs/assets/css"))
		.pipe(stream());
});

gulp.task("clean", () => {
	return gulp
		.src("./docs/assets/css/styles-min.css")
		.pipe(plumber())
		.pipe(
			clean({
				content: ["./docs/*.html"],
			})
		)
		.pipe(gulp.dest("./docs/assets/css"));
});

gulp.task("imgmin", () => {
	return gulp
		.src("./src/images/**/*")
		.pipe(plumber())
		.pipe(
			imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
				svgoPlugins: [
					{
						removeViewBox: true,
					},
				],
			})
		)
		.pipe(gulp.dest("./docs/assets/images"));
});

gulp.task("typescript", () => {
	return gulp
		.src("src/ts/*.ts")
		.pipe(
			ts({
				noImplicitAny: true,
				outFile: "using-ts.js",
			})
		)
		.pipe(gulp.dest("docs/js"));
});

// ---------------------------------------> End Config
// ---------------------------------------> Start watch


gulp.task("default", () => {
	server({
		server: "./docs",
	});
	// gulp.watch("./src/*.html", gulp.series("html-min")).on("change", reload);
	gulp.watch('./src/css/*.css', gulp.series("styles")).on('change', reload);
	gulp.watch("./src/views/**/*.pug", gulp.series("views")).on("change", reload);
	gulp.watch("./src/sass/*.scss", gulp.series("sass"));
	gulp.watch("./src/js/*.js", gulp.series("babel")).on("change", reload);
	// gulp.watch("./src/ts/*.ts", gulp.series("typescript")).on("change", reload);
});


// ---------------------------------------> End watch