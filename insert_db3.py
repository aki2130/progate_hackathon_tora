import sqlite3
import glob
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

db = 'music2.db'
conn = sqlite3.connect(db)

cur = conn.cursor()

genre = ["jpop", "kpop", "rock"]

client_id = "bbf52417e9fd4e1392f08f1b8090b721"
client_secret = "fa925e2bd1c04a889f40099fc82c239a"
ccm = SpotifyClientCredentials(
	client_id=client_id, client_secret=client_secret)
spotify = spotipy.Spotify(client_credentials_manager=ccm)

j = 0
for i in range(len(genre)):
	files = glob.glob("./progate_hackathon_tora_data/" + genre[i] + "/*")
	print(files)

	for file in files:
		basename_without_ext = os.path.splitext(os.path.basename(file))[0]
		print(basename_without_ext)

		results = spotify.search(q=basename_without_ext,limit=1, type="track", market="JP", offset=0)

		song_id = ""

		for track in results["tracks"]["items"]:
		    song_id = track["id"]

		#print(j, basename_without_ext, genre[i])
		data = (j, basename_without_ext, genre[i], song_id)
		print(data)
		cur.execute('INSERT INTO music (id, name, genre, song_id) VALUES (?, ?, ?, ?)', data)

		j += 1

conn.commit()
cur.execute('SELECT * FROM new_music')

conn.close()

