# AdobePSMaster
This is used to process a large amount of pictures 

To convert images from HEIC to JPG

Open Terminal

#Check current folder
pwd
#if need to change dir
cd /Users/yuhuigan/.../...

#create inside dir folder
mkdir Converted

#Convert the folder of image
for file in *.HEIC *.heic; do 
    [ -e "$file" ] || continue
    echo "Processing: $file"
    sips -s format jpeg "$file" --out Converted/"${file%.*}.jpg"
done


mkdir Converted
for file in *.HEIC; do sips -s format jpeg "$file" --out Converted/"${file%.*}.jpg"; done


