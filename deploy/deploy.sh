shopt -s extglob

echo 'Deleting everything'
#delete everything except this deploy script, the and dist.zip
rm -r !(deploy.sh|dist.zip)

shopt -u extglob

echo 'Deploying zip'
#unzip
unzip -o *.zip

rm -r dist.zip

echo 'Done'
