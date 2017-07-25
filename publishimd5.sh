egret publish -version tempublish
cd bin-release/web/
find . -type f | grep -v \\.svn | grep .png | xargs pngquant --force --ext .png
find . -type f | grep -v \\.svn | grep .jpg | xargs jpegoptim --max=90 --preserve --totals --all-progressive
gulp refile