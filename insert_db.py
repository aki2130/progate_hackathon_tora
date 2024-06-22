import sqlite3
import glob
import os

db = 'music.sqlite3'
conn = sqlite3.connect(db)

cur = conn.cursor()

genre = ["jpop", "kpop", "rock"]

j = 0
for i in range(len(genre)):
	files = glob.glob("./progate_hackathon_tora_data/" + genre[i] + "/*")

	for file in files:
		basename_without_ext = os.path.splitext(os.path.basename(file))[0]

		#print(j, basename_without_ext, genre[i])
		data = (j, basename_without_ext, genre[i])
		cur.execute('INSERT INTO music (id, name, genre) VALUES (?, ?, ?)', data)
	
		j += 1

conn.commit()
cur.execute('SELECT * FROM music')

conn.close()

