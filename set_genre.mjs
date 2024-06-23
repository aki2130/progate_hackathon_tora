import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// .envファイルから環境変数を読み込む
dotenv.config();

async function fetchSongInfo(songName) {
    try {
        const response = await fetch(`http://localhost:3000/song-info?name=${encodeURIComponent(songName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const songInfo = await response.json();
        console.log(`曲名: ${songInfo.name}, ジャンル: ${songInfo.genre}`);

        // 既存の環境変数を保持しつつ、新しい環境変数を追加
        const existingEnv = dotenv.parse(fs.readFileSync('.env'));
        existingEnv.SELECTED_GENRE = songInfo.genre;

        // .envファイルを書き出す
        const updatedEnv = Object.entries(existingEnv).map(([key, value]) => `${key}=${value}`).join('\n');
        fs.writeFileSync('.env', updatedEnv);
        console.log(`環境変数を.envファイルに保存しました: SELECTED_GENRE=${songInfo.genre}`);
    } catch (error) {
        console.error('Failed to fetch song info:', error);
    }
}

// 使用例: fetchSongInfo('RockAndRollAllNite');
fetchSongInfo('RockAndRollAllNite');
