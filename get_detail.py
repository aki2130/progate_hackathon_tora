import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pprint
import json

with open('auth.json') as f:
    di = json.load(f)

print(di['Client_ID'])  # deep insider：キーを指定して値を取得
print(di['Clientr_secret'])  # deep insider：キーを指定して値を取得

client_id = di['Client_ID'] # App作成時のCliend ID
client_secret = di['Clientr_secret'] # App作成時のCliend Secret

client_credentials_manager = spotipy.oauth2.SpotifyClientCredentials(client_id, client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

music_id="3Vd6MNEn1aLRvddvuNWYw1"
result=sp.audio_features(music_id)
pprint.pprint(result)
