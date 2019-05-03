#this scripts turns on the GPU then generates audios and downloads it into 
#inferred audios folder

gcloud compute instances --project "instanttv-777" start --zone "us-central1-f" "audio"

gcloud compute --project "instanttv-777" scp --zone "us-central1-f" $1 "mehul@audio:~/text.txt" 

gcloud compute --project "instanttv-777" ssh --zone "us-central1-f" "mehul@audio" -- 'source /etc/profile;sh generate.sh'

rm -r infered_audios

#gcloud compute --project "instanttv-777" scp --recurse --zone "us-central1-f" "mehul@audio:~/infered_audios" ./
gcloud compute --project "instanttv-777" scp --recurse --zone "us-central1-f" "mehul@audio:~/infered_audios" ./infered_audios/$1

gcloud compute instances --project "instanttv-777" stop --zone "us-central1-f" "audio"

#cp $1 /home/videsh/Desktop

#echo "Hello";
#echo "First arg: $1"