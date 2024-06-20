const { src, dest, watch, series } = require ('gulp');

const sass = require ('gulp-sass')(require('sass'));
const postcss = require ('gulp-postcss');
const autoprefixer = require ('autoprefixer');
const sourcemaps = require ('gulp-sourcemaps');
const cssnano = require ('cssnano');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css () {
    return src('src/scss/app.scss') //Idemtificar el archivo
        .pipe( sourcemaps.init() ) // Iniciar sourse map
        .pipe( sass() ) //Compilarlo 
        .pipe( postcss([ autoprefixer(), cssnano() ]) ) //procesar
        .pipe( sourcemaps.write('.') ) //guardar el source map
        .pipe( dest('build/css') ) // Guardar el .css
}

function images( done ) {
    src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3}))
        .pipe( dest('build/img') )

    done();
}

function versionWebp( done ) {
    const options = {
        quality: 50
    }
    src("src/img/**/*.{png,jpg}")
        .pipe( webp( options ) )
        .pipe( dest("./build/img"))

    done();
}

function versionAvif( done ) {
    const options = {
        quality: 50
    }
    src("src/img/**/*.{png,jpg}")
        .pipe( avif( options ) )
        .pipe( dest("./build/img"))

    done();
}

function dev () {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', images);
}

exports.css = css;
exports.dev = dev;
exports.images = images;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif
exports.default = series( images, versionAvif, versionWebp, css, dev );
