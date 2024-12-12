const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");

// Tarefa para compilar SASS
function compilaSass() {
  return gulp
    .src("./source/styles/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./build/styles"));
}

// Tarefa para comprimir imagens
async function comprimeImagens() {
  const imagemin = (await import("gulp-imagemin")).default;
  return gulp
    .src("./source/images/*", { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest("./build/images"));
}

// Tarefa para comprimir JavaScript
function comprimeJS() {
  return gulp
    .src("./source/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./build/scripts"));
}

// Tarefa para observar mudanças
function watchFiles() {
  gulp.watch("./source/styles/*.scss", compilaSass);
  gulp.watch("./source/scripts/*.js", comprimeJS);
  gulp.watch("./source/images/*", comprimeImagens);
}

// Exportando tarefas
exports.compilaSass = compilaSass;
exports.comprimeImagens = comprimeImagens;
exports.comprimeJS = comprimeJS;
exports.watch = watchFiles;

// Tarefa padrão que executa todas as tarefas em série e observa mudanças
exports.default = gulp.series(
  gulp.parallel(compilaSass, comprimeImagens, comprimeJS),
  watchFiles
);
